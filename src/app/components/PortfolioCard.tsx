import { useState } from "react";
import { PortfolioItem } from "../types/portfolio";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Star, Calendar, Image as ImageIcon, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";

interface PortfolioCardProps {
  item: PortfolioItem;
  onClick?: () => void;
}

export function PortfolioCard({ item, onClick }: PortfolioCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBefore, setShowBefore] = useState(true);

  const images = [
    ...(item.images.before ? [item.images.before] : []),
    ...(item.images.after ? [item.images.after] : []),
    ...(item.images.additional || [])
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      {/* Image Gallery */}
      <div className="relative h-48 bg-zinc-100 overflow-hidden">
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImageIndex]}
              alt={`Portfolio item ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-2 right-2 flex gap-1">
                  {images.map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${i === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-400">
            <ImageIcon className="w-12 h-12" />
          </div>
        )}

        {/* Before/After Toggle */}
        {item.images.before && item.images.after && (
          <div className="absolute top-2 left-2 flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowBefore(true);
                setCurrentImageIndex(0);
              }}
              className={`px-2 py-1 text-xs font-medium rounded ${showBefore ? 'bg-teal-500 text-white' : 'bg-zinc-700/70 text-white'}`}
            >
              Before
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowBefore(false);
                setCurrentImageIndex(item.images.before ? 1 : 0);
              }}
              className={`px-2 py-1 text-xs font-medium rounded ${!showBefore ? 'bg-teal-500 text-white' : 'bg-zinc-700/70 text-white'}`}
            >
              After
            </button>
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-1">{item.title}</CardTitle>
        <div className="flex items-center gap-2 text-sm text-zinc-600">
          <Calendar className="w-4 h-4" />
          <span>{item.date}</span>
        </div>
      </CardHeader>

      <CardContent className="pb-2">
        <p className="text-sm text-zinc-700 line-clamp-2">{item.description}</p>
        <div className="flex flex-wrap gap-1 mt-3">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      {item.linkedReview && (
        <CardFooter className="pt-2 border-t bg-zinc-50">
          <div className="flex items-start gap-3 w-full">
            <MessageSquare className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-sm">{item.linkedReview.reviewerName}</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < item.linkedReview.rating ? 'text-yellow-500 fill-yellow-500' : 'text-zinc-300'}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-zinc-600 line-clamp-2">{item.linkedReview.reviewText}</p>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
