import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { BottomNav } from "../../components/BottomNav";
import { RoleSwitcher } from "../../components/RoleSwitcher";
import { ProviderPortfolio } from "../../components/ProviderPortfolio";
import { PortfolioCard } from "../../components/PortfolioCard";
import { mockPortfolioItems } from "../../types/portfolio";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Briefcase, MapPin, Star, Mail, Calendar, Clock, Award, Phone, MessageSquare, DollarSign, Users, CheckCircle } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";

export function ProviderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProvider();
  }, [id]);

  const fetchProvider = async () => {
    try {
      // In a real app, this would fetch from an API
      // For now, use mock data
      const mockProviders = [
        {
          id: "1",
          name: "John Doe",
          role: "provider",
          category: "Plumbing",
          skills: ["Plumbing", "Pipe Repair", "Leak Fixing", "Water Heater Installation", "Bathroom Renovation"],
          rating: 4.8,
          reviewCount: 124,
          location: "Harare, Zimbabwe",
          distance: 2.5,
          avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20plumber%20portrait&image_size=square",
          available: true,
          hourlyRate: 5,
          email: "john.doe@example.com",
          phone: "+263 771 234 567",
          bio: "Experienced plumber with 10 years of experience in residential and commercial plumbing. Specialized in leak detection, pipe repair, and bathroom renovations. Committed to providing high-quality service at affordable prices.",
          jobHistory: [
            {
              id: "1",
              title: "Kitchen Sink Repair",
              client: "Sarah Johnson",
              date: "2024-03-15",
              rating: 5,
              description: "Fixed a leaky kitchen sink and replaced the faucet",
              amount: 12
            },
            {
              id: "2",
              title: "Bathroom Renovation",
              client: "Michael Brown",
              date: "2024-03-10",
              rating: 4,
              description: "Renovated a small bathroom including new fixtures and piping",
              amount: 80
            },
            {
              id: "3",
              title: "Water Heater Installation",
              client: "Emily Davis",
              date: "2024-03-05",
              rating: 5,
              description: "Installed a new water heater and ensured proper functioning",
              amount: 35
            }
          ],
          experience: [
            {
              company: "Harare Plumbing Services",
              position: "Lead Plumber",
              period: "2018 - Present",
              description: "Managed a team of 5 plumbers, handled complex plumbing projects, and provided emergency services. Increased customer satisfaction by 30% through improved service quality."
            },
            {
              company: "Bulawayo Plumbing Co.",
              position: "Plumber",
              period: "2014 - 2018",
              description: "Installed and repaired plumbing systems in residential and commercial buildings. Specialized in water heater installation and maintenance."
            }
          ],
          certifications: [
            {
              name: "Certified Plumber",
              issuer: "Zimbabwe Institute of Plumbing",
              date: "2014"
            },
            {
              name: "Advanced Leak Detection",
              issuer: "National Plumbing Association",
              date: "2016"
            }
          ],
          reviews: [
            {
              id: "1",
              clientName: "Sarah Johnson",
              clientAvatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20woman%20portrait&image_size=square",
              rating: 5,
              date: "2024-03-15",
              comment: "John fixed my leaky pipe quickly and efficiently. He was professional and cleaned up after himself. I would definitely hire him again."
            },
            {
              id: "2",
              clientName: "Michael Brown",
              clientAvatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20man%20portrait&image_size=square",
              rating: 4,
              date: "2024-03-10",
              comment: "Good service, but arrived a bit late. Fixed the issue properly and at a reasonable price."
            },
            {
              id: "3",
              clientName: "Emily Davis",
              clientAvatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=young%20professional%20woman%20portrait&image_size=square",
              rating: 5,
              date: "2024-03-05",
              comment: "Excellent work! John installed a new water heater for me and it works perfectly. Very knowledgeable and friendly."
            }
          ]
        },
        {
          id: "2",
          name: "Jane Smith",
          role: "provider",
          category: "Cleaning",
          skills: ["Deep Cleaning", "Housekeeping", "Office Cleaning", "Window Cleaning", "Carpet Cleaning"],
          rating: 4.9,
          reviewCount: 98,
          location: "Harare, Zimbabwe",
          distance: 3.2,
          avatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20cleaner%20portrait&image_size=square",
          available: true,
          hourlyRate: 4,
          email: "jane.smith@example.com",
          phone: "+263 772 345 678",
          bio: "Professional cleaner with 8 years of experience in residential and commercial cleaning. Specialized in deep cleaning and eco-friendly cleaning solutions. Dedicated to providing a clean and healthy environment for clients.",
          jobHistory: [
            {
              id: "1",
              title: "Deep House Cleaning",
              client: "David Wilson",
              date: "2024-03-12",
              rating: 5,
              description: "Deep cleaned a 3-bedroom apartment including carpets and windows",
              amount: 20
            },
            {
              id: "2",
              title: "Office Cleaning",
              client: "Lisa Thompson",
              date: "2024-03-08",
              rating: 5,
              description: "Cleaned a small office space including desks, floors, and restrooms",
              amount: 15
            },
            {
              id: "3",
              title: "Move-in Cleaning",
              client: "Robert Johnson",
              date: "2024-03-01",
              rating: 4,
              description: "Cleaned a new apartment before move-in, including kitchen and bathrooms",
              amount: 18
            }
          ],
          experience: [
            {
              company: "Sparkling Clean Services",
              position: "Cleaning Supervisor",
              period: "2020 - Present",
              description: "Supervised a team of 8 cleaners, managed client accounts, and implemented quality control measures. Improved client retention by 25% through consistent service quality."
            },
            {
              company: "Harare Housekeeping",
              position: "Housekeeper",
              period: "2016 - 2020",
              description: "Provided housekeeping services for high-end residential clients. Specialized in deep cleaning and organizing."
            }
          ],
          certifications: [
            {
              name: "Professional Cleaning Certification",
              issuer: "Zimbabwe Cleaning Association",
              date: "2016"
            },
            {
              name: "Eco-Friendly Cleaning Practices",
              issuer: "Green Cleaning Institute",
              date: "2018"
            }
          ],
          reviews: [
            {
              id: "1",
              clientName: "David Wilson",
              clientAvatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20man%20portrait&image_size=square",
              rating: 5,
              date: "2024-03-12",
              comment: "Jane did an amazing job cleaning my apartment. It looks brand new! She was thorough and attention to detail is impressive."
            },
            {
              id: "2",
              clientName: "Lisa Thompson",
              clientAvatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20woman%20portrait&image_size=square",
              rating: 5,
              date: "2024-03-08",
              comment: "Best cleaning service I've ever had. Jane is reliable, professional, and does an excellent job every time."
            },
            {
              id: "3",
              clientName: "Robert Johnson",
              clientAvatar: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=middle%20aged%20man%20portrait&image_size=square",
              rating: 4,
              date: "2024-03-01",
              comment: "Good service, but a bit pricey. However, the quality is worth it."
            }
          ]
        }
      ];
      
      const foundProvider = mockProviders.find(p => p.id === id);
      setTimeout(() => {
        setProvider(foundProvider);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching provider:", error);
    }
  };

  const handleHire = () => {
    // In a real app, this would add the job to the provider's history
    // For now, we'll just navigate to the job creation page
    navigate(`/job/new?provider=${provider.id}`);
  };

  const handleChat = () => {
    navigate(`/chat/provider-${provider.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400">Service provider not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-zinc-400 hover:text-teal-400"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <h1 className="text-xl font-bold text-white">Service Provider Profile</h1>
            <RoleSwitcher />
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Provider Header */}
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-teal-500">
                <img 
                  src={provider.avatar} 
                  alt={provider.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-white">{provider.name}</h2>
                </div>
                <p className="text-lg text-zinc-400 mb-2">{provider.category} Specialist</p>
                <div className="flex items-center gap-1 text-yellow-500 mb-2">
                  <Star className="w-4 h-4 fill-yellow-500" />
                  <span className="text-white">{provider.rating.toFixed(1)}</span>
                  <span className="text-zinc-400 text-sm">({provider.reviews.length} reviews)</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleChat}
                className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat Now
              </Button>
              <Button 
                onClick={handleHire}
                className="bg-teal-500 hover:bg-teal-600 text-white"
              >
                Hire
              </Button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-zinc-800 pt-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-zinc-500" />
              <span className="text-zinc-400">{provider.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-zinc-500" />
              <span className="text-zinc-400">{provider.distance} km away</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-zinc-500" />
              <span className="text-zinc-400">${provider.hourlyRate}/hr</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-zinc-500" />
              <span className="text-zinc-400">{provider.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-zinc-500" />
              <span className="text-zinc-400">{provider.phone}</span>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {provider.skills.map((skill: string, index: number) => (
              <Badge key={index} className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">About</h3>
          <p className="text-zinc-400 leading-relaxed">{provider.bio}</p>
        </div>

        {/* Portfolio Preview */}
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Portfolio</h3>
            <Button
              variant="ghost"
              className="text-teal-400 hover:text-teal-300 hover:bg-zinc-800"
              onClick={() => navigate(`/provider/detail/${id}/portfolio`)}
            >
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockPortfolioItems.slice(0, 3).map((item) => (
              <PortfolioCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Experience</h3>
          <div className="space-y-4">
            {provider.experience.map((exp: any, index: number) => (
              <div key={index} className="border-l-2 border-teal-500 pl-4 py-2">
                <div className="flex justify-between mb-1">
                  <h4 className="font-medium text-white">{exp.position}</h4>
                  <span className="text-sm text-zinc-500">{exp.period}</span>
                </div>
                <p className="text-sm text-zinc-400 mb-2">{exp.company}</p>
                <p className="text-sm text-zinc-500">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Certifications</h3>
          <div className="space-y-3">
            {provider.certifications.map((cert: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-white">{cert.name}</h4>
                  <p className="text-sm text-zinc-500">{cert.issuer}</p>
                </div>
                <span className="text-sm text-zinc-500">{cert.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Client Reviews</h3>
          <div className="space-y-4">
            {provider.reviews.map((review: any, index: number) => (
              <div key={index} className="border-b border-zinc-800 pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src={review.clientAvatar} 
                    alt={review.clientName} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-white">{review.clientName}</h4>
                    <div className="flex items-center gap-1 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-500' : 'text-zinc-600'}`} 
                        />
                      ))}
                      <span className="text-zinc-500 text-sm ml-2">{review.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-zinc-400">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Job History */}
        <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Job History</h3>
          <div className="space-y-4">
            {provider.jobHistory && provider.jobHistory.map((job: any, index: number) => (
              <div key={index} className="border-b border-zinc-800 pb-4 last:border-b-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">{job.title}</h4>
                  <span className="text-sm text-zinc-500">{job.date}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-zinc-400">Client: {job.client}</span>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-3 h-3 fill-yellow-500" />
                    <span className="text-sm text-white">{job.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-zinc-500 mb-2">{job.description}</p>
                <div className="text-sm font-medium text-teal-400">${job.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav role="user" />
    </div>
  );
}
