import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Image as ImageIcon, X, Upload } from "lucide-react";
import { toast } from "sonner";

interface PhotoUploadProps {
  maxPhotos?: number;
  onPhotosChange: (photos: string[]) => void;
  photos: string[];
}

export function PhotoUpload({ maxPhotos = 5, onPhotosChange, photos }: PhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + photos.length > maxPhotos) {
      toast.error(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    // Validate file types
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    const invalidFiles = files.filter(f => !validTypes.includes(f.type));

    if (invalidFiles.length > 0) {
      toast.error("Only JPG, PNG, and WebP images are allowed");
      return;
    }

    // Validate file sizes (max 5MB each)
    const largeFiles = files.filter(f => f.size > 5 * 1024 * 1024);
    if (largeFiles.length > 0) {
      toast.error("Each photo must be less than 5MB");
      return;
    }

    // Convert to base64 for preview (in production, upload to storage)
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onPhotosChange([...photos, base64String]);
      };
      reader.readAsDataURL(file);
    });

    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removePhoto = (index: number) => {
    onPhotosChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {photos.map((photo, index) => (
            <div key={index} className="relative aspect-square">
              <img
                src={photo}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => removePhoto(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {photos.length < maxPhotos && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/webp"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-zinc-700 bg-zinc-800 hover:bg-zinc-750 text-zinc-400 h-24"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="text-sm">
                Upload Photos ({photos.length}/{maxPhotos})
              </div>
              <div className="text-xs text-zinc-500">
                JPG, PNG, WebP • Max 5MB each
              </div>
            </div>
          </Button>
        </div>
      )}

      {/* Info */}
      {photos.length === 0 && (
        <div className="text-xs text-zinc-500 text-center">
          Adding photos helps providers understand your requirements better
        </div>
      )}
    </div>
  );
}
