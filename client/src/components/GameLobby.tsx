import { useState, useEffect, useRef } from "react";
import { useParams } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Game, GameWithDetails } from "../../../index";
import { Loader2, Send, Users, Clock, MessageSquare } from "lucide-react";

// WebSocket message types
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

type TypingMessage = {
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

type LobbyUser = {
  userId: number;
  username: string;
};

interface GameLobbyProps {
  game: GameWithDetails;
  onStartGame: () => void;
}

export default function GameLobby({ game, onStartGame }: GameLobbyProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [lobbyUsers, setLobbyUsers] = useState<LobbyUser[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [typingUsers, setTypingUsers] = useState<Record<number, { username: string, preview?: string }>>({});
  const socketRef = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const createWebSocketConnection = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to join the game lobby.",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);

    // Create WebSocket connection
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log("WebSocket connection established");
      setIsConnecting(false);
      setIsConnected(true);

      // Send authentication message
      socket.send(JSON.stringify({
        type: 'auth',
        userId: user.id,
        username: user.username,
        gameId: game.id
      }));

      toast({
        title: "Connected to lobby",
        description: `You've joined the ${game.title} lobby.`,
      });
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;
        
        switch (message.type) {
          case 'chat':
            setChatMessages(prev => [...prev, message]);
            break;
          
          case 'user_joined':
            toast({
              title: "User joined",
              description: `${message.username} has joined the lobby.`,
            });
            break;
          
          case 'user_left':
            toast({
              title: "User left",
              description: `${message.username} has left the lobby.`,
            });
            break;
          
          case 'lobby_info':
            setLobbyUsers(message.users);
            break;
          
          case 'typing':
            handleTypingUpdate(message);
            break;
          
          case 'reset_messages':
            setChatMessages([]);
            toast({
              title: "Chat reset",
              description: message.message,
            });
            break;
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
      setIsConnected(false);
      setIsConnecting(false);
      
      toast({
        title: "Disconnected",
        description: "You've been disconnected from the lobby.",
        variant: "destructive"
      });
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnected(false);
      setIsConnecting(false);
      
      toast({
        title: "Connection error",
        description: "Failed to connect to the game lobby.",
        variant: "destructive"
      });
    };

    socketRef.current = socket;
  };

  const closeWebSocketConnection = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  };

  const sendMessage = () => {
    if (!socketRef.current || !isConnected || !messageInput.trim()) return;

    socketRef.current.send(JSON.stringify({
      type: 'chat',
      message: messageInput.trim()
    }));

    setMessageInput("");
    
    // Clear typing status
    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    socketRef.current.send(JSON.stringify({
      type: 'typing',
      isTyping: false
    }));
  };

  const handleTypingUpdate = (message: TypingMessage) => {
    setTypingUsers(prev => {
      const newTypingUsers = { ...prev };
      
      if (message.isTyping) {
        newTypingUsers[message.userId] = { 
          username: message.username,
          preview: message.preview
        };
      } else {
        delete newTypingUsers[message.userId];
      }
      
      return newTypingUsers;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessageInput(value);

    if (!socketRef.current || !isConnected) return;

    // Send typing status
    socketRef.current.send(JSON.stringify({
      type: 'typing',
      isTyping: value.length > 0,
      preview: value.substring(0, 20) + (value.length > 20 ? '...' : '')
    }));

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to clear typing status
    if (value.length > 0) {
      typingTimeoutRef.current = window.setTimeout(() => {
        if (socketRef.current && isConnected) {
          socketRef.current.send(JSON.stringify({
            type: 'typing',
            isTyping: false
          }));
        }
      }, 2000);
    }
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Connect to WebSocket when component mounts
  useEffect(() => {
    createWebSocketConnection();
    
    return () => {
      closeWebSocketConnection();
    };
  }, [user?.id, game.id]);

  // Format timestamp
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Card className="flex-1 flex flex-col max-h-[600px] md:max-h-[800px]">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{game.title} Lobby</CardTitle>
              <CardDescription>
                {isConnected ? (
                  <span className="text-green-500 flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500 inline-block"></span> Connected
                  </span>
                ) : (
                  <span className="text-red-500 flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-red-500 inline-block"></span> Disconnected
                  </span>
                )}
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" /> {lobbyUsers.length}
              </Badge>
              
              <Button 
                onClick={onStartGame} 
                disabled={!isConnected}
              >
                Start Game
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <Tabs defaultValue="chat" className="flex-1 flex flex-col">
          <div className="px-4">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="chat" className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" /> Chat
              </TabsTrigger>
              <TabsTrigger value="players" className="flex items-center gap-1">
                <Users className="h-4 w-4" /> Players ({lobbyUsers.length})
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="chat" className="flex-1 flex flex-col px-4 mt-0">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4 py-4">
                {chatMessages.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No messages yet. Be the first to say hello!
                  </div>
                )}
                
                {chatMessages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex items-start gap-2 ${msg.userId === user?.id ? 'justify-end' : ''}`}
                  >
                    {msg.userId !== user?.id && (
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{msg.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={`max-w-[80%] ${msg.userId === user?.id ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg px-3 py-2`}>
                      <div className="flex justify-between items-center gap-2 mb-1">
                        <span className="text-xs font-medium">
                          {msg.userId === user?.id ? 'You' : msg.username}
                        </span>
                        <span className="text-xs opacity-70">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm break-words">{msg.message}</p>
                    </div>
                    
                    {msg.userId === user?.id && (
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {Object.keys(typingUsers).length > 0 && (
              <div className="text-xs text-gray-500 italic h-6 px-1">
                {Object.values(typingUsers).map(user => user.username).join(', ')}
                {' '}
                {Object.keys(typingUsers).length === 1 ? 'is' : 'are'} typing...
              </div>
            )}
            
            <div className="py-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  disabled={!isConnected}
                />
                <Button 
                  size="icon" 
                  onClick={sendMessage}
                  disabled={!isConnected || !messageInput.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="players" className="flex-1 mt-0">
            <ScrollArea className="h-[400px] px-4">
              <div className="space-y-2 py-4">
                {lobbyUsers.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No players in the lobby yet.
                  </div>
                ) : (
                  lobbyUsers.map((lobbyUser) => (
                    <div key={lobbyUser.userId} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted">
                      <Avatar>
                        <AvatarFallback>{lobbyUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {lobbyUser.username}
                          {lobbyUser.userId === user?.id && ' (You)'}
                        </div>
                        <div className="text-xs text-green-500 flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block"></span> Online
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}