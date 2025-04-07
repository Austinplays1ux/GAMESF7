import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWebSocket, ConnectedUser } from '@/hooks/use-websocket';
import { useAuth } from '@/hooks/use-auth';
import { formatDistanceToNow } from 'date-fns';
import { debounce } from '@/lib/utils';

export default function MultiplayerLobby() {
  const { user } = useAuth();
  const { isConnected, messages, users, sendMessage, sendTypingStatus } = useWebSocket();
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Create a debounced function to send typing status
  const debouncedSendTyping = useRef(
    debounce((isTyping: boolean, preview?: string) => {
      if (sendTypingStatus) {
        sendTypingStatus(isTyping, preview);
      }
    }, 300)
  ).current;
  
  // Handle input changes for typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputMessage(newValue);
    
    // Send typing status with message preview
    if (newValue.trim()) {
      // Only send typing preview if longer than 2 chars
      const preview = newValue.length > 2 ? newValue : undefined;
      debouncedSendTyping(true, preview);
    } else {
      debouncedSendTyping(false);
    }
  };
  
  const handleSendMessage = () => {
    if (inputMessage.trim() && sendMessage(inputMessage)) {
      setInputMessage('');
      // Manually send typing=false status immediately
      if (sendTypingStatus) {
        sendTypingStatus(false);
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  if (!user) {
    return (
      <Card className="p-6 text-center">
        <p>Please log in to use the multiplayer lobby.</p>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden">
      <div className="flex h-[500px]">
        {/* Users list */}
        <div className="w-1/4 bg-zinc-800 p-3 border-r border-zinc-700">
          <h3 className="font-medium text-lg mb-2">Online Users ({users.length})</h3>
          <ScrollArea className="h-[440px]">
            <div className="space-y-1">
              {users.map(u => (
                <div 
                  key={u.userId}
                  className="flex items-center p-2 rounded-md hover:bg-zinc-700"
                >
                  <div className={`w-2 h-2 ${u.isTyping ? 'bg-blue-500 animate-pulse' : 'bg-green-500'} rounded-full mr-2`}></div>
                  <div className="flex flex-col">
                    <span>{u.username}</span>
                    {u.isTyping && (
                      <span className="text-xs text-blue-400">typing...</span>
                    )}
                  </div>
                </div>
              ))}
              {users.length === 0 && (
                <div className="text-zinc-500 text-sm p-2">
                  No users online
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        
        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          <div className="p-3 border-b border-zinc-700">
            <h2 className="font-bold text-xl">
              Game Lobby
              <span className="ml-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </h2>
          </div>
          
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-2">
              {messages.map((msg, index) => (
                <div key={index} className="animate-in fade-in">
                  {msg.type === 'chat' && (
                    <div className={`flex items-start ${msg.userId === user.id ? 'justify-end' : ''}`}>
                      <div 
                        className={`max-w-[70%] rounded-lg px-3 py-2 ${
                          msg.userId === user.id 
                            ? 'bg-blue-600 text-white rounded-br-none' 
                            : 'bg-zinc-700 rounded-bl-none'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-xs">
                            {msg.userId === user.id ? 'You' : msg.username}
                          </span>
                          <span className="text-xs opacity-60">
                            {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
                          </span>
                        </div>
                        <p>{msg.message}</p>
                      </div>
                    </div>
                  )}
                  
                  {msg.type === 'user_joined' && (
                    <div className="text-center text-xs text-zinc-500 py-1">
                      {msg.userId === user.id 
                        ? 'You joined the lobby' 
                        : `${msg.username} joined the lobby`}
                    </div>
                  )}
                  
                  {msg.type === 'user_left' && (
                    <div className="text-center text-xs text-zinc-500 py-1">
                      {msg.userId === user.id 
                        ? 'You left the lobby' 
                        : `${msg.username} left the lobby`}
                    </div>
                  )}
                  
                  {msg.type === 'reset_messages' && (
                    <div className="text-center text-xs bg-blue-900/30 text-blue-300 py-2 px-4 rounded-md mx-auto max-w-[80%] my-2">
                      <i className="fas fa-history mr-1"></i> {msg.message}
                    </div>
                  )}
                </div>
              ))}
              
              {messages.length === 0 && (
                <div className="text-center text-zinc-500 py-10">
                  No messages yet. Start the conversation!
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="p-3 border-t border-zinc-700 flex flex-col gap-2">
            {/* Show typing indicators */}
            <div className="h-6">
              {users.some(u => u.isTyping && u.userId !== user.id) && (
                <div className="text-xs text-zinc-400 animate-pulse">
                  {users.filter(u => u.isTyping && u.userId !== user.id).map(u => (
                    <div key={u.userId} className="flex items-center gap-1">
                      <span className="font-medium">{u.username}</span> is typing
                      {u.typingPreview && (
                        <span className="italic text-zinc-500"> "{u.typingPreview}..."</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                disabled={!isConnected}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!isConnected || !inputMessage.trim()}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}