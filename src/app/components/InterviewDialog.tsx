import { useState } from "react";
import { Calendar, Clock, MapPin, Phone, Video, FileText, Send, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";

interface InterviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  jobTitle: string;
  onSend?: (interview: InterviewDetails) => void;
}

interface InterviewDetails {
  date: string;
  time: string;
  type: "in-person" | "phone" | "video";
  location?: string;
  notes: string;
  duration: number;
}

export function InterviewDialog({ isOpen, onClose, candidateName, jobTitle, onSend }: InterviewDialogProps) {
  const [sending, setSending] = useState(false);
  const [interview, setInterview] = useState<InterviewDetails>({
    date: "",
    time: "",
    type: "video",
    location: "",
    notes: "",
    duration: 30,
  });

  const handleSend = async () => {
    if (!interview.date || !interview.time) {
      toast.error("Please select date and time");
      return;
    }

    setSending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Interview Invitation Sent!", {
        description: `Invitation sent to ${candidateName} for ${formatDate(interview.date)} at ${interview.time}`,
        duration: 4000,
      });

      onSend?.(interview);
      onClose();
      
      setInterview({
        date: "",
        time: "",
        type: "video",
        location: "",
        notes: "",
        duration: 30,
      });
    } catch (error) {
      toast.error("Failed to send invitation");
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getInterviewTypeIcon = (type: string) => {
    switch (type) {
      case "in-person":
        return <MapPin className="w-5 h-5" />;
      case "phone":
        return <Phone className="w-5 h-5" />;
      case "video":
        return <Video className="w-5 h-5" />;
      default:
        return <Video className="w-5 h-5" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle>Schedule Interview</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Invite {candidateName} for an interview
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Job Info */}
          <div className="bg-zinc-800 rounded-lg p-3">
            <div className="text-xs text-zinc-400 mb-1">Position</div>
            <div className="text-sm font-medium text-white">{jobTitle}</div>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Interview Date
            </label>
            <Input
              type="date"
              value={interview.date}
              onChange={(e) => setInterview({ ...interview, date: e.target.value })}
              min={getMinDate()}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Interview Time
            </label>
            <Input
              type="time"
              value={interview.time}
              onChange={(e) => setInterview({ ...interview, time: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">
              Duration
            </label>
            <div className="flex gap-2">
              {[15, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  onClick={() => setInterview({ ...interview, duration: mins })}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    interview.duration === mins
                      ? "bg-teal-500 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          {/* Interview Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">
              Interview Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setInterview({ ...interview, type: "video" })}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  interview.type === "video"
                    ? "border-teal-500 bg-teal-500/10"
                    : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                }`}
              >
                <Video className="w-5 h-5 text-blue-400" />
                <span className="text-xs">Video</span>
              </button>
              <button
                onClick={() => setInterview({ ...interview, type: "phone" })}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  interview.type === "phone"
                    ? "border-teal-500 bg-teal-500/10"
                    : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                }`}
              >
                <Phone className="w-5 h-5 text-green-400" />
                <span className="text-xs">Phone</span>
              </button>
              <button
                onClick={() => setInterview({ ...interview, type: "in-person" })}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  interview.type === "in-person"
                    ? "border-teal-500 bg-teal-500/10"
                    : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                }`}
              >
                <MapPin className="w-5 h-5 text-purple-400" />
                <span className="text-xs">In-Person</span>
              </button>
            </div>
          </div>

          {/* Location (for in-person) */}
          {interview.type === "in-person" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </label>
              <Input
                type="text"
                placeholder="Enter office address or meeting room"
                value={interview.location}
                onChange={(e) => setInterview({ ...interview, location: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Additional Notes
            </label>
            <Textarea
              placeholder="Add any preparation instructions or details..."
              value={interview.notes}
              onChange={(e) => setInterview({ ...interview, notes: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={sending || !interview.date || !interview.time}
            className="bg-teal-500 hover:bg-teal-600 text-white"
          >
            {sending ? (
              "Sending..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Invitation
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
