import { CheckCircle, Info } from "lucide-react";

export interface Match {
  overall: number;
  category: { score: number; reason: string; weight: number };
  location: { score: number; reason: string; weight: number };
  budget: { score: number; reason: string; weight: number };
  experience: { score: number; reason: string; weight: number };
  rating: { score: number; reason: string; weight: number };
}

export interface MatchScoreProps {
  match: Match;
  compact?: boolean;
}

function getMatchColor(score: number): string {
  if (score >= 80) return "#10B981"; // Emerald green
  if (score >= 60) return "#F59E0B"; // Amber
  if (score >= 40) return "#F97316"; // Orange
  return "#EF4444"; // Red
}

function getMatchLabel(score: number): string {
  if (score >= 80) return "Excellent Match";
  if (score >= 60) return "Good Match";
  if (score >= 40) return "Fair Match";
  return "Poor Match";
}

export function MatchScore({ match, compact = false }: MatchScoreProps) {
  const color = getMatchColor(match.overall);
  const label = getMatchLabel(match.overall);

  return (
    <div className="bg-zinc-800 rounded-xl border border-zinc-700 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-4">
          {/* Score circle */}
          <div 
            className="relative w-20 h-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#374151"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke={color}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * match.overall) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold" style={{ color }}>
                {match.overall}%
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">{label}</h3>
            <p className="text-sm text-zinc-400">Compatibility score</p>
          </div>
        </div>

        {!compact && (
          <div className="space-y-3">
            <div className="text-xs text-zinc-400 font-medium mb-2">
              Breakdown
            </div>

            <ScoreItem
              label="Skills & Category"
              score={match.category.score}
              reason={match.category.reason}
              weight={match.category.weight}
              color={color}
            />
            <ScoreItem
              label="Location"
              score={match.location.score}
              reason={match.location.reason}
              weight={match.location.weight}
              color={color}
            />
            <ScoreItem
              label="Budget"
              score={match.budget.score}
              reason={match.budget.reason}
              weight={match.budget.weight}
              color={color}
            />
            <ScoreItem
              label="Experience"
              score={match.experience.score}
              reason={match.experience.reason}
              weight={match.experience.weight}
              color={color}
            />
            <ScoreItem
              label="Ratings"
              score={match.rating.score}
              reason={match.rating.reason}
              weight={match.rating.weight}
              color={color}
            />
          </div>
        )}
      </div>
    </div>
  );
}

interface ScoreItemProps {
  label: string;
  score: number;
  reason: string;
  weight: number;
  color: string;
}

function ScoreItem({ label, score, reason, weight, color }: ScoreItemProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-300">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-400">{Math.round(score * 100)}%</span>
          <span className="text-xs text-zinc-500 bg-zinc-700 px-2 py-0.5 rounded">
            {weight}%
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-zinc-700 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${score * 100}%`,
              backgroundColor: `${color}80`,
            }}
          />
        </div>
      </div>

      <p className="text-xs text-zinc-500 flex items-center gap-1">
        <Info className="w-3 h-3" />
        {reason}
      </p>
    </div>
  );
}

// Compact version for listings
export function MatchScoreBadge({ score }: { score?: number }) {
  if (score === undefined) return null;

  const color = getMatchColor(score);
  const label = getMatchLabel(score);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <CheckCircle className="w-4 h-4" style={{ color }} />
        <span className="text-sm font-medium" style={{ color }}>
          {score}% Match
        </span>
      </div>
      <span className="text-xs text-zinc-500 hidden sm:inline">
        {label}
      </span>
    </div>
  );
}
