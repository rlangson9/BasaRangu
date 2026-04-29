import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Star, Check, Crown, Zap, Shield, Headphones, TrendingUp, Award, BadgeCheck, Download, Eye } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { toast } from "sonner";
import { PaymentModal } from "../../components/PaymentModal";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  tags: string[];
  avatar: string;
}

export function VIPSubscription() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const testimonials: Testimonial[] = [
    {
      id: "1",
      name: "Tendai M.",
      role: "Service Provider",
      content: "VIP helped me get 3x more job requests! The priority listing feature works great.",
      tags: ["More jobs", "Priority listing"],
      avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20headshot%20of%20a%20Zimbabwean%20man%20wearing%20work%20clothes&image_size=square"
    },
    {
      id: "2",
      name: "Chenai K.",
      role: "Errand Runner",
      content: "The VIP badge gives clients confidence. My earnings doubled in the first month!",
      tags: ["Verified badge", "Higher earnings"],
      avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20headshot%20of%20a%20Zimbabwean%20woman%20smiling&image_size=square"
    },
    {
      id: "3",
      name: "Munashe D.",
      role: "Job Seeker",
      content: "The resume templates helped me land my dream job in Harare!",
      tags: ["Resume help", "Got hired"],
      avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20headshot%20of%20a%20young%20Zimbabwean%20professional&image_size=square"
    }
  ];

  const plans = {
    monthly: { price: 9.99, duration: "Monthly", savings: null },
    quarterly: { price: 24.99, duration: "3 Months", savings: "Save 17%" },
    yearly: { price: 79.99, duration: "Yearly", savings: "Save 33%" }
  };

  const benefits = [
    {
      icon: Crown,
      title: "VIP Badge",
      description: "Stand out with a verified VIP badge on your profile"
    },
    {
      icon: TrendingUp,
      title: "Priority Listing",
      description: "Appear at the top of search results and job feeds"
    },
    {
      icon: Eye,
      title: "Profile Views Analytics",
      description: "See who viewed your profile and when"
    },
    {
      icon: Download,
      title: "PDF Resume Download",
      description: "Download unlimited professional resume PDFs"
    },
    {
      icon: Zap,
      title: "Priority Support",
      description: "Get faster response times from our support team"
    },
    {
      icon: Shield,
      title: "Verified Status",
      description: "Get verified faster with priority processing"
    },
    {
      icon: Award,
      title: "Exclusive Templates",
      description: "Access premium resume and proposal templates"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock customer support access"
    }
  ];

  const handleBuyNow = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (amount: number) => {
    toast.success("Welcome to VIP! 🎉", {
      description: "Your VIP subscription is now active. Enjoy all premium benefits!",
      duration: 5000,
    });
    
    // Update user VIP status in localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const updatedUser = {
      ...user,
      isVIP: true,
      vipPlan: selectedPlan,
      vipExpiry: new Date(Date.now() + (selectedPlan === "monthly" ? 30 : selectedPlan === "quarterly" ? 90 : 365) * 24 * 60 * 60 * 1000).toISOString()
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    setTimeout(() => {
      navigate("/user/me");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-teal-900 to-zinc-950 py-5 sm:py-6 px-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-lg sm:text-xl font-bold text-white">Upgrade to VIP</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="px-4 py-5 sm:py-6 max-w-screen-xl mx-auto">
        {/* VIP Banner */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-5 sm:p-6 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-yellow-400/10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
          <div className="absolute bottom-0 left-0 w-20 sm:w-24 h-20 sm:h-24 bg-yellow-400/10 rounded-full -ml-10 sm:-ml-12 -mb-10 sm:-mb-12"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-6 sm:w-8 h-6 sm:h-8 text-yellow-400" />
                <h2 className="text-yellow-400 font-bold text-xl sm:text-2xl">VIP Membership</h2>
              </div>
              <p className="text-white/90 text-sm sm:text-base">Unlock premium features and boost your success</p>
            </div>
          </div>
          
          <div className="mt-3 sm:mt-4 flex items-center gap-2 flex-wrap">
            <div className="bg-yellow-400/20 text-yellow-400 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              8 Exclusive Benefits
            </div>
            <div className="bg-white/20 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
              Priority Support
            </div>
          </div>
        </div>

        {/* Plan Selection */}
        <div className="mb-8">
          <h3 className="text-white font-bold text-lg mb-4">Choose Your Plan</h3>
          <Tabs value={selectedPlan} onValueChange={setSelectedPlan}>
            <TabsList className="grid grid-cols-3 gap-1 w-full">
              <TabsTrigger 
                value="monthly" 
                className={`p-2 rounded-md text-center transition-all ${selectedPlan === "monthly" ? "bg-teal-600 border-2 border-teal-400 text-white" : "bg-zinc-900 border border-zinc-700 text-zinc-400 hover:bg-zinc-800"}`}
              >
                <div className="text-[9px] font-medium">Monthly</div>
                <div className={`font-bold text-sm mt-0.5 ${selectedPlan === "monthly" ? "text-white" : "text-zinc-300"}`}>
                  ${plans.monthly.price}
                </div>
              </TabsTrigger>
              
              <div className="relative">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[8px] px-1 py-0.5 rounded-full font-bold z-10">
                  POPULAR
                </div>
                <TabsTrigger 
                  value="quarterly" 
                  className={`p-2 rounded-md text-center transition-all ${selectedPlan === "quarterly" ? "bg-teal-600 border-2 border-teal-400 text-white" : "bg-zinc-900 border border-zinc-700 text-zinc-400 hover:bg-zinc-800"}`}
                >
                  <div className="text-[9px] font-medium">3 Months</div>
                  <div className={`font-bold text-sm mt-0.5 ${selectedPlan === "quarterly" ? "text-white" : "text-zinc-300"}`}>
                    ${plans.quarterly.price}
                  </div>
                  <div className="text-yellow-400 text-[8px] mt-0.5">{plans.quarterly.savings}</div>
                </TabsTrigger>
              </div>
              
              <div className="relative">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[8px] px-1 py-0.5 rounded-full font-bold z-10">
                  BEST VALUE
                </div>
                <TabsTrigger 
                  value="yearly" 
                  className={`p-2 rounded-md text-center transition-all ${selectedPlan === "yearly" ? "bg-teal-600 border-2 border-teal-400 text-white" : "bg-zinc-900 border border-zinc-700 text-zinc-400 hover:bg-zinc-800"}`}
                >
                  <div className="text-[9px] font-medium">Yearly</div>
                  <div className={`font-bold text-sm mt-0.5 ${selectedPlan === "yearly" ? "text-white" : "text-zinc-300"}`}>
                    ${plans.yearly.price}
                  </div>
                  <div className="text-green-400 text-[8px] mt-0.5">{plans.yearly.savings}</div>
                </TabsTrigger>
              </div>
            </TabsList>
          </Tabs>
        </div>

        {/* Benefits Grid */}
        <div className="mb-8">
          <h3 className="text-white font-bold text-lg mb-4">Premium Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div 
                  key={index}
                  className="bg-zinc-900 rounded-xl p-3 sm:p-4 border border-zinc-800 hover:border-teal-500 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 sm:w-6 h-5 sm:h-6 text-teal-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">{benefit.title}</h4>
                      <p className="text-zinc-400 text-xs sm:text-sm">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-zinc-900 rounded-xl p-4 sm:p-6 border border-zinc-800 mb-8 overflow-x-auto">
          <h3 className="text-white font-bold text-lg mb-4">VIP vs Free</h3>
          <div className="space-y-3 min-w-[320px]">
            <div className="grid grid-cols-3 gap-4 pb-3 border-b border-zinc-700">
              <div className="text-zinc-400 font-medium">Feature</div>
              <div className="text-zinc-400 font-medium text-center">Free</div>
              <div className="text-yellow-400 font-medium text-center">VIP</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 py-2 border-b border-zinc-800">
              <div className="text-zinc-300">Profile Badge</div>
              <div className="text-zinc-500 text-center">—</div>
              <div className="text-yellow-400 text-center"><Check className="w-4 h-4 inline text-yellow-400" /></div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 py-2 border-b border-zinc-800">
              <div className="text-zinc-300">Priority Listing</div>
              <div className="text-zinc-500 text-center">—</div>
              <div className="text-yellow-400 text-center"><Check className="w-4 h-4 inline text-yellow-400" /></div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 py-2 border-b border-zinc-800">
              <div className="text-zinc-300">Resume Downloads</div>
              <div className="text-zinc-500 text-center">1/month</div>
              <div className="text-yellow-400 text-center">Unlimited</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 py-2 border-b border-zinc-800">
              <div className="text-zinc-300">Profile Analytics</div>
              <div className="text-zinc-500 text-center">Basic</div>
              <div className="text-yellow-400 text-center">Advanced</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 py-2 border-b border-zinc-800">
              <div className="text-zinc-300">Support</div>
              <div className="text-zinc-500 text-center">Email</div>
              <div className="text-yellow-400 text-center">24/7 Priority</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 py-2">
              <div className="text-zinc-300">Templates</div>
              <div className="text-zinc-500 text-center">3 basic</div>
              <div className="text-yellow-400 text-center">All premium</div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-8">
          <h3 className="text-white font-bold text-lg mb-4">What VIP Members Say</h3>
          <div className="flex overflow-x-auto gap-3 pb-4 -mx-4 px-4">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="bg-zinc-900 rounded-xl p-4 min-w-[260px] sm:min-w-[280px] border border-zinc-800 flex-shrink-0"
              >
                <div className="flex items-center gap-2 mb-2">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-white font-medium text-sm">{testimonial.name}</div>
                    <div className="text-teal-400 text-xs">{testimonial.role}</div>
                  </div>
                  <BadgeCheck className="w-4 h-4 text-yellow-400 ml-auto" />
                </div>
                <p className="text-zinc-300 text-xs sm:text-sm mb-2">{testimonial.content}</p>
                <div className="flex flex-wrap gap-1.5">
                  {testimonial.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="bg-zinc-800 text-zinc-300 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Terms */}
        <div className="text-zinc-500 text-xs space-y-2 mb-6">
          <p>• Subscription auto-renews unless cancelled at least 24 hours before the end of the current period</p>
          <p>• Payment will be charged to your account at confirmation of purchase</p>
          <p>• By subscribing, you agree to our <span className="text-teal-400 cursor-pointer">Terms of Service</span> and <span className="text-teal-400 cursor-pointer">Privacy Policy</span></p>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-3 sm:p-4">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div>
            <div className="text-zinc-400 text-xs sm:text-sm">Total</div>
            <div className="text-white font-bold text-xl sm:text-2xl">
              ${plans[selectedPlan as keyof typeof plans].price}
              <span className="text-zinc-400 text-xs sm:text-sm font-normal ml-1">
                /{plans[selectedPlan as keyof typeof plans].duration}
              </span>
            </div>
          </div>
          <Button 
            onClick={handleBuyNow}
            className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-full px-6 sm:px-8 h-10 sm:h-12 font-semibold"
          >
            <Crown className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
            <span className="text-sm sm:text-base">Subscribe Now</span>
          </Button>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={plans[selectedPlan as keyof typeof plans].price}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
