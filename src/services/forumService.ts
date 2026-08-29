import { getSupabaseClient } from '../lib/supabase';

export interface CommentReply {
  id: string;
  author: string;
  avatar: string;
  role?: string;
  timestamp: string;
  content: string;
  likes: number;
}

export interface ForumComment {
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

const LOCAL_STORAGE_COMMENTS_KEY = 'gender_society_forum_comments_v2';

export const DEFAULT_INITIAL_COMMENTS: ForumComment[] = [
  {
    id: 'seed-1',
    author: 'Maria Clara Santos',
    avatar: 'M',
    role: 'Student Contributor',
    timestamp: 'May 18, 2026, 09:24 AM',
    promptId: 'prompt-1',
    promptText: "Prompt 1: What fuels negative perceptions about women in today's digital age?",
    tag: 'Historical & Media Bias',
    content: "When we look at social media algorithms, women—especially women in public leadership or politics—are disproportionately targeted by coordinated disinformation campaigns and gendered tropes. It's an evolution of the historical 'deviant woman' stereotype repackaged into digital harassment.",
    likes: 12,
    replies: [
      {
        id: 'reply-1-1',
        author: 'Joshua Hernandez',
        avatar: 'J',
        role: 'Peer Contributor',
        timestamp: 'May 18, 2026, 10:05 AM',
        content: 'Spot on. This connects directly with the lecture on how media consolidates patriarchal norms by policing women who challenge traditional roles.',
        likes: 4
      }
    ]
  },
  {
    id: 'seed-2',
    author: 'Alyssa Chen',
    avatar: 'A',
    role: 'Student Contributor',
    timestamp: 'May 18, 2026, 11:40 AM',
    promptId: 'prompt-2',
    promptText: "Prompt 2: How can anti-oppressive frameworks reshape institutions?",
    tag: 'Anti-Oppressive Praxis',
    content: "Anti-oppressive practice cannot just be a checklist. In educational institutions, it requires restructuring curriculum, addressing tenure disparities, and dismantling implicit biases that penalize women and non-binary individuals for assertive leadership.",
    likes: 8,
    replies: []
  },
  {
    id: 'seed-3',
    author: 'Dianne Morales',
    avatar: 'D',
    role: 'Student Contributor',
    timestamp: 'May 18, 2026, 01:15 PM',
    promptId: 'prompt-3',
    promptText: 'Prompt 3: In what ways do class, race, and gender intersect in labor?',
    tag: 'Intersectional Analysis',
    content: "Care work and domestic labor continue to be severely undervalued because of the historical intersection of gender subordination and economic exploitation. Marxist-Feminist critique highlights how capitalism relies on unpaid reproductive labor to sustain itself.",
    likes: 15,
    replies: [
      {
        id: 'reply-3-1',
        author: 'Bea De Leon',
        avatar: 'B',
        role: 'Peer Contributor',
        timestamp: 'May 18, 2026, 02:00 PM',
        content: 'Exactly. Especially in Southeast Asian diaspora contexts where domestic migrant workers carry immense economic burdens with minimal institutional protections.',
        likes: 6
      }
    ]
  }
];

// Helper to get local comments
function getLocalComments(): ForumComment[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_COMMENTS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading from local storage:', err);
  }
  return DEFAULT_INITIAL_COMMENTS;
}

// Helper to save local comments
function saveLocalComments(comments: ForumComment[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_COMMENTS_KEY, JSON.stringify(comments));
  } catch (err) {
    console.warn('Error writing to local storage:', err);
  }
}

/**
 * Fetch all comments with multi-tier fallback:
 * 1. Supabase direct client (works on Vercel, mobile, preview, offline-first)
 * 2. Backend Express API (/api/comments)
 * 3. LocalStorage persistence
 */
export async function getComments(): Promise<ForumComment[]> {
  // 1. Try Direct Supabase Client
  const sb = getSupabaseClient();
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
        saveLocalComments(formatted);
        return formatted;
      }
    } catch (err) {
      console.warn('Supabase client fetch warning:', err);
    }
  }

  // 2. Try Backend API
  try {
    const res = await fetch('/api/comments', { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        saveLocalComments(data);
        return data;
      }
    }
  } catch {
    // API not available (e.g. static hosting on Vercel)
  }

  // 3. Fallback to Local Storage
  return getLocalComments();
}

