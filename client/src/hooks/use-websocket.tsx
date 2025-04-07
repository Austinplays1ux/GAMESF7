import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './use-auth';

// Define message types that match the server
type ChatMessage = {
  type: 'chat';
  userId: number;
  username: string;
  message: string;
  timestamp: number;
};

type UserJoinedMessage = {
  type: 'user_joined';
  userId: number;
  username: string;
  timestamp: number;
};

type UserLeftMessage = {
  type: 'user_left';
  userId: number;
  username: string;
  timestamp: number;
};

type LobbyInfoMessage = {
  type: 'lobby_info';
  users: Array<{
    userId: number;
    username: string;
  }>;
  timestamp: number;
};

export type TypingMessage = {
  type: 'typing';
  userId: number;
  username: string;
  isTyping: boolean;
  preview?: string;
  timestamp: number;
};

type ResetMessagesMessage = {
  type: 'reset_messages';
  timestamp: number;
  message: string;
};

type WebSocketMessage = ChatMessage | UserJoinedMessage | UserLeftMessage | LobbyInfoMessage | TypingMessage | ResetMessagesMessage;

export type ConnectedUser = {
  userId: number;
  username: string;
  isTyping?: boolean;
  typingPreview?: string;
};

export function useWebSocket() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [users, setUsers] = useState<ConnectedUser[]>([]);
  const { user } = useAuth();
  
  // Use a ref to store the latest messages to avoid stale closure issues
  const messagesRef = useRef<WebSocketMessage[]>([]);
  
  // Set up the WebSocket connection
  useEffect(() => {
    // Don't try to connect if there's no user logged in
    if (!user) {
      return;
    }
    
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    console.log(`Connecting to WebSocket at ${wsUrl}`);
    const newSocket = new WebSocket(wsUrl);
    
    newSocket.onopen = () => {
      console.log('WebSocket connection established');
      setIsConnected(true);
      
      // Authenticate the user
      const authMessage = {
        type: 'auth',
        userId: user.id,
        username: user.username
      };
      
      newSocket.send(JSON.stringify(authMessage));
    };
    
    newSocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;
        console.log('WebSocket message received:', message);
        
        // Handle reset messages specially - clear all chat messages
        if (message.type === 'reset_messages') {
          // Keep only the reset message
          setMessages([message]);
          messagesRef.current = [message];
        } else {
          // For all other messages, append to the list
          setMessages(prev => {
            const updated = [...prev, message];
            messagesRef.current = updated;
            return updated;
          });
        }
        
        // Update users list for lobby info messages
        if (message.type === 'lobby_info') {
          setUsers(message.users);
        }
        // Add user for user_joined messages
        else if (message.type === 'user_joined') {
          setUsers(prev => {
            const exists = prev.some(u => u.userId === message.userId);
            if (!exists) {
              return [...prev, { userId: message.userId, username: message.username }];
            }
            return prev;
          });
        }
        // Remove user for user_left messages
        else if (message.type === 'user_left') {
          setUsers(prev => prev.filter(u => u.userId !== message.userId));
        }
        // Update typing status
        else if (message.type === 'typing') {
          setUsers(prev => {
            return prev.map(u => {
              if (u.userId === message.userId) {
                return { 
                  ...u, 
                  isTyping: message.isTyping, 
                  typingPreview: message.preview 
                };
              }
              return u;
            });
          });
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    newSocket.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
    };
    
    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };
    
    setSocket(newSocket);
    
    // Clean up on unmount
    return () => {
      if (newSocket.readyState === WebSocket.OPEN) {
        newSocket.close();
      }
    };
  }, [user]);
  
  // Function to send a chat message
  const sendMessage = useCallback((message: string) => {
    if (socket && socket.readyState === WebSocket.OPEN && user) {
      const chatMessage = {
        type: 'chat',
        message
      };
      
      socket.send(JSON.stringify(chatMessage));
      
      // When a message is sent, also send a typing status of false
      const typingMessage = {
        type: 'typing',
        isTyping: false
      };
      socket.send(JSON.stringify(typingMessage));
      
      return true;
    }
    return false;
  }, [socket, user]);
  
  // Function to send typing status
  const sendTypingStatus = useCallback((isTyping: boolean, preview?: string) => {
    if (socket && socket.readyState === WebSocket.OPEN && user) {
      const typingMessage = {
        type: 'typing',
        isTyping,
        preview: preview || ''
      };
      
      socket.send(JSON.stringify(typingMessage));
      return true;
    }
    return false;
  }, [socket, user]);
  
  return {
    isConnected,
    messages,
    users,
    sendMessage,
    sendTypingStatus
  };
}