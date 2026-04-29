import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./components/ui/button";

interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

export function TermsPage() {
  const navigate = useNavigate();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  const termsItems: AccordionItem[] = [
    {
      id: "terms-1",
      title: "1. Acceptance of Terms",
      content: "By accessing and using this platform, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, you should not use the platform."
    },
    {
      id: "terms-2",
      title: "2. User Accounts",
      content: "You are responsible for maintaining the confidentiality of your account information and password. You agree to notify us immediately of any unauthorized access to or use of your account."
    },
    {
      id: "terms-3",
      title: "3. Service Provider Responsibilities",
      content: "Service providers agree to provide services in a professional and timely manner, adhering to the agreed-upon terms and conditions of each job."
    },
    {
      id: "terms-4",
      title: "4. Service Seeker Responsibilities",
      content: "Service seekers agree to provide accurate information about their job requirements and to pay for services rendered in a timely manner."
    },
    {
      id: "terms-5",
      title: "5. Payment Terms",
      content: "Payments are held in escrow until the job is completed to the satisfaction of the service seeker. Platform fees will be deducted from completed jobs."
    },
    {
      id: "terms-6",
      title: "6. Dispute Resolution",
      content: "Any disputes between users should be resolved through the platform's dispute resolution process. We reserve the right to mediate disputes and make final decisions."
    },
    {
      id: "terms-7",
      title: "7. Termination",
      content: "We reserve the right to terminate or suspend user accounts at our discretion, without prior notice, for violations of these terms or for any other reason."
    },
    {
      id: "terms-8",
      title: "8. Limitation of Liability",
      content: "The platform is provided 'as is' without any warranties. We shall not be liable for any damages arising from the use of the platform or the services provided through it."
    }
  ];

  const privacyItems: AccordionItem[] = [
    {
      id: "privacy-1",
      title: "1. Data Collection",
      content: "We collect personal information that you provide to us, including your name, contact information, and payment details."
    },
    {
      id: "privacy-2",
      title: "2. Data Use",
      content: "We use your personal information to provide and improve our services, process payments, and communicate with you."
    },
    {
      id: "privacy-3",
      title: "3. Data Sharing",
      content: "We do not share your personal information with third parties except as necessary to provide our services or as required by law."
    },
    {
      id: "privacy-4",
      title: "4. Data Security",
      content: "We implement appropriate security measures to protect your personal information from unauthorized access, use, or disclosure."
    },
    {
      id: "privacy-5",
      title: "5. User Rights",
      content: "You have the right to access, correct, or delete your personal information. You may also withdraw your consent to data processing at any time."
    },
    {
      id: "privacy-6",
      title: "6. Cookies",
      content: "We use cookies and similar technologies to enhance your experience on our platform and to collect information about how you use our services."
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
          <h1 className="text-2xl font-bold text-white mb-6">Terms & Privacy</h1>

          {/* Terms of Service */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Terms of Service</h2>
            <div className="space-y-4">
              {termsItems.map((item) => (
                <div key={item.id} className="border border-zinc-800 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full bg-zinc-800 p-4 flex items-center justify-between text-left"
                  >
                    <span className="text-white font-medium">{item.title}</span>
                    {expandedItem === item.id ? (
                      <ChevronUp className="w-5 h-5 text-zinc-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-zinc-400" />
                    )}
                  </button>
                  {expandedItem === item.id && (
                    <div className="p-4 bg-zinc-900 border-t border-zinc-800">
                      <p className="text-zinc-400">{item.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Policy */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Privacy Policy</h2>
            <div className="space-y-4">
              {privacyItems.map((item) => (
                <div key={item.id} className="border border-zinc-800 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full bg-zinc-800 p-4 flex items-center justify-between text-left"
                  >
                    <span className="text-white font-medium">{item.title}</span>
                    {expandedItem === item.id ? (
                      <ChevronUp className="w-5 h-5 text-zinc-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-zinc-400" />
                    )}
                  </button>
                  {expandedItem === item.id && (
                    <div className="p-4 bg-zinc-900 border-t border-zinc-800">
                      <p className="text-zinc-400">{item.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