/**
 * Create a new comment
 */
export async function createComment(newCommentData: {
  author: string;
  role: string;
  promptId: string;
  promptText: string;
  tag: string;
  content: string;
}): Promise<ForumComment> {
  const newComment: ForumComment = {
    id: `comment_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    author: newCommentData.author,
    avatar: newCommentData.author.charAt(0).toUpperCase(),
    role: newCommentData.role,
    timestamp: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    promptId: newCommentData.promptId,
    promptText: newCommentData.promptText,
    tag: newCommentData.tag,
    content: newCommentData.content,
    likes: 0,
    replies: []
  };

  // 1. Try Direct Supabase Client
  const sb = getSupabaseClient();
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
      console.warn('Supabase client insert failed:', err);
    }
  }

  // 2. Try Backend API
  try {
    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCommentData),
      signal: AbortSignal.timeout(3000)
    });
  } catch {
    // API not available, will use local persistence
  }

  // 3. Always save to local storage
  const current = getLocalComments();
  const updated = [newComment, ...current.filter(c => c.id !== newComment.id)];
  saveLocalComments(updated);

  return newComment;
}

/**
 * Toggle like for a comment
 */
export async function toggleLikeComment(commentId: string, increment: boolean): Promise<number> {
  const current = getLocalComments();
  let finalLikes = 0;

  const updated = current.map(c => {
    if (c.id === commentId) {
      finalLikes = Math.max(0, (c.likes || 0) + (increment ? 1 : -1));
      return { ...c, likes: finalLikes };
    }
    return c;
  });

  saveLocalComments(updated);

  // Supabase update
  const sb = getSupabaseClient();
  if (sb) {
    try {
      await sb.from('forum_comments').update({ likes: finalLikes }).eq('id', commentId);
    } catch (err) {
      console.warn('Supabase update like error:', err);
    }
  }

  // API update
  try {
    await fetch(`/api/comments/${commentId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ increment }),
      signal: AbortSignal.timeout(3000)
    });
  } catch {
    // API not available
  }

  return finalLikes;
}

/**
 * Add a reply to a comment
 */
export async function createReply(commentId: string, replyData: {
  author: string;
  content: string;
  role: string;
}): Promise<CommentReply> {
  const newReply: CommentReply = {
    id: `reply_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    author: replyData.author,
    avatar: replyData.author.charAt(0).toUpperCase(),
    role: replyData.role,
    timestamp: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    content: replyData.content,
    likes: 0
  };

  const current = getLocalComments();
  let targetReplies: CommentReply[] = [];

  const updated = current.map(c => {
    if (c.id === commentId) {
      targetReplies = [...(c.replies || []), newReply];
      return { ...c, replies: targetReplies };
    }
    return c;
  });

  saveLocalComments(updated);

  // Supabase direct
  const sb = getSupabaseClient();
  if (sb) {
    try {
      await sb.from('forum_comments').update({ replies: targetReplies }).eq('id', commentId);
    } catch (err) {
      console.warn('Supabase reply update failed:', err);
    }
  }

  // API fallback
  try {
    await fetch(`/api/comments/${commentId}/replies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(replyData),
      signal: AbortSignal.timeout(3000)
    });
  } catch {
    // API not available
  }

  return newReply;
}

/**
 * Toggle like for a reply
 */
export async function toggleLikeReply(commentId: string, replyId: string, increment: boolean) {
  const current = getLocalComments();
  let updatedReplies: CommentReply[] = [];

  const updated = current.map(c => {
    if (c.id === commentId) {
      updatedReplies = (c.replies || []).map(r => {
        if (r.id === replyId) {
          return { ...r, likes: Math.max(0, (r.likes || 0) + (increment ? 1 : -1)) };
        }
        return r;
      });
      return { ...c, replies: updatedReplies };
    }
    return c;
  });

  saveLocalComments(updated);

  const sb = getSupabaseClient();
  if (sb) {
    try {
      await sb.from('forum_comments').update({ replies: updatedReplies }).eq('id', commentId);
    } catch (err) {
      console.warn('Supabase reply like update failed:', err);
    }
  }

  try {
    await fetch(`/api/comments/${commentId}/replies/${replyId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ increment }),
      signal: AbortSignal.timeout(3000)
    });
  } catch {
    // API not available
  }
}
