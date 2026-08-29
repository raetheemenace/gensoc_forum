import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Persistent storage path
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'comments_db.json');

// Ensure data directory and db file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Supabase lazy client
let serverSupabase: SupabaseClient | null = null;

function getServerSupabase(): SupabaseClient | null {
  if (serverSupabase) return serverSupabase;
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (url && key && url !== 'https://your-project-id.supabase.co' && !url.includes('your-project-id')) {
    try {
      serverSupabase = createClient(url, key, {
        auth: { persistSession: false }
      });
      return serverSupabase;
    } catch (err) {
      console.warn('Server Supabase initialization warning:', err);
      return null;
    }
  }
  return null;
}

interface CommentReply {
  id: string;
  author: string;
  avatar: string;
  role?: string;
  timestamp: string;
  content: string;
  likes: number;
}

interface ForumComment {
  id: string;
  author: string;
  avatar: string;
  role?: string;
  timestamp: string;
  promptId: string;
  promptText: string;
  tag: string;
  content: string;
  likes: number;
  replies: CommentReply[];
}

function readComments(): ForumComment[] {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading comments file:', err);
  }
  return [];
}

function writeComments(comments: ForumComment[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(comments, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing comments file:', err);
  }
}

// ----------------- API ROUTES ----------------- //

// Health check & Supabase connection status
app.get('/api/health', (req, res) => {
  const sb = getServerSupabase();
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    supabaseConfigured: Boolean(sb)
  });
});

app.get('/api/supabase-status', (req, res) => {
  const sb = getServerSupabase();
  res.json({
    configured: Boolean(sb),
    mode: sb ? 'supabase' : 'local_storage'
  });
});

// GET all comments
app.get('/api/comments', async (req, res) => {
  const sb = getServerSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from('forum_comments')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        const formatted: ForumComment[] = data.map((item) => ({
          id: item.id,
          author: item.author || 'Anonymous Contributor',
          avatar: item.avatar || (item.author ? item.author.charAt(0).toUpperCase() : 'A'),
          role: item.role || 'Student Contributor',
          timestamp: item.timestamp || (item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) : new Date().toLocaleDateString()),
          promptId: item.prompt_id || item.promptId || 'prompt-1',
          promptText: item.prompt_text || item.promptText || '',
          tag: item.tag || 'General Reflection',
          content: item.content || '',
          likes: typeof item.likes === 'number' ? item.likes : 0,
          replies: Array.isArray(item.replies) ? item.replies : []
        }));
        
        // Cache to disk
        writeComments(formatted);
        res.json(formatted);
        return;
      }
    } catch (err) {
      console.warn('Supabase fetch failed, falling back to local storage:', err);
    }
  }

  // Fallback to local persistent JSON file
  const comments = readComments();
  res.json(comments);
});

