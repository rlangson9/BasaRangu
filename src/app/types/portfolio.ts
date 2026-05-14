export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  images: {
    before?: string;
    after?: string;
    additional?: string[];
  };
  linkedReviewId?: string;
  linkedReview?: {
    rating: number;
    reviewerName: string;
    reviewText: string;
    reviewDate: string;
  };
  tags: string[];
}

export interface ProviderPortfolio {
  items: PortfolioItem[];
  totalProjects: number;
  averageRating: number;
}

export const mockPortfolioItems: PortfolioItem[] = [
  {
    id: "1",
    title: "Bathroom Renovation",
    description: "Complete bathroom renovation including new fixtures, tiling, and plumbing. Transformed an outdated 1980s bathroom into a modern, functional space.",
    category: "Plumbing",
    date: "2024-03-15",
    images: {
      before: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=outdated%20bathroom%20before%20renovation&image_size=square",
      after: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20renovated%20bathroom&image_size=square",
      additional: [
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=bathroom%20tiling%20work&image_size=square",
        "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=new%20bathroom%20fixtures&image_size=square"
      ]
    },
    linkedReviewId: "1",
    linkedReview: {
      rating: 5,
      reviewerName: "Sarah Johnson",
      reviewText: "Amazing work! The bathroom looks completely transformed. Professional and timely service.",
      reviewDate: "2024-03-18"
    },
    tags: ["Renovation", "Fixtures", "Tiling"]
  },
  {
    id: "2",
    title: "Kitchen Sink Installation",
    description: "Installed a new double kitchen sink with professional plumbing and leak testing.",
    category: "Plumbing",
    date: "2024-02-20",
    images: {
      before: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=old%20kitchen%20sink%20before%20installation&image_size=square",
      after: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=new%20double%20kitchen%20sink%20installed&image_size=square"
    },
    linkedReviewId: "2",
    linkedReview: {
      rating: 5,
      reviewerName: "Michael Brown",
      reviewText: "Excellent installation work. No leaks, everything works perfectly!",
      reviewDate: "2024-02-22"
    },
    tags: ["Installation", "Kitchen", "Sink"]
  },
  {
    id: "3",
    title: "Water Heater Replacement",
    description: "Replaced an old water heater with a new high-efficiency model. Included proper venting and safety checks.",
    category: "Plumbing",
    date: "2024-01-10",
    images: {
      before: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=old%20water%20heater&image_size=square",
      after: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=new%20water%20heater%20installation&image_size=square"
    },
    linkedReviewId: "3",
    linkedReview: {
      rating: 4,
      reviewerName: "Emily Davis",
      reviewText: "Quick and professional service. Water heater works great!",
      reviewDate: "2024-01-12"
    },
    tags: ["Water Heater", "Safety", "Efficiency"]
  }
];
