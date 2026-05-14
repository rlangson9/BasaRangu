import { useState } from "react";
import { PortfolioItem, mockPortfolioItems } from "../types/portfolio";
import { PortfolioCard } from "./PortfolioCard";
import { PortfolioUploadDialog } from "./PortfolioUploadDialog";
import { Button } from "./ui/button";
import { Plus, Briefcase, Star, Award } from "lucide-react";

interface ProviderPortfolioProps {
  items?: PortfolioItem[];
  isOwner?: boolean;
}

export function ProviderPortfolio({ items = mockPortfolioItems, isOwner = false }: ProviderPortfolioProps) {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [portfolioItems, setPortfolioItems] = useState(items);

  const stats = {
    totalProjects: portfolioItems.length,
    averageRating: portfolioItems.reduce((acc, item) => {
      if (item.linkedReview) {
        return acc + item.linkedReview.rating;
      }
      return acc;
    }, 0) / Math.max(1, portfolioItems.filter(i => i.linkedReview).length),
    verifiedProjects: portfolioItems.filter(i => i.linkedReview).length
  };

  const handleAddItem = (newItem: any) => {
    const item: PortfolioItem = {
      id: Date.now().toString(),
      title: newItem.title,
      description: newItem.description,
      category: newItem.category,
      date: newItem.date,
      images: {
        before: newItem.beforeImage ? URL.createObjectURL(newItem.beforeImage) : undefined,
        after: newItem.afterImage ? URL.createObjectURL(newItem.afterImage) : undefined,
        additional: newItem.additionalImages.map((file: File) => URL.createObjectURL(file))
      },
      tags: newItem.tags || []
    };
    setPortfolioItems([item, ...portfolioItems]);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header Stats */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900">Portfolio</h2>
            <p className="text-zinc-600">Past work and verified projects</p>
          </div>
          {isOwner && (
            <Button onClick={() => setUploadDialogOpen(true)} className="bg-teal-500 hover:bg-teal-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-zinc-200 text-center">
            <Briefcase className="w-8 h-8 text-teal-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-zinc-900">{stats.totalProjects}</div>
            <div className="text-sm text-zinc-600">Projects Completed</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-zinc-200 text-center">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-zinc-900">
              {stats.averageRating.toFixed(1)}
            </div>
            <div className="text-sm text-zinc-600">Average Rating</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-zinc-200 text-center">
            <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-zinc-900">{stats.verifiedProjects}</div>
            <div className="text-sm text-zinc-600">Verified Projects</div>
          </div>
        </div>

        {/* Portfolio Grid */}
        {portfolioItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-zinc-200">
            <Briefcase className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 mb-2">No portfolio items yet</h3>
            <p className="text-zinc-500 mb-4">
              {isOwner ? "Start by adding your first project" : "This provider hasn't added any portfolio items yet"}
            </p>
            {isOwner && (
              <Button onClick={() => setUploadDialogOpen(true)} className="bg-teal-500 hover:bg-teal-600">
                <Plus className="w-4 h-4 mr-2" />
                Add First Project
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioItems.map((item) => (
              <PortfolioCard key={item.id} item={item} />
            ))}
          </div>
        )}

        <PortfolioUploadDialog
          isOpen={uploadDialogOpen}
          onClose={() => setUploadDialogOpen(false)}
          onSubmit={handleAddItem}
        />
      </div>
    </div>
  );
}