// POST new comment
app.post('/api/comments', async (req, res) => {
  const { author, promptId, promptText, tag, content, role } = req.body;

  if (!content || typeof content !== 'string' || !content.trim()) {
    res.status(400).json({ error: 'Content is required' });
    return;
  }

  const trimmedAuthor = (author && typeof author === 'string' && author.trim()) 
    ? author.trim() 
    : 'Anonymous Contributor';

  const newComment: ForumComment = {
    id: `comment_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    author: trimmedAuthor,
    avatar: trimmedAuthor.charAt(0).toUpperCase(),
    role: role || (trimmedAuthor === 'Anonymous Contributor' ? 'Anonymous' : 'Student Contributor'),
    timestamp: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    promptId: promptId || 'prompt-1',
    promptText: promptText || "Prompt 1: What fuels negative perceptions about women in today's digital age?",
    tag: tag || 'Theoretical Reflection',
    content: content.trim(),
    likes: 0,
    replies: []
  };

  const sb = getServerSupabase();
  if (sb) {
    try {
      await sb.from('forum_comments').insert([
        {
          id: newComment.id,
          author: newComment.author,
          avatar: newComment.avatar,
          role: newComment.role,
          timestamp: newComment.timestamp,
          prompt_id: newComment.promptId,
          prompt_text: newComment.promptText,
          tag: newComment.tag,
          content: newComment.content,
          likes: newComment.likes,
          replies: newComment.replies,
          created_at: new Date().toISOString()
        }
      ]);
    } catch (err) {
      console.warn('Could not insert to Supabase table, persisted to local storage:', err);
    }
  }

  const currentComments = readComments();
  const updated = [newComment, ...currentComments];
  writeComments(updated);

  res.status(201).json(newComment);
});

// POST like comment
app.post('/api/comments/:id/like', async (req, res) => {
  const { id } = req.params;
  const { increment } = req.body; // true = +1, false = -1
  const change = increment === false ? -1 : 1;

  const currentComments = readComments();
  let found = false;

  const updated = currentComments.map(c => {
    if (c.id === id) {
      found = true;
      return {
        ...c,
        likes: Math.max(0, (c.likes || 0) + change)
      };
    }
    return c;
  });

  if (!found) {
    res.status(404).json({ error: 'Comment not found' });
    return;
  }

  writeComments(updated);
  const finalLikes = updated.find(c => c.id === id)?.likes ?? 0;

  const sb = getServerSupabase();
  if (sb) {
    try {
      await sb
        .from('forum_comments')
        .update({ likes: finalLikes })
        .eq('id', id);
    } catch (err) {
      console.warn('Supabase like update failed:', err);
    }
  }

  res.json({ success: true, likes: finalLikes });
});

// POST add reply
app.post('/api/comments/:id/replies', async (req, res) => {
  const { id } = req.params;
  const { author, content, role } = req.body;

  if (!content || typeof content !== 'string' || !content.trim()) {
    res.status(400).json({ error: 'Reply content is required' });
    return;
  }

  const trimmedAuthor = (author && typeof author === 'string' && author.trim()) 
    ? author.trim() 
    : 'Anonymous Peer';

  const newReply: CommentReply = {
    id: `reply_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    author: trimmedAuthor,
    avatar: trimmedAuthor.charAt(0).toUpperCase(),
    role: role || 'Peer Contributor',
    timestamp: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    content: content.trim(),
    likes: 0
  };

  const currentComments = readComments();
  let found = false;
  let targetReplies: CommentReply[] = [];

  const updated = currentComments.map(c => {
    if (c.id === id) {
      found = true;
      targetReplies = [...(c.replies || []), newReply];
      return {
        ...c,
        replies: targetReplies
      };
    }
    return c;
  });

  if (!found) {
    res.status(404).json({ error: 'Parent comment not found' });
    return;
  }

  writeComments(updated);

  const sb = getServerSupabase();
  if (sb) {
    try {
      await sb
        .from('forum_comments')
        .update({ replies: targetReplies })
        .eq('id', id);
    } catch (err) {
      console.warn('Supabase reply update failed:', err);
    }
  }

  res.status(201).json(newReply);
});

// POST like reply
app.post('/api/comments/:id/replies/:replyId/like', async (req, res) => {
  const { id, replyId } = req.params;
  const { increment } = req.body;
  const change = increment === false ? -1 : 1;

  const currentComments = readComments();
  let found = false;
  let updatedReplies: CommentReply[] = [];

  const updated = currentComments.map(c => {
    if (c.id === id) {
      updatedReplies = (c.replies || []).map(r => {
        if (r.id === replyId) {
          found = true;
          return {
            ...r,
            likes: Math.max(0, (r.likes || 0) + change)
          };
        }
        return r;
      });
      return {
        ...c,
        replies: updatedReplies
      };
    }
    return c;
  });

  if (!found) {
    res.status(404).json({ error: 'Reply not found' });
    return;
  }

  writeComments(updated);

  const sb = getServerSupabase();
  if (sb) {
    try {
      await sb
        .from('forum_comments')
        .update({ replies: updatedReplies })
        .eq('id', id);
    } catch (err) {
      console.warn('Supabase reply like update failed:', err);
    }
  }

  res.json({ success: true });
});

// ----------------- VITE MIDDLEWARE ----------------- //

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

