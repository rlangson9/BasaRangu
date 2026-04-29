import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../../components/BottomNav";
import { RoleSwitcher } from "../../components/RoleSwitcher";
import { MessageSquare, Clock, CheckCircle2 } from "lucide-react";

export function UserChat() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      // In a real app, this would fetch from an API
      // For now, use mock data
      const mockConversations = [
        {
          id: "1",
          jobTitle: "Plumbing Repair",
          provider: {
            id: "1",
            name: "John Doe",
            role: "provider",
            avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20plumber%20portrait&image_size=square",
          },
          lastMessage: "I can fix your leaky faucet tomorrow morning",
          lastMessageTime: "10:30 AM",
          unreadCount: 2,
          messages: [
            { text: "Hello, I need help with a leaky faucet", sender: "user", time: "10:00 AM" },
            { text: "I can fix that for you. When are you available?", sender: "provider", time: "10:15 AM" },
            { text: "Tomorrow morning would be great", sender: "user", time: "10:20 AM" },
            { text: "I can fix your leaky faucet tomorrow morning", sender: "provider", time: "10:30 AM" },
          ],
        },
        {
          id: "2",
          jobTitle: "House Cleaning",
          provider: {
            id: "2",
            name: "Jane Smith",
            role: "provider",
            avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20cleaner%20portrait&image_size=square",
          },
          lastMessage: "I'll be at your place by 9 AM",
          lastMessageTime: "Yesterday",
          unreadCount: 0,
          messages: [
            { text: "I need a deep cleaning for my 3-bedroom house", sender: "user", time: "Yesterday, 2:00 PM" },
            { text: "I can do that for you. How about tomorrow?", sender: "provider", time: "Yesterday, 2:30 PM" },
            { text: "That works. What time?", sender: "user", time: "Yesterday, 2:45 PM" },
            { text: "I'll be at your place by 9 AM", sender: "provider", time: "Yesterday, 3:00 PM" },
          ],
        },
        {
          id: "3",
          jobTitle: "Grocery Shopping",
          provider: {
            id: "5",
            name: "David Brown",
            role: "runner",
            avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20errand%20runner%20portrait&image_size=square",
          },
          lastMessage: "I've picked up all your items",
          lastMessageTime: "2 days ago",
          unreadCount: 0,
          messages: [
            { text: "Can you pick up groceries for me?", sender: "user", time: "2 days ago, 10:00 AM" },
            { text: "Sure, send me your list", sender: "runner", time: "2 days ago, 10:10 AM" },
            { text: "Milk, eggs, bread, and vegetables", sender: "user", time: "2 days ago, 10:15 AM" },
            { text: "I've picked up all your items", sender: "runner", time: "2 days ago, 11:30 AM" },
          ],
        },
      ];
      
      setTimeout(() => {
        setConversations(mockConversations);
      }, 500);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      <div className="sticky top-0 z-40 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Messages</h1>
            <RoleSwitcher />
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {conversations.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400">No conversations yet</p>
            <p className="text-zinc-500 text-sm mt-2">Start chatting with service providers and errand runners</p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => navigate(`/chat/${conversation.id}`)}
                className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 cursor-pointer hover:border-teal-500 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <img 
                      src={conversation.provider.avatar} 
                      alt={conversation.provider.name} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {conversation.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-white">{conversation.provider.name}</h3>
                      <span className="text-xs text-zinc-500">{conversation.lastMessageTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-zinc-400 truncate max-w-[70%]">
                        {conversation.lastMessage}
                      </p>
                      <span className="text-xs text-zinc-600">
                        {conversation.provider.role === "provider" ? "Service Provider" : "Errand Runner"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav role="user" unreadCount={conversations.reduce((total, conv) => total + conv.unreadCount, 0)} />
    </div>
  );
}
