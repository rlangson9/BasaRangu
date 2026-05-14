import { useState } from "react";
import { VerificationTier, VerificationStatus, VERIFICATION_TIERS } from "../types/verification";
import { ShieldCheck, FileText, CheckCircle, Lock } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { toast } from "sonner";

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
}

export function VerificationBadge({ 
  status, 
  size = "md",
  showName = true
}: VerificationBadgeProps) {
  const config = VERIFICATION_TIERS[status.tier];
  
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  if (status.tier === VerificationTier.NONE) {
    return (
      <Badge className={`${sizeClasses[size]} ${config.bgColor} ${config.color} border-0`}>
        <Lock className={`${size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4"} mr-1.5`} />
        {showName && config.name}
      </Badge>
    );
  }

  return (
    <Badge className={`${sizeClasses[size]} ${config.bgColor} ${config.color} border-0 font-medium`}>
      <ShieldCheck className={`${size === "sm" ? "w-3 h-3" : size === "lg" ? "w-5 h-5" : "w-4 h-4"} mr-1.5`} />
      {showName && `${config.name} Verified`}
    </Badge>
  );
}

interface VerificationStatusCardProps {
  status: VerificationStatus;
  onVerify?: () => void;
}

export function VerificationStatusCard({ status, onVerify }: VerificationStatusCardProps) {
  const config = VERIFICATION_TIERS[status.tier];
  const nextTier = getNextTier(status.tier);
  const nextConfig = nextTier ? VERIFICATION_TIERS[nextTier] : null;

  return (
    <Card className="p-6 bg-zinc-50 border-zinc-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white border-2 border-zinc-200 flex items-center justify-center text-2xl shadow-sm">
            {config.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-zinc-900">{config.name} Verification</h3>
            <p className="text-sm text-zinc-600">{config.description}</p>
          </div>
        </div>
        <VerificationBadge status={status} size="sm" />
      </div>

      <div className="space-y-3 mb-4">
        <h4 className="text-sm font-medium text-zinc-700">Verification Requirements:</h4>
        <div className="space-y-2">
          {Object.values(VerificationTier).map((tier) => {
            if (tier === VerificationTier.NONE) return null;
            const tierConfig = VERIFICATION_TIERS[tier];
            const isCurrentTierCompleted = isTierCompleted(status.tier, tier);
            const isTierInProgress = isNextTier(status.tier, tier);

            return (
              <div key={tier} className={`p-3 rounded-lg border ${isCurrentTierCompleted ? 'bg-green-50 border-green-200' : isTierInProgress ? 'bg-blue-50 border-blue-200' : 'bg-zinc-50 border-zinc-200'}`}>
                <div className="flex items-center gap-2 mb-1">
                  {isCurrentTierCompleted ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : isTierInProgress ? (
                    <FileText className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Lock className="w-4 h-4 text-zinc-400" />
                  )}
                  <span className={`text-sm font-medium ${isCurrentTierCompleted ? 'text-green-800' : isTierInProgress ? 'text-blue-800' : 'text-zinc-500'}`}>
                    {tierConfig.name}
                  </span>
                </div>
                <div className="text-xs space-y-1 ml-6">
                  {tierConfig.requirements.map((req, idx) => (
                    <div key={idx} className={`flex items-center gap-1.5 ${isCurrentTierCompleted ? 'text-green-700' : isTierInProgress ? 'text-blue-700' : 'text-zinc-400'}`}>
                      {isCurrentTierCompleted ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-current" />
                      )}
                      {req}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {nextConfig && onVerify && (
        <Button
          onClick={onVerify}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white"
        >
          <FileText className="w-4 h-4 mr-2" />
          Upgrade to {nextConfig.name} Verification
        </Button>
      )}
    </Card>
  );
}

function getNextTier(tier: VerificationTier): VerificationTier | null {
  const tiers = [VerificationTier.NONE, VerificationTier.BASIC, VerificationTier.INTERMEDIATE, VerificationTier.ADVANCED];
  const currentIndex = tiers.indexOf(tier);
  return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
}

function isTierCompleted(currentTier: VerificationTier, checkTier: VerificationTier): boolean {
  const tiers = [VerificationTier.NONE, VerificationTier.BASIC, VerificationTier.INTERMEDIATE, VerificationTier.ADVANCED];
  return tiers.indexOf(currentTier) >= tiers.indexOf(checkTier);
}

function isNextTier(currentTier: VerificationTier, checkTier: VerificationTier): boolean {
  const nextTier = getNextTier(currentTier);
  return nextTier === checkTier;
}

interface VerificationUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, type: string) => void;
}

export function VerificationUploadDialog({ isOpen, onClose, onUpload }: VerificationUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [documentType, setDocumentType] = useState("id");

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    setUploading(true);
    setTimeout(() => {
      onUpload(selectedFile, documentType);
      toast.success("Document uploaded successfully!", {
        description: "Your document is being reviewed.",
        duration: 4000
      });
      setUploading(false);
      setSelectedFile(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-zinc-900">Upload Verification Document</h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-zinc-700 block mb-2">Document Type</label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-300 rounded-lg bg-white text-zinc-900"
            >
              <option value="id">Government ID (Driver's License, Passport)</option>
              <option value="certification">Skill Certification</option>
              <option value="background">Background Check Authorization</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-zinc-700 block mb-2">Select File</label>
            <div className="border-2 border-dashed border-zinc-300 rounded-lg p-8 text-center cursor-pointer hover:border-zinc-400 transition-colors">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
                id="verification-file"
              />
              <label htmlFor="verification-file" className="cursor-pointer">
                <FileText className="w-10 h-10 text-zinc-400 mx-auto mb-2" />
                {selectedFile ? (
                  <div>
                    <p className="text-sm font-medium text-zinc-900">{selectedFile.name}</p>
                    <p className="text-xs text-zinc-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-zinc-600 mb-1">Click to upload or drag and drop</p>
                    <p className="text-xs text-zinc-400">PNG, JPG, or PDF (max 5MB)</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-zinc-300 text-zinc-700 hover:bg-zinc-50"
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              className="flex-1 bg-teal-500 hover:bg-teal-600 text-white"
              disabled={uploading || !selectedFile}
            >
              {uploading ? "Uploading..." : "Upload Document"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
