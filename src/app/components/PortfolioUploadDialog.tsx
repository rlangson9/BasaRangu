import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { X, Upload, Image, Calendar, Tag, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface PortfolioUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  existingJobs?: Array<{ id: string; title: string }>;
}

export function PortfolioUploadDialog({
  isOpen,
  onClose,
  onSubmit,
  existingJobs,
}: PortfolioUploadDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    tags: "",
    beforeImage: null as File | null,
    afterImage: null as File | null,
    additionalImages: [] as File[],
    linkToJob: false,
    selectedJobId: "",
  });

  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Portfolio item added successfully!");
      onSubmit?.({
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      });
      onClose();
      setFormData({
        title: "",
        description: "",
        category: "",
        date: new Date().toISOString().split("T")[0],
        tags: "",
        beforeImage: null,
        afterImage: null,
        additionalImages: [],
        linkToJob: false,
        selectedJobId: "",
      });
    } catch (error) {
      toast.error("Failed to add portfolio item");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-zinc-200 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-900">Add Portfolio Item</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Bathroom Renovation"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the project..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Plumbing"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Images</Label>

            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-zinc-300 rounded-lg p-4 text-center">
                <Input
                  type="file"
                  accept="image/*"
                  id="beforeImage"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFormData({ ...formData, beforeImage: e.target.files[0] });
                    }
                  }}
                />
                <label htmlFor="beforeImage" className="cursor-pointer block">
                  <Image className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-zinc-700">Before Image</p>
                  {formData.beforeImage && (
                    <p className="text-xs text-zinc-500 mt-1">{formData.beforeImage.name}</p>
                  )}
                </label>
              </div>

              <div className="border-2 border-dashed border-zinc-300 rounded-lg p-4 text-center">
                <Input
                  type="file"
                  accept="image/*"
                  id="afterImage"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFormData({ ...formData, afterImage: e.target.files[0] });
                    }
                  }}
                />
                <label htmlFor="afterImage" className="cursor-pointer block">
                  <Image className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-zinc-700">After Image</p>
                  {formData.afterImage && (
                    <p className="text-xs text-zinc-500 mt-1">{formData.afterImage.name}</p>
                  )}
                </label>
              </div>
            </div>

            <div className="border-2 border-dashed border-zinc-300 rounded-lg p-4 text-center">
              <Input
                type="file"
                accept="image/*"
                id="additionalImages"
                className="hidden"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    setFormData({
                      ...formData,
                      additionalImages: Array.from(e.target.files),
                    });
                  }
                }}
              />
              <label htmlFor="additionalImages" className="cursor-pointer block">
                <Upload className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-zinc-700">Additional Images (Optional)</p>
                {formData.additionalImages.length > 0 && (
                  <p className="text-xs text-zinc-500 mt-1">
                    {formData.additionalImages.length} images selected
                  </p>
                )}
              </label>
            </div>
          </div>

          {existingJobs && existingJobs.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="linkToJob"
                  checked={formData.linkToJob}
                  onChange={(e) => setFormData({ ...formData, linkToJob: e.target.checked })}
                />
                <Label htmlFor="linkToJob" className="flex items-center gap-2 cursor-pointer">
                  <MessageSquare className="w-4 h-4" />
                  Link to a previous job
                </Label>
              </div>
              {formData.linkToJob && (
                <select
                  value={formData.selectedJobId}
                  onChange={(e) => setFormData({ ...formData, selectedJobId: e.target.value })}
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md"
                >
                  <option value="">Select a job...</option>
                  {existingJobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g., Renovation, Fixtures, Tiling (comma separated)"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-zinc-200">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-teal-500 hover:bg-teal-600"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Add to Portfolio"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
