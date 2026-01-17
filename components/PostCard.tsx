
import React, { useState } from 'react';
import { Post, User, Comment } from '../types';
import { geminiService } from '../geminiService';

interface PostCardProps {
  post: Post;
  users: User[];
  comments: Comment[];
  currentUser: User;
  onLike: () => void;
  onComment: (content: string) => void;
  onUserClick: (id: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, users, comments, currentUser, onLike, onComment, onUserClick }) => {
  const [commentText, setCommentText] = useState('');
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const author = users.find(u => u.user_id === post.user_id);
  const postComments = comments.filter(c => c.post_id === post.post_id);
  const isLiked = post.likes.includes(currentUser.user_id);

  const handleSuggestReply = async () => {
    setIsGeneratingReply(true);
    const suggestion = await geminiService.suggestReply(post.content);
    setCommentText(suggestion);
    setIsGeneratingReply(false);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onComment(commentText);
    setCommentText('');
  };

  if (!author) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <button onClick={() => onUserClick(author.user_id)} className="flex items-center space-x-3">
          <img src={author.profile_pic} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
          <div className="flex flex-col items-start">
            <span className="font-semibold text-sm hover:underline">{author.username}</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wide">
              {new Date(post.timestamp).toLocaleDateString()}
            </span>
          </div>
        </button>
        <button className="text-gray-400 hover:text-black">
          <DotsIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Media */}
      {post.media_url && (
        <div className="relative aspect-square md:aspect-video bg-gray-100">
          <img src={post.media_url} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Actions */}
      <div className="p-4 space-y-3">
        <div className="flex items-center space-x-4">
          <button onClick={onLike} className={`${isLiked ? 'text-red-500' : 'text-gray-700'} hover:scale-110 transition-transform`}>
            {isLiked ? <HeartFilledIcon className="w-6 h-6" /> : <HeartIcon className="w-6 h-6" />}
          </button>
          <button className="text-gray-700 hover:scale-110 transition-transform">
            <CommentIcon className="w-6 h-6" />
          </button>
          <button className="text-gray-700 hover:scale-110 transition-transform">
            <SendIcon className="w-6 h-6" />
          </button>
          <div className="flex-1" />
          <button className="text-gray-700">
            <BookmarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="font-semibold text-sm">{post.likes.length} menyukai</div>

        <div>
          <span className="font-semibold text-sm mr-2">{author.username}</span>
          <span className="text-sm text-gray-800">{post.content}</span>
          <div className="mt-1 flex flex-wrap gap-1">
            {post.hashtags.map(tag => (
              <span key={tag} className="text-sm text-blue-600 font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {postComments.length > 0 && (
          <div className="pt-2 space-y-2">
            {postComments.map(c => {
              const cAuthor = users.find(u => u.user_id === c.user_id);
              return (
                <div key={c.comment_id} className="text-sm">
                  <span className="font-semibold mr-2">{cAuthor?.username}</span>
                  <span className="text-gray-600">{c.content}</span>
                </div>
              );
            })}
          </div>
        )}

        <form onSubmit={handleSubmitComment} className="pt-4 border-t border-gray-100 flex items-center space-x-3">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Tambah komentar..."
            className="flex-1 text-sm border-none outline-none focus:ring-0"
          />
          <button 
            type="button" 
            onClick={handleSuggestReply}
            disabled={isGeneratingReply}
            className="text-xs text-purple-600 font-medium p-1 hover:bg-purple-50 rounded"
            title="Saran AI"
          >
            {isGeneratingReply ? '...' : '✨'}
          </button>
          <button 
            type="submit"
            disabled={!commentText.trim()}
            className="text-sm font-semibold text-blue-500 disabled:opacity-30"
          >
            Kirim
          </button>
        </form>
      </div>
    </div>
  );
};

// Icons
const DotsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
);
const HeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
);
const HeartFilledIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
);
const CommentIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
);
const SendIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
);
const BookmarkIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
);

export default PostCard;
