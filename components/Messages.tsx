
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { FacetigramData, User, DirectMessage } from '../types';

interface MessagesProps {
  data: FacetigramData;
  currentUser: User;
  onSendMessage: (receiverId: number, content: string) => void;
  onUserClick: (userId: number) => void;
}

const Messages: React.FC<MessagesProps> = ({ data, currentUser, onSendMessage, onUserClick }) => {
  const [selectedChatUser, setSelectedChatUser] = useState<User | null>(null);
  const [msgInput, setMsgInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatPartners = useMemo(() => {
    // Unique users current user has chatted with
    const partnerIds = new Set<number>();
    data.direct_messages.forEach(dm => {
      if (dm.sender_id === currentUser.user_id) partnerIds.add(dm.receiver_id);
      if (dm.receiver_id === currentUser.user_id) partnerIds.add(dm.sender_id);
    });
    return data.users.filter(u => partnerIds.has(u.user_id));
  }, [data.direct_messages, data.users, currentUser.user_id]);

  const activeMessages = useMemo(() => {
    if (!selectedChatUser) return [];
    return data.direct_messages
      .filter(dm => 
        (dm.sender_id === currentUser.user_id && dm.receiver_id === selectedChatUser.user_id) ||
        (dm.sender_id === selectedChatUser.user_id && dm.receiver_id === currentUser.user_id)
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [data.direct_messages, selectedChatUser, currentUser.user_id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChatUser || !msgInput.trim()) return;
    onSendMessage(selectedChatUser.user_id, msgInput);
    setMsgInput('');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden h-[calc(100vh-160px)] flex shadow-sm">
      {/* Sidebar - Contacts */}
      <div className={`w-full md:w-80 border-r border-gray-200 flex flex-col ${selectedChatUser ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <span className="font-bold text-lg">{currentUser.username}</span>
          <button className="text-gray-500 hover:text-black">
            <EditIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {chatPartners.map(partner => (
            <button
              key={partner.user_id}
              onClick={() => setSelectedChatUser(partner)}
              className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-50 transition-colors ${selectedChatUser?.user_id === partner.user_id ? 'bg-gray-50' : ''}`}
            >
              <img src={partner.profile_pic} className="w-12 h-12 rounded-full object-cover border border-gray-100" />
              <div className="flex-1 text-left overflow-hidden">
                <p className="font-medium text-sm truncate">{partner.username}</p>
                <p className="text-xs text-gray-400 truncate">
                  {data.direct_messages.filter(dm => dm.sender_id === partner.user_id || dm.receiver_id === partner.user_id).slice(-1)[0]?.content}
                </p>
              </div>
            </button>
          ))}
          {chatPartners.length === 0 && (
            <div className="p-8 text-center text-gray-400 text-sm">
              Belum ada pesan. Cari teman untuk memulai chat!
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!selectedChatUser ? 'hidden md:flex items-center justify-center bg-gray-50' : 'flex'}`}>
        {selectedChatUser ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
              <div className="flex items-center space-x-3">
                <button onClick={() => setSelectedChatUser(null)} className="md:hidden text-gray-500 mr-1">
                  <BackIcon className="w-6 h-6" />
                </button>
                <button onClick={() => onUserClick(selectedChatUser.user_id)} className="flex items-center space-x-3">
                  <img src={selectedChatUser.profile_pic} className="w-8 h-8 rounded-full object-cover" />
                  <span className="font-semibold text-sm">{selectedChatUser.username}</span>
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-gray-500 hover:text-black"><PhoneIcon className="w-5 h-5" /></button>
                <button className="text-gray-500 hover:text-black"><VideoIcon className="w-5 h-5" /></button>
                <button className="text-gray-500 hover:text-black"><InfoIcon className="w-5 h-5" /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar bg-white">
              <div className="flex flex-col items-center py-6">
                <img src={selectedChatUser.profile_pic} className="w-20 h-20 rounded-full object-cover mb-2" />
                <h4 className="font-bold text-lg">{selectedChatUser.username}</h4>
                <p className="text-xs text-gray-400 mb-4">{selectedChatUser.bio.substring(0, 30)}...</p>
                <button 
                  onClick={() => onUserClick(selectedChatUser.user_id)}
                  className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-semibold transition-colors"
                >
                  Lihat Profil
                </button>
              </div>

              {activeMessages.map(dm => {
                const isMine = dm.sender_id === currentUser.user_id;
                return (
                  <div key={dm.dm_id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                      isMine ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}>
                      {dm.content}
                      <p className={`text-[10px] mt-1 opacity-60 ${isMine ? 'text-right' : 'text-left'}`}>
                        {new Date(dm.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <form onSubmit={handleSend} className="flex items-center space-x-3 border border-gray-200 rounded-full px-4 py-2 focus-within:ring-1 focus-within:ring-gray-300">
                <button type="button" className="text-gray-500 hover:text-black"><SmileIcon className="w-6 h-6" /></button>
                <input
                  value={msgInput}
                  onChange={(e) => setMsgInput(e.target.value)}
                  placeholder="Kirim pesan..."
                  className="flex-1 bg-transparent border-none outline-none text-sm focus:ring-0"
                />
                {msgInput.trim() ? (
                  <button type="submit" className="text-blue-500 font-semibold text-sm">Kirim</button>
                ) : (
                  <div className="flex items-center space-x-3">
                    <button type="button" className="text-gray-500 hover:text-black"><ImageIcon className="w-6 h-6" /></button>
                    <button type="button" className="text-gray-500 hover:text-black"><HeartIcon className="w-6 h-6" /></button>
                  </div>
                )}
              </form>
            </div>
          </>
        ) : (
          <div className="text-center p-8 space-y-4">
            <div className="w-24 h-24 border-2 border-black rounded-full flex items-center justify-center mx-auto">
              <SendIcon className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-light">Pesan Anda</h3>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">
              Kirim foto dan pesan pribadi ke teman atau grup.
            </p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors">
              Kirim Pesan
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Icons
const EditIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
);
const BackIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
);
const PhoneIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
);
const VideoIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
);
const InfoIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const SmileIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const ImageIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);
const HeartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
);
const SendIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
);

export default Messages;
