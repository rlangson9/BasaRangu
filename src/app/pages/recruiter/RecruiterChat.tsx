import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../../components/BottomNav";
import { RoleSwitcher } from "../../components/RoleSwitcher";
import { MessageSquare, Clock, CheckCircle2 } from "lucide-react";

export function RecruiterChat() {
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
          jobTitle: "Software Engineer Position",
          candidate: {
            id: "1",
            name: "John Doe",
            avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20software%20engineer%20portrait&image_size=square",
            skills: ["React", "TypeScript", "Node.js"],
            experience: "5 years"
          },
          lastMessage: "I'm interested in the software engineer position",
          lastMessageTime: "10:30 AM",
          unreadCount: 1,
          messages: [
            { text: "Hello, I'm interested in the software engineer position", sender: "candidate", time: "10:00 AM" },
            { text: "Great! Can you tell me about your experience with React?", sender: "recruiter", time: "10:15 AM" },
            { text: "I've been working with React for 3 years, building web applications", sender: "candidate", time: "10:30 AM" },
          ],
        },
        {
          id: "2",
          jobTitle: "Marketing Manager",
          candidate: {
            id: "2",
            name: "Jane Smith",
            avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20marketing%20manager%20portrait&image_size=square",
            skills: ["Digital Marketing", "SEO", "Social Media"],
            experience: "7 years"
          },
          lastMessage: "I've attached my resume for your review",
          lastMessageTime: "Yesterday",
          unreadCount: 0,
          messages: [
            { text: "Hello, I'm applying for the Marketing Manager position", sender: "candidate", time: "Yesterday, 2:00 PM" },
            { text: "Great! Please send your resume and portfolio", sender: "recruiter", time: "Yesterday, 2:30 PM" },
            { text: "I've attached my resume for your review", sender: "candidate", time: "Yesterday, 3:00 PM" },
          ],
        },
        {
          id: "3",
          jobTitle: "Graphic Designer",
          candidate: {
            id: "3",
            name: "David Brown",
            avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20graphic%20designer%20portrait&image_size=square",
            skills: ["Photoshop", "Illustrator", "UI/UX Design"],
            experience: "4 years"
          },
          lastMessage: "Looking forward to hearing from you",
          lastMessageTime: "2 days ago",
          unreadCount: 0,
          messages: [
            { text: "Hello, I'm interested in the Graphic Designer position", sender: "candidate", time: "2 days ago, 10:00 AM" },
            { text: "Can you share some samples of your work?", sender: "recruiter", time: "2 days ago, 10:15 AM" },
            { text: "Here's my portfolio link: portfolio.example.com", sender: "candidate", time: "2 days ago, 10:30 AM" },
            { text: "Looking forward to hearing from you", sender: "candidate", time: "2 days ago, 10:35 AM" },
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
            <p className="text-zinc-500 text-sm mt-2">Start chatting with candidates</p>
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
                      src={conversation.candidate.avatar} 
                      alt={conversation.candidate.name} 
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
                      <h3 className="font-semibold text-white">{conversation.candidate.name}</h3>
                      <span className="text-xs text-zinc-500">{conversation.lastMessageTime}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-zinc-400 truncate max-w-[70%]">
                        {conversation.lastMessage}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-600 bg-zinc-800 px-2 py-1 rounded-full">
                        {conversation.jobTitle}
                      </span>
                      <span className="text-xs text-zinc-600 bg-zinc-800 px-2 py-1 rounded-full">
                        {conversation.candidate.experience} experience
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav role="recruiter" unreadCount={conversations.reduce((total, conv) => total + conv.unreadCount, 0)} />
    </div>
  );
}
