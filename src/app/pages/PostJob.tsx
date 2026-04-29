import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { PhotoUpload } from "../components/PhotoUpload";
import { api, getAuthToken } from "../services/api";

export function PostJob() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "service",
    budget: "",
    location: "",
  });
  const [providerId, setProviderId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const categories = {
    service: ["Cleaning", "Plumbing", "Electrical", "Carpentry", "Moving", "Repair", "Painting", "Gardening"],
    errand: ["Delivery", "Shopping", "Pickup", "Drop-off", "Document", "Other"],
    recruitment: ["Technology", "Finance", "Healthcare", "Retail", "Manufacturing", "Other"],
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const provider = searchParams.get("provider");
    if (provider) {
      setProviderId(provider);
    }

    const editId = searchParams.get("edit");
    if (editId) {
      setIsEditMode(true);
      fetchJobForEdit(editId);
    }
  }, [location.search]);

  const fetchJobForEdit = async (jobId: string) => {
    try {
      const response = await api.jobs.get(jobId);
      if (response.job) {
        const job = response.job;
        setFormData({
          title: job.title || "",
          description: job.description || "",
          category: job.category || "",
          type: job.type || "service",
          budget: job.budget || "",
          location: job.location || "",
        });
      }
    } catch (error) {
      console.error("Error fetching job for edit:", error);
      toast.error("Failed to load job for editing");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category || !formData.budget) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const token = getAuthToken();
      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      const jobData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        type: formData.type,
        budget: parseFloat(formData.budget),
        location: formData.location,
        photos,
        providerId,
      };

      const response = await api.jobs.create(token, jobData);

      if (response.success) {
        toast.success(isEditMode ? "Job updated successfully!" : "Job posted successfully!");
        navigate(-1);
      }
    } catch (error: any) {
      console.error(isEditMode ? "Error updating job:" : "Error posting job:", error);
      toast.error(error.message || (isEditMode ? "Failed to update job" : "Failed to post job"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
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
          <h1 className="text-2xl font-bold text-white mb-6">{isEditMode ? "Edit Job" : "Post a Job"}</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Job Type *
              </label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value, category: "" })}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="service">Home Service</SelectItem>
                  <SelectItem value="errand">Errand/Task</SelectItem>
                  <SelectItem value="recruitment">Job Recruitment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Title *
              </label>
              <Input
                type="text"
                placeholder="e.g., Need a plumber for kitchen sink repair"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Category *
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  {categories[formData.type as keyof typeof categories]?.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Description *
              </label>
              <Textarea
                placeholder="Describe the work needed in detail..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white min-h-32"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Budget ($) *
              </label>
              <Input
                type="number"
                placeholder="Enter your budget"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Platform fee: 15% will be deducted from completed jobs
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Location (Approximate)
              </label>
              <Input
                type="text"
                placeholder="e.g., Downtown, San Francisco"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Exact location will be revealed only after payment
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Upload Photos
              </label>
              <PhotoUpload photos={photos} onPhotosChange={setPhotos} maxPhotos={5} />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white h-12"
            >
              {submitting ? (isEditMode ? "Updating..." : "Posting...") : isEditMode ? "Update Job" : "Post Job"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
