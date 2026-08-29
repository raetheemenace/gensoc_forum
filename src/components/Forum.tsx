import { useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  ThumbsUp, 
  MessageCircle, 
  Send, 
  Search, 
  Filter, 
  Sparkles, 
  Check, 
  Copy, 
  User, 
  ChevronDown, 
  ChevronUp,
  BookOpen,
  CornerDownRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { ForumComment, CommentReply } from '../types';
import { DISCUSSION_PROMPTS, FORUM_TAGS } from '../data/forumData';
import { 
  getComments as fetchForumComments, 
  createComment as postForumComment, 
  toggleLikeComment as apiToggleLikeComment, 
  createReply as postForumReply, 
  toggleLikeReply as apiToggleLikeReply 
} from '../services/forumService';

const LOCAL_LIKES_KEY = 'gender_society_user_liked_posts';
const LOCAL_REPLY_LIKES_KEY = 'gender_society_user_liked_replies';

export default function Forum() {
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [networkError, setNetworkError] = useState<string | null>(null);

  // Local likes tracking
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_LIKES_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [likedReplies, setLikedReplies] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_REPLY_LIKES_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Filters & State
  const [selectedPromptId, setSelectedPromptId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'recent' | 'top' | 'replies'>('recent');
  
  // Post Form State
  const [authorName, setAuthorName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [activeFormPrompt, setActiveFormPrompt] = useState(DISCUSSION_PROMPTS[0].id);
  const [selectedTag, setSelectedTag] = useState(FORUM_TAGS[0]);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [formFeedback, setFormFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Reply Form State
  const [activeReplyPostId, setActiveReplyPostId] = useState<string | null>(null);
  const [replyAuthor, setReplyAuthor] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Save likes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_LIKES_KEY, JSON.stringify(likedPosts));
    } catch {
      // storage guard
    }
  }, [likedPosts]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_REPLY_LIKES_KEY, JSON.stringify(likedReplies));
    } catch {
      // storage guard
    }
  }, [likedReplies]);

  // Fetch real comments from server or Supabase/local cache
  const fetchComments = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    setNetworkError(null);

    try {
      const data = await fetchForumComments();
      setComments(data);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unable to connect to live forum backend';
      setNetworkError(errorMsg);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial load + background poll every 10s for real-time peer posts
  useEffect(() => {
    fetchComments();
    const interval = setInterval(() => {
      fetchComments(true);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Post comment handler
  const handlePostComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCommentContent.trim()) {
      setFormFeedback({ type: 'error', message: 'Please provide substantive academic commentary.' });
      setTimeout(() => setFormFeedback(null), 3000);
      return;
    }

    const targetPrompt = DISCUSSION_PROMPTS.find(p => p.id === activeFormPrompt) || DISCUSSION_PROMPTS[0];
    const finalAuthor = isAnonymous ? 'Anonymous Contributor' : (authorName.trim() || 'Student Contributor');

    setIsSubmitting(true);
    setFormFeedback(null);

    try {
      const createdComment = await postForumComment({
        author: finalAuthor,
        promptId: targetPrompt.id,
        promptText: targetPrompt.title,
        tag: selectedTag,
        content: newCommentContent.trim(),
        role: isAnonymous ? 'Anonymous' : 'Student Participant'
      });

      setComments(prev => [createdComment, ...prev.filter(c => c.id !== createdComment.id)]);
      setNewCommentContent('');
      if (!isAnonymous) setAuthorName('');
      setFormFeedback({ type: 'success', message: 'Your comment has been posted live to the class forum!' });
      setTimeout(() => setFormFeedback(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error posting response. Please try again.';
      setFormFeedback({ type: 'error', message: msg });
      setTimeout(() => setFormFeedback(null), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Like comment handler
  const handleToggleLike = async (commentId: string) => {
    const isCurrentlyLiked = !likedPosts[commentId];
    const newLikedState = !isCurrentlyLiked;

    // Optimistic UI update
    setLikedPosts(prev => ({ ...prev, [commentId]: newLikedState }));
    setComments(prev =>
      prev.map(c => {
        if (c.id === commentId) {
          return {
            ...c,
            likes: Math.max(0, (c.likes || 0) + (newLikedState ? 1 : -1))
          };
        }
        return c;
      })
    );

    try {
      await apiToggleLikeComment(commentId, newLikedState);
    } catch {
      // Revert on failure
      fetchComments(true);
    }
  };

  // Submit reply handler
  const handleAddReply = async (commentId: string) => {
    if (!replyContent.trim()) return;

    const finalReplyAuthor = replyAuthor.trim() || 'Student Peer';
    setIsSubmittingReply(commentId);

    try {
      const createdReply = await postForumReply(commentId, {
        author: finalReplyAuthor,
        content: replyContent.trim(),
        role: 'Peer Contributor'
      });

      setComments(prev =>
        prev.map(c => {
          if (c.id === commentId) {
            return {
              ...c,
              replies: [...(c.replies || []), createdReply]
            };
          }
          return c;
        })
      );

      setReplyContent('');
      setReplyAuthor('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReply(null);
    }
  };

  // Like reply handler
  const handleToggleReplyLike = async (commentId: string, replyId: string) => {
    const isCurrentlyLiked = !likedReplies[replyId];
    const newLikedState = !isCurrentlyLiked;

    setLikedReplies(prev => ({ ...prev, [replyId]: newLikedState }));
    setComments(prev =>
      prev.map(c => {
        if (c.id === commentId) {
          return {
            ...c,
            replies: (c.replies || []).map(r => {
              if (r.id === replyId) {
                return {
                  ...r,
                  likes: Math.max(0, (r.likes || 0) + (newLikedState ? 1 : -1))
                };
              }
              return r;
            })
          };
        }
        return c;
      })
    );

    try {
      await apiToggleLikeReply(commentId, replyId, newLikedState);
    } catch {
      fetchComments(true);
    }
  };

  const handleCopyShare = (commentId: string, content: string) => {
    navigator.clipboard.writeText(`"${content}" — GEE001B Gender & Society Forum`);
    setCopiedId(commentId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered & Sorted Comments
  const filteredComments = comments.filter(c => {
    const matchesPrompt = selectedPromptId === 'all' || c.promptId === selectedPromptId;
    const matchesSearch = 
      (c.content || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.author || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.tag || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.promptText || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.replies || []).some(r => (r.content || '').toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesPrompt && matchesSearch;
  });

  const sortedComments = [...filteredComments].sort((a, b) => {
    if (sortBy === 'top') {
      return (b.likes || 0) - (a.likes || 0);
    }
    if (sortBy === 'replies') {
      return (b.replies?.length || 0) - (a.replies?.length || 0);
    }
    return 0; // Default recent order from server
  });

  return (
    <section id="forum" className="scroll-mt-16 w-full">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="p-2 bg-[#000000] text-white rounded-sm">
                <MessageSquare className="w-5 h-5" />
              </span>
              <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold">
                Section 7 • Online Forum (Live Interactive Component)
              </span>
            </div>
            <h2 id="forum-main-heading" className="text-3xl md:text-5xl font-bold tracking-tight text-[#121212]">
              Student Discussion Board
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchComments(true)}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white border border-gray-200 text-gray-700 hover:text-black hover:border-black rounded-sm transition-all cursor-pointer shadow-xs"
              title="Refresh discussion feed"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Updating...' : 'Refresh Feed'}</span>
            </button>
            <span className="text-xs px-2.5 py-1.5 bg-black text-white font-medium rounded-sm">
              Live Real-Time
            </span>
          </div>
        </div>
        <div className="w-20 h-1 bg-[#000000] mb-8" />

        {/* The 2 Core Prompts Defined in the MD Blueprint */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {DISCUSSION_PROMPTS.map((prompt, idx) => {
            const isSelected = selectedPromptId === prompt.id;
            return (
              <div
                key={prompt.id}
                id={`prompt-card-${prompt.id}`}
                onClick={() => {
                  setSelectedPromptId(isSelected ? 'all' : prompt.id);
                  setActiveFormPrompt(prompt.id);
                }}
                className={`p-6 cursor-pointer border transition-all duration-300 rounded-sm text-left flex flex-col justify-between ${
                  isSelected 
                    ? 'border-black bg-black text-white shadow-md' 
                    : 'border-gray-200 bg-white text-gray-800 hover:border-black hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`text-xs uppercase tracking-wider font-semibold ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                      Official Module Prompt {idx + 1}
                    </span>
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-base md:text-lg leading-snug mb-3">
                    {prompt.title}
                  </h3>
                  <p className={`text-xs font-light leading-relaxed ${isSelected ? 'text-gray-300' : 'text-gray-600'}`}>
                    {prompt.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-5 pt-3 border-t border-gray-200/20">
                  {prompt.tags.map(t => (
                    <span 
                      key={t}
                      className={`text-[10px] px-2 py-0.5 rounded-sm font-medium ${
                        isSelected ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Main Forum Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Post Response Form */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white border border-gray-200 p-6 md:p-8 shadow-xs rounded-sm sticky top-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-4 h-4 text-black" />
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                Post Discussion Comment
              </h3>
            </div>

            <form onSubmit={handlePostComment} className="flex flex-col gap-5">
              {/* Discussion Prompt Selector */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-2">
                  Select Topic Prompt
                </label>
                <select
                  id="prompt-select-dropdown"
                  value={activeFormPrompt}
                  onChange={(e) => setActiveFormPrompt(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-sm p-3 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                >
                  {DISCUSSION_PROMPTS.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Author Identification & Anonymous Option */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700">
                    Author / Student Name
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className="text-xs text-gray-600 hover:text-black underline transition-colors cursor-pointer"
                  >
                    {isAnonymous ? 'Enter My Name' : 'Post Anonymously'}
                  </button>
                </div>
                {isAnonymous ? (
                  <div className="w-full bg-gray-100 border border-gray-200 rounded-sm p-3 text-xs text-gray-600 italic">
                    Posting as: Anonymous Contributor
                  </div>
                ) : (
                  <input
                    id="author-name-input"
                    type="text"
                    placeholder="e.g., John Raven / Student ID..."
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-sm p-3 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                )}
              </div>

              {/* Theoretical Tag */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700 mb-2">
                  Perspective / Theoretical Focus
                </label>
                <select
                  id="tag-select-dropdown"
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-sm p-3 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                >
                  {FORUM_TAGS.map(tag => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>

              {/* Content Textarea */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-700">
                    Your Analysis / Response
                  </label>
                  <span className="text-[11px] text-gray-400">
                    {newCommentContent.length} chars
                  </span>
                </div>
                <textarea
                  id="new-comment-textarea"
                  rows={5}
                  required
                  placeholder="Share your thoughts, analysis, or critique based on the course materials..."
                  value={newCommentContent}
                  onChange={(e) => setNewCommentContent(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-sm p-3 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black resize-none transition-all leading-relaxed"
                />
              </div>

              {/* Feedback toast */}
              <AnimatePresence>
                {formFeedback && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`p-3 border text-xs font-medium rounded-sm flex items-center gap-2 ${
                      formFeedback.type === 'success' 
                        ? 'bg-gray-50 border-black text-black' 
                        : 'bg-red-50 border-red-500 text-red-700'
                    }`}
                  >
                    {formFeedback.type === 'success' ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    {formFeedback.message}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button
                id="submit-comment-button"
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 py-3 px-6 rounded-sm text-sm font-medium tracking-wide flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Publishing...' : 'Submit to Live Forum'}
              </button>

              <p className="text-[11px] text-gray-400 text-center font-light mt-1">
                Real-time persistence active. Comments are visible to all students visiting the platform.
              </p>
            </form>
          </motion.div>
        </div>

        {/* Right Column: Live Feed */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Controls Bar */}
          <div className="bg-white border border-gray-200 p-4 rounded-sm flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between shadow-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="forum-search-input"
                type="text"
                placeholder="Search perspectives, tags, or student names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-sm pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2 py-1.5 rounded-sm">
                <Filter className="w-3.5 h-3.5 text-gray-500" />
                <select
                  id="prompt-filter-dropdown"
                  value={selectedPromptId}
                  onChange={(e) => setSelectedPromptId(e.target.value)}
                  className="bg-transparent text-xs text-gray-700 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Topics ({comments.length})</option>
                  <option value="prompt-1">Prompt 1</option>
                  <option value="prompt-2">Prompt 2</option>
                </select>
              </div>

              <select
                id="forum-sort-dropdown"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'top' | 'replies')}
                className="bg-gray-50 border border-gray-200 text-xs text-gray-700 px-3 py-2 rounded-sm focus:outline-none cursor-pointer"
              >
                <option value="recent">Most Recent</option>
                <option value="top">Most Upvoted</option>
                <option value="replies">Most Discussed</option>
              </select>
            </div>
          </div>

          {/* Network Error Banner if any */}
          {networkError && (
            <div className="bg-gray-100 border border-gray-300 p-4 rounded-sm text-xs text-gray-700 flex items-center justify-between">
              <span>{networkError}</span>
              <button 
                onClick={() => fetchComments()}
                className="underline font-semibold hover:text-black"
              >
                Retry
              </button>
            </div>
          )}

          {/* Active Filter Pill */}
          {selectedPromptId !== 'all' && (
            <div className="flex items-center justify-between bg-black text-white px-4 py-2.5 rounded-sm text-xs">
              <span>
                Filtering: <strong>{DISCUSSION_PROMPTS.find(p => p.id === selectedPromptId)?.title}</strong>
              </span>
              <button
                onClick={() => setSelectedPromptId('all')}
                className="underline hover:text-gray-300 ml-3 cursor-pointer"
              >
                View All Topics
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="bg-white border border-gray-200 p-12 text-center rounded-sm">
              <RefreshCw className="w-6 h-6 text-gray-400 animate-spin mx-auto mb-3" />
              <p className="text-xs text-gray-500 font-light">Loading live discussion board...</p>
            </div>
          )}

          {/* Empty State (No Placeholders) */}
          {!isLoading && sortedComments.length === 0 && (
            <div className="bg-white border border-gray-200 p-12 text-center rounded-sm">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-gray-600" />
              </div>
              <h4 className="text-base font-bold text-gray-900 mb-1">
                {searchQuery ? 'No matching discussion entries' : 'No comments submitted yet'}
              </h4>
              <p className="text-xs text-gray-500 max-w-md mx-auto mb-6 font-light leading-relaxed">
                {searchQuery 
                  ? `No student entries matched "${searchQuery}". Clear your search query to see all responses.`
                  : 'Be the first student to post an analytical perspective on Prompt 1 or Prompt 2 using the response form on the left!'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs bg-black text-white px-4 py-2 rounded-sm hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}

          {/* Real Live Comments List */}
          <div className="flex flex-col gap-6">
            {sortedComments.map((post, idx) => {
              const isReplying = activeReplyPostId === post.id;
              const hasUserLiked = !!likedPosts[post.id];

              return (
                <motion.article
                  key={post.id}
                  id={`discussion-post-${post.id}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(idx * 0.05, 0.2) }}
                  className="bg-white border border-gray-200 p-6 md:p-7 shadow-xs rounded-sm hover:border-gray-300 transition-all duration-200"
                >
                  {/* Author & Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-semibold text-sm shrink-0">
                        {post.avatar || <User className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-gray-900 leading-tight">
                            {post.author}
                          </h4>
                          {post.role && (
                            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-gray-100 text-gray-700 rounded-xs">
                              {post.role}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-400 font-light">
                          {post.timestamp}
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] px-2.5 py-1 bg-gray-100 text-gray-800 font-medium rounded-sm border border-gray-200 shrink-0">
                      {post.tag}
                    </span>
                  </div>

                  {/* Context Prompt Badge */}
                  <div className="bg-gray-50 border-l-2 border-black px-3.5 py-2 mb-4 rounded-r-sm">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 block mb-0.5">
                      Responding to Topic:
                    </span>
                    <p className="text-xs font-medium text-gray-800">
                      {post.promptText}
                    </p>
                  </div>

                  {/* Body Content */}
                  <p className="text-gray-800 text-sm leading-relaxed font-light mb-6 whitespace-pre-line">
                    {post.content}
                  </p>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      {/* Upvote Button */}
                      <button
                        id={`like-btn-${post.id}`}
                        onClick={() => handleToggleLike(post.id)}
                        className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-sm transition-all cursor-pointer ${
                          hasUserLiked 
                            ? 'bg-black text-white' 
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-black'
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${hasUserLiked ? 'fill-white' : ''}`} />
                        <span>{post.likes || 0}</span>
                      </button>

                      {/* Reply Thread Toggle */}
                      <button
                        id={`reply-toggle-btn-${post.id}`}
                        onClick={() => setActiveReplyPostId(isReplying ? null : post.id)}
                        className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-sm transition-all cursor-pointer ${
                          isReplying 
                            ? 'bg-gray-100 text-black font-semibold' 
                            : 'text-gray-600 hover:text-black hover:bg-gray-50'
                        }`}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{post.replies?.length || 0} {(post.replies?.length === 1) ? 'Reply' : 'Replies'}</span>
                        {isReplying ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
                      </button>
                    </div>

                    {/* Share / Copy */}
                    <button
                      id={`share-btn-${post.id}`}
                      onClick={() => handleCopyShare(post.id, post.content)}
                      className="text-gray-400 hover:text-black p-1.5 rounded-sm hover:bg-gray-50 transition-colors cursor-pointer"
                      title="Copy response quote"
                    >
                      {copiedId === post.id ? (
                        <span className="flex items-center gap-1 text-[11px] text-black font-semibold">
                          <Check className="w-3.5 h-3.5" /> Copied
                        </span>
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Threaded Replies Section */}
                  <AnimatePresence>
                    {(isReplying || (post.replies && post.replies.length > 0)) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-4 overflow-hidden"
                      >
                        {/* Existing Replies */}
                        {post.replies && post.replies.length > 0 && (
                          <div className="flex flex-col gap-3 pl-4 md:pl-6 border-l-2 border-gray-100">
                            {post.replies.map(reply => {
                              const hasUserLikedReply = !!likedReplies[reply.id];
                              return (
                                <div 
                                  key={reply.id}
                                  className="bg-gray-50/80 p-4 rounded-sm border border-gray-100"
                                >
                                  <div className="flex items-center justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                      <CornerDownRight className="w-3 h-3 text-gray-400" />
                                      <span className="font-semibold text-xs text-gray-900">
                                        {reply.author}
                                      </span>
                                      {reply.role && (
                                        <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.2 bg-white text-gray-600 rounded-xs border border-gray-200">
                                          {reply.role}
                                        </span>
                                      )}
                                      <span className="text-[10px] text-gray-400 font-light">
                                        • {reply.timestamp}
                                      </span>
                                    </div>
                                    <button
                                      onClick={() => handleToggleReplyLike(post.id, reply.id)}
                                      className={`flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded-sm transition-colors cursor-pointer ${
                                        hasUserLikedReply ? 'text-black font-semibold' : 'text-gray-400 hover:text-black'
                                      }`}
                                    >
                                      <ThumbsUp className="w-2.5 h-2.5" />
                                      <span>{reply.likes || 0}</span>
                                    </button>
                                  </div>
                                  <p className="text-xs text-gray-700 font-light leading-relaxed pl-5">
                                    {reply.content}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Inline Reply Input Box */}
                        {isReplying && (
                          <div className="pl-4 md:pl-6 border-l-2 border-black flex flex-col gap-2 pt-2">
                            <div className="flex flex-col sm:flex-row gap-2">
                              <input
                                type="text"
                                placeholder="Your name (optional)..."
                                value={replyAuthor}
                                onChange={(e) => setReplyAuthor(e.target.value)}
                                className="sm:w-1/3 bg-gray-50 border border-gray-200 rounded-sm px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-black"
                              />
                              <div className="flex-1 relative">
                                <input
                                  type="text"
                                  placeholder="Write a reasoned reply..."
                                  value={replyContent}
                                  onChange={(e) => setReplyContent(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleAddReply(post.id);
                                    }
                                  }}
                                  className="w-full bg-gray-50 border border-gray-200 rounded-sm px-3 py-2 pr-10 text-xs focus:outline-none focus:ring-1 focus:ring-black"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleAddReply(post.id)}
                                  disabled={isSubmittingReply === post.id}
                                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-black text-white rounded-xs hover:bg-gray-800 disabled:bg-gray-400 transition-colors cursor-pointer"
                                >
                                  <Send className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
