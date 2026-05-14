export enum VerificationTier {
  NONE = "none",
  BASIC = "basic",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced"
}

export interface VerificationStatus {
  tier: VerificationTier;
  verifiedAt?: number;
  documents?: {
    idDocument?: boolean;
    backgroundCheck?: boolean;
    skillCertifications?: string[];
  };
}

export interface VerificationTierConfig {
  name: string;
  description: string;
  color: string;
  bgColor: string;
  requirements: string[];
  icon: string;
}

export const VERIFICATION_TIERS: Record<VerificationTier, VerificationTierConfig> = {
  [VerificationTier.NONE]: {
    name: "Not Verified",
    description: "No verification completed",
    color: "text-zinc-500",
    bgColor: "bg-zinc-100",
    requirements: [],
    icon: "🔒"
  },
  [VerificationTier.BASIC]: {
    name: "Basic",
    description: "Phone & Email Verified",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    requirements: ["Email Verification", "Phone Verification"],
    icon: "✓"
  },
  [VerificationTier.INTERMEDIATE]: {
    name: "Intermediate",
    description: "ID Document Verified",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    requirements: ["Email Verification", "Phone Verification", "Government ID Upload"],
    icon: "📋"
  },
  [VerificationTier.ADVANCED]: {
    name: "Advanced",
    description: "Background Check & Certifications",
    color: "text-green-600",
    bgColor: "bg-green-100",
    requirements: ["Email Verification", "Phone Verification", "Government ID Upload", "Background Check", "Skill Certifications"],
    icon: "🏆"
  }
};
