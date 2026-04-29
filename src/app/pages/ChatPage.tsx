import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ArrowLeft, Send, AlertTriangle, CheckCircle, UserPlus, Calendar, Briefcase, MoreVertical, FileText, DollarSign } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

export function ChatPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [job, setJob] = useState<any>(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchJobAndMessages();
  }, [jobId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchJobAndMessages = async () => {
    try {
      // In a real app, this would fetch from an API
      // For now, use mock data
      const mockConversations = [
        {
          id: "1",
          jobTitle: "Plumbing Repair",
          job: {
            id: "1",
            title: "Plumbing Repair",
            status: "open",
          },
          provider: {
            id: "1",
            name: "John Doe",
            role: "provider",
            avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20plumber%20portrait&image_size=square",
          },
          messages: [
            { id: "1", text: "Hello, I need help with a leaky faucet", sender: "user", userName: "You", time: "10:00 AM", createdAt: "2024-01-15T10:00:00Z" },
            { id: "2", text: "I can fix that for you. When are you available?", sender: "provider", userName: "John Doe", time: "10:15 AM", createdAt: "2024-01-15T10:15:00Z" },
            { id: "3", text: "Tomorrow morning would be great", sender: "user", userName: "You", time: "10:20 AM", createdAt: "2024-01-15T10:20:00Z" },
            { id: "4", text: "I can fix your leaky faucet tomorrow morning", sender: "provider", userName: "John Doe", time: "10:30 AM", createdAt: "2024-01-15T10:30:00Z" },
          ],
        },
        {
          id: "2",
          jobTitle: "House Cleaning",
          job: {
            id: "2",
            title: "House Cleaning",
            status: "in_progress",
          },
          provider: {
            id: "2",
            name: "Jane Smith",
            role: "provider",
            avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20cleaner%20portrait&image_size=square",
          },
          messages: [
            { id: "1", text: "I need a deep cleaning for my 3-bedroom house", sender: "user", userName: "You", time: "2:00 PM", createdAt: "2024-01-14T14:00:00Z" },
            { id: "2", text: "I can do that for you. How about tomorrow?", sender: "provider", userName: "Jane Smith", time: "2:30 PM", createdAt: "2024-01-14T14:30:00Z" },
            { id: "3", text: "That works. What time?", sender: "user", userName: "You", time: "2:45 PM", createdAt: "2024-01-14T14:45:00Z" },
            { id: "4", text: "I'll be at your place by 9 AM", sender: "provider", userName: "Jane Smith", time: "3:00 PM", createdAt: "2024-01-14T15:00:00Z" },
          ],
        },
        {
          id: "3",
          jobTitle: "Grocery Shopping",
          job: {
            id: "3",
            title: "Grocery Shopping",
            status: "completed",
          },
          provider: {
            id: "5",
            name: "David Brown",
            role: "runner",
            avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20errand%20runner%20portrait&image_size=square",
          },
          messages: [
            { id: "1", text: "Can you pick up groceries for me?", sender: "user", userName: "You", time: "10:00 AM", createdAt: "2024-01-13T10:00:00Z" },
            { id: "2", text: "Sure, send me your list", sender: "runner", userName: "David Brown", time: "10:10 AM", createdAt: "2024-01-13T10:10:00Z" },
            { id: "3", text: "Milk, eggs, bread, and vegetables", sender: "user", userName: "You", time: "10:15 AM", createdAt: "2024-01-13T10:15:00Z" },
            { id: "4", text: "I've picked up all your items", sender: "runner", userName: "David Brown", time: "11:30 AM", createdAt: "2024-01-13T11:30:00Z" },
          ],
        },
      ];

      const conversation = mockConversations.find((conv) => conv.id === jobId);
      if (conversation) {
        setJob(conversation.job);
        setMessages(conversation.messages);
      }
    } catch (error) {
      console.error("Error fetching job and messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    // Check for forbidden content
    const forbidden = ["whatsapp", "phone", "email", "@", ".com", "call me", "contact"];
    const hasForbidden = forbidden.some((word) =>
      newMessage.toLowerCase().includes(word)
    );

    if (hasForbidden) {
      toast.error("Please do not share contact information. All communication must be in-app.");
      return;
    }

    setSending(true);
    try {
      // In a real app, this would send to an API
      // For now, just add the message locally
      const newMsg = {
        id: Date.now().toString(),
        text: newMessage,
        sender: "user",
        userName: "You",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt: new Date().toISOString(),
      };

      setMessages([...messages, newMsg]);
      setNewMessage("");
      
      // Simulate a reply after a short delay
      setTimeout(() => {
        const replyMsg = {
          id: (Date.now() + 1).toString(),
          text: "Got it, I'll get back to you shortly!",
          sender: "provider",
          userName: job?.title === "Grocery Shopping" ? "David Brown" : job?.title === "House Cleaning" ? "Jane Smith" : "John Doe",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          createdAt: new Date().toISOString(),
        };
        setMessages(prevMessages => [...prevMessages, replyMsg]);
      }, 1500);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="flex flex-col h-screen bg-zinc-950">
      <div className="sticky top-0 z-40 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-white hover:text-teal-400"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-white">{job?.title || "Chat"}</h1>
              <p className="text-xs text-zinc-400">
                {job?.status === "paid" ? "Job in progress" : job?.status}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-500/10 border-y border-yellow-500/20 px-4 py-3">
        <div className="max-w-screen-xl mx-auto flex items-center gap-2 text-sm text-yellow-400">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>
            Do not share phone numbers, email, or external contact info. Violations may result in
            account suspension.
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-screen-xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-zinc-500 py-12">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.sender === "user";
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                      isOwnMessage
                        ? "bg-teal-500 text-white"
                        : "bg-zinc-800 text-zinc-100"
                    }`}
                  >
                    {!isOwnMessage && (
                      <div className="text-xs font-semibold mb-1 opacity-80">
                        {message.userName}
                      </div>
                    )}
                    <p className="text-sm">{message.text}</p>
                    <div
                      className={`text-xs mt-1 ${
                        isOwnMessage ? "text-white/70" : "text-zinc-500"
                      }`}
                    >
                      {message.time}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-zinc-800 bg-zinc-900">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          {/* Action Buttons */}
          <div className="mb-4 space-y-3">
            {/* Errand Actions */}
            {job?.status === "in_progress" && (
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => {
                    toast.success("Errand Completed!", {
                      description: "The errand has been marked as completed. Payment will be processed automatically.",
                      duration: 4000,
                    });
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Completed
                </Button>
                <Button
                  onClick={() => {
                    toast.error("Errand Cancelled", {
                      description: "The errand has been cancelled. The runner has been notified.",
                      duration: 4000,
                    });
                  }}
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500/10"
                >
                  Cancel Errand
                </Button>
              </div>
            )}

            {/* Recruitment Actions */}
            {job?.status === "open" && (
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => {
                    toast.success("Interview Invitation Sent!", {
                      description: "An interview invitation has been sent. The candidate will receive a notification.",
                      duration: 4000,
                    });
                  }}
                  className="bg-teal-500 hover:bg-teal-600 text-white flex-1"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Invite to Interview
                </Button>
                <Button
                  onClick={() => {
                    toast.success("Job Offer Sent!", {
                      description: "A job offer has been sent to the candidate. They will respond shortly.",
                      duration: 4000,
                    });
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white flex-1"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Send Job Offer
                </Button>
                <Button
                  onClick={() => {
                    toast.info("Added to Shortlist", {
                      description: "Candidate has been added to your shortlist for future reference.",
                      duration: 3000,
                    });
                  }}
                  variant="outline"
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Shortlist
                </Button>
              </div>
            )}

            {/* Completed Job Actions */}
            {job?.status === "completed" && (
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => {
                    toast.success("Payment Released!", {
                      description: "Payment has been released to the service provider. Thank you for using BasaRangu!",
                      duration: 4000,
                    });
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white flex-1"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Release Payment
                </Button>
                <Button
                  onClick={() => navigate(`/job/${jobId}/review`)}
                  variant="outline"
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  Leave Review
                </Button>
              </div>
            )}

            {/* More Options Menu */}
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                    <MoreVertical className="w-4 h-4 mr-2" />
                    More Options
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
                  <DropdownMenuItem 
                    className="text-zinc-200 hover:bg-zinc-700 cursor-pointer"
                    onClick={() => {
                      toast.info("Report Submitted", {
                        description: "Your report has been submitted. Our team will review it shortly.",
                        duration: 4000,
                      });
                    }}
                  >
                    <AlertTriangle className="w-4 h-4 mr-2 text-red-400" />
                    Report User
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-zinc-200 hover:bg-zinc-700 cursor-pointer"
                    onClick={() => navigate(`/job/${jobId}`)}
                  >
                    <FileText className="w-4 h-4 mr-2 text-teal-400" />
                    View Job Details
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-zinc-200 hover:bg-zinc-700 cursor-pointer"
                    onClick={() => {
                      toast.info("Chat Archived", {
                        description: "This conversation has been archived.",
                        duration: 3000,
                      });
                    }}
                  >
                    Archive Chat
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Message Input */}
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !sending && sendMessage()}
              className="flex-1 bg-zinc-800 border-zinc-700 text-white"
            />
            <Button
              onClick={sendMessage}
              disabled={sending || !newMessage.trim()}
              className="bg-teal-500 hover:bg-teal-600 text-white"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
