import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Phone, Mail, MessageSquare, Clock, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export function SupportPage() {
  const navigate = useNavigate();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const toggleAccordion = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // In a real app, this would send the message to a backend API
      console.log("Support message submitted:", formData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Your message has been submitted successfully! We'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting support message:", error);
      alert("Failed to submit message. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const faqItems: FAQItem[] = [
    {
      id: "faq-1",
      question: "How do I create an account?",
      answer: "To create an account, simply click on the 'Sign Up' button on the homepage and follow the instructions. You'll need to provide your phone number and create a password."
    },
    {
      id: "faq-2",
      question: "How do I post a job?",
      answer: "To post a job, log in to your account and click on the 'Post Job' button. Fill out the job details, including title, description, budget, and location."
    },
    {
      id: "faq-3",
      question: "How do I pay for services?",
      answer: "Payments are processed through our secure platform. When you post a job, you'll be prompted to deposit funds into escrow. Once the job is completed to your satisfaction, the funds will be released to the service provider."
    },
    {
      id: "faq-4",
      question: "What if I'm not satisfied with the service?",
      answer: "If you're not satisfied with the service, you can open a dispute through the platform. Our support team will mediate the dispute and help resolve the issue."
    },
    {
      id: "faq-5",
      question: "How do I contact customer support?",
      answer: "You can contact customer support through this page, via email at support@basarangu.com, or by phone at +263 777 123 456."
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white hover:text-teal-400"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
          <h1 className="text-2xl font-bold text-white mb-6">Customer Service</h1>

          {/* Contact Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Contact Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 bg-zinc-800 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                  <div className="text-zinc-400 text-sm">Phone</div>
                  <div className="text-white font-medium">+263 777 123 456</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-zinc-800 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                  <div className="text-zinc-400 text-sm">Email</div>
                  <div className="text-white font-medium">support@basarangu.com</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-zinc-800 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                  <div className="text-zinc-400 text-sm">Hours</div>
                  <div className="text-white font-medium">Mon-Fri: 8am-6pm</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-zinc-800 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                  <div className="text-zinc-400 text-sm">Office</div>
                  <div className="text-white font-medium">Harare, Zimbabwe</div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqItems.map((item) => (
                <div key={item.id} className="border border-zinc-800 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full bg-zinc-800 p-4 flex items-center justify-between text-left"
                  >
                    <span className="text-white font-medium">{item.question}</span>
                    {expandedItem === item.id ? (
                      <ChevronUp className="w-5 h-5 text-zinc-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-zinc-400" />
                    )}
                  </button>
                  {expandedItem === item.id && (
                    <div className="p-4 bg-zinc-900 border-t border-zinc-800">
                      <p className="text-zinc-400">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Name
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Subject
                </label>
                <Input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Message
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white"
              >
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
