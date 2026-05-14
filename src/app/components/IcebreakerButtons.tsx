import { useState, useEffect } from "react";
import { MessageCircle, Sparkles } from "lucide-react";
import { generateIcebreakers, getQuickRepliesByCategory, IcebreakerContext, IcebreakerPrompt } from "../utils/icebreakers";

export interface IcebreakerButtonsProps {
  context: IcebreakerContext;
  onSelect: (message: string) => void;
  showQuickReplies?: boolean;
}

export function IcebreakerButtons({ context, onSelect, showQuickReplies = false }: IcebreakerButtonsProps) {
  const [icebreakers, setIcebreakers] = useState<IcebreakerPrompt[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    const generated = generateIcebreakers(context);
    setIcebreakers(generated);
  }, [context]);

  const categories = ["all", "greeting", "availability", "details", "budget", "compliment"];

  const filteredIcebreakers = activeCategory === "all"
    ? icebreakers
    : icebreakers.filter(i => i.category === activeCategory);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "greeting": return "Hi";
      case "availability": return "When";
      case "details": return "Details";
      case "budget": return "Budget";
      case "compliment": return "Compliment";
      default: return "All";
    }
  };

  return (
    <div className="bg-zinc-800 rounded-xl border border-zinc-700 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-amber-400" />
        <h3 className="text-sm font-semibold text-white">Quick Messages</h3>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeCategory === category
                ? "bg-teal-500 text-white"
                : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
            }`}
          >
            {getCategoryLabel(category)}
          </button>
        ))}
      </div>

      {/* Icebreaker prompts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
        {filteredIcebreakers.map((icebreaker) => (
          <button
            key={icebreaker.id}
            onClick={() => onSelect(icebreaker.text)}
            className="flex items-center gap-2 p-3 bg-zinc-700/50 hover:bg-zinc-700 rounded-lg text-left transition-colors group"
          >
            <MessageCircle className="w-4 h-4 text-zinc-500 group-hover:text-teal-400 transition-colors" />
            <span className="text-sm text-zinc-300 group-hover:text-white line-clamp-2">
              {icebreaker.text}
            </span>
          </button>
        ))}
      </div>

      {/* Quick replies */}
      {showQuickReplies && (
        <div className="pt-4 border-t border-zinc-700">
          <p className="text-xs text-zinc-500 mb-2">Quick Replies</p>
          <div className="flex flex-wrap gap-2">
            {getQuickRepliesByCategory().map((reply) => (
              <button
                key={reply.id}
                onClick={() => onSelect(reply.text)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  reply.category === "response"
                    ? "bg-teal-500/20 text-teal-400 hover:bg-teal-500/30"
                    : reply.category === "question"
                    ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                    : "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                }`}
              >
                {reply.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Compact version for chat input
export function IcebreakerQuickButtons({ context, onSelect }: Omit<IcebreakerButtonsProps, "showQuickReplies">) {
  const [icebreakers, setIcebreakers] = useState<IcebreakerPrompt[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const generated = generateIcebreakers(context);
    setIcebreakers(generated.slice(0, 3));
  }, [context]);

  return (
    <div className="space-y-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 transition-colors"
      >
        <Sparkles className="w-4 h-4" />
        {isExpanded ? "Hide quick messages" : "Quick messages"}
      </button>

      {isExpanded && (
        <div className="flex flex-wrap gap-2">
          {icebreakers.map((icebreaker) => (
            <button
              key={icebreaker.id}
              onClick={() => onSelect(icebreaker.text)}
              className="flex items-center gap-2 px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-left transition-colors"
            >
              <MessageCircle className="w-3 h-3 text-zinc-500" />
              <span className="text-xs text-zinc-300 line-clamp-1 max-w-[150px]">
                {icebreaker.text}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
