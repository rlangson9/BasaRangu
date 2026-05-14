import { useState, useEffect, useRef } from "react";
import { 
  Phone, 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  X, 
  PhoneOff, 
  Volume2, 
  VolumeX, 
  Coins,
  Timer
} from "lucide-react";
import { Button } from "./ui/button";
import { api, getAuthToken } from "../services/api";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { CoinPurchase } from "./CoinPurchase";

interface VideoCallProps {
  isOpen: boolean;
  onClose: () => void;
  callType: "audio" | "video";
  recipientName: string;
  onCallEnd?: (duration: number) => void;
}

const CALL_COSTS = {
  audio: 2, // coins per minute
  video: 5, // coins per minute
};

export function VideoCall({ isOpen, onClose, callType, recipientName, onCallEnd }: VideoCallProps) {
  const [callStatus, setCallStatus] = useState<"connecting" | "ringing" | "connected" | "ended">("connecting");
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOff, setIsSpeakerOff] = useState(false);
  const [showCoinPurchase, setShowCoinPurchase] = useState(false);
  const [coinBalance, setCoinBalance] = useState(0);
  const [checkingCoins, setCheckingCoins] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      checkCoinsAndStart();
    } else {
      endCall();
    }

    return () => {
      endCall();
    };
  }, [isOpen]);

  useEffect(() => {
    if (callStatus === "connected") {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [callStatus]);

  const checkCoinsAndStart = async () => {
    setCheckingCoins(true);
    try {
      const token = getAuthToken();
      if (token) {
        // Load current balance
        const balanceData = await api.coins.getBalance(token);
        setCoinBalance(balanceData.balance);

        // Check if enough coins for at least 10 minutes
        const checkData = await api.coins.checkCoins(token, callType, 10);
        
        if (!checkData.hasEnough) {
          toast.warning("Not enough coins", {
            description: `You need at least ${checkData.required} coins for a 10-minute call.`,
          });
          setShowCoinPurchase(true);
          setCallStatus("ended");
          return;
        }

        // Start call simulation
        simulateCall();
      }
    } catch (error) {
      toast.error("Failed to start call");
      setCallStatus("ended");
    } finally {
      setCheckingCoins(false);
    }
  };

  const simulateCall = () => {
    setCallStatus("connecting");
    
    setTimeout(() => {
      setCallStatus("ringing");
      
      setTimeout(() => {
        setCallStatus("connected");
        toast.success("Call connected!");
      }, 2000);
    }, 1500);
  };

  const endCall = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (callStatus === "connected" && callDuration > 0) {
      try {
        const token = getAuthToken();
        const durationMinutes = Math.ceil(callDuration / 60);
        
        if (token && durationMinutes > 0) {
          const data = await api.coins.deductCoins(
            token, 
            callType, 
            durationMinutes, 
            `call-${Date.now()}`
          );
          setCoinBalance(data.balance);
          toast.info("Call ended", {
            description: `${durationMinutes} minute(s) - ${CALL_COSTS[callType] * durationMinutes} coins deducted`,
          });
        }
      } catch (error) {
        console.error("Failed to deduct coins:", error);
      }
    }

    setCallStatus("ended");
    setCallDuration(0);
    onCallEnd?.(callDuration);
    onClose();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusText = () => {
    switch (callStatus) {
      case "connecting":
        return "Connecting...";
      case "ringing":
        return "Ringing...";
      case "connected":
        return formatDuration(callDuration);
      case "ended":
        return "Call ended";
      default:
        return "";
    }
  };

  const handleCoinPurchaseSuccess = (newBalance: number) => {
    setCoinBalance(newBalance);
    setShowCoinPurchase(false);
    // Try to start call again
    simulateCall();
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-4xl p-0 overflow-hidden">
          {/* Call Header */}
          <div className="bg-zinc-800 p-4 border-b border-zinc-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                  {callType === "video" ? (
                    <Video className="w-6 h-6 text-white" />
                  ) : (
                    <Phone className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-white">{recipientName}</h3>
                  <p className="text-sm text-zinc-400">{getStatusText()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-amber-500/20 px-3 py-1.5 rounded-full">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400 font-semibold">{coinBalance}</span>
                </div>
                <div className="text-xs text-zinc-400">
                  {CALL_COSTS[callType]} coins/min
                </div>
              </div>
            </div>
          </div>

          {/* Video Container */}
          <div className="relative aspect-video bg-zinc-950">
            {/* Remote Video Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 bg-zinc-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                  {callType === "video" && !isVideoOff ? (
                    <Video className="w-16 h-16 text-zinc-600" />
                  ) : (
                    <div className="text-4xl font-bold text-zinc-600">
                      {recipientName.charAt(0)}
                    </div>
                  )}
                </div>
                <p className="text-zinc-400 text-lg">{recipientName}</p>
              </div>
            </div>

            {/* Self Video Preview (for video calls) */}
            {callType === "video" && (
              <div className="absolute bottom-4 right-4 w-32 h-24 bg-zinc-800 rounded-lg border-2 border-zinc-700 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  {!isVideoOff ? (
                    <Video className="w-8 h-8 text-zinc-600" />
                  ) : (
                    <VideoOff className="w-8 h-8 text-zinc-600" />
                  )}
                </div>
              </div>
            )}

            {/* Call Status Overlay */}
            {callStatus !== "connected" && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="text-center">
                  {callStatus === "ringing" && (
                    <div className="mb-4">
                      <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                  )}
                  {callStatus === "connecting" && (
                    <div className="mb-4">
                      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    </div>
                  )}
                  <p className="text-xl text-white font-semibold">{getStatusText()}</p>
                </div>
              </div>
            )}
          </div>

          {/* Call Controls */}
          <div className="bg-zinc-800 p-6 border-t border-zinc-700">
            <div className="flex items-center justify-center gap-4">
              {/* Mute Toggle */}
              <Button
                onClick={() => setIsMuted(!isMuted)}
                variant="ghost"
                className={`w-14 h-14 rounded-full ${isMuted ? "bg-red-500/20 text-red-400" : "bg-zinc-700 text-white hover:bg-zinc-600"}`}
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </Button>

              {/* End Call */}
              <Button
                onClick={endCall}
                className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white"
              >
                <PhoneOff className="w-8 h-8" />
              </Button>

              {/* Video Toggle (only for video calls) */}
              {callType === "video" && (
                <Button
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  variant="ghost"
                  className={`w-14 h-14 rounded-full ${isVideoOff ? "bg-red-500/20 text-red-400" : "bg-zinc-700 text-white hover:bg-zinc-600"}`}
                >
                  {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                </Button>
              )}

              {/* Speaker Toggle */}
              <Button
                onClick={() => setIsSpeakerOff(!isSpeakerOff)}
                variant="ghost"
                className={`w-14 h-14 rounded-full ${isSpeakerOff ? "bg-red-500/20 text-red-400" : "bg-zinc-700 text-white hover:bg-zinc-600"}`}
              >
                {isSpeakerOff ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <CoinPurchase
        isOpen={showCoinPurchase}
        onClose={() => {
          setShowCoinPurchase(false);
          onClose();
        }}
        onSuccess={handleCoinPurchaseSuccess}
      />
    </>
  );
}

export function CallInitiator({ 
  recipientName, 
  onStartCall 
}: { 
  recipientName: string; 
  onStartCall: (callType: "audio" | "video") => void; 
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [coinBalance, setCoinBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(true);

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      const token = getAuthToken();
      if (token) {
        const data = await api.coins.getBalance(token);
        setCoinBalance(data.balance);
      }
    } catch (error) {
      console.error("Failed to load balance:", error);
    } finally {
      setLoadingBalance(false);
    }
  };

  const handleStartCall = (callType: "audio" | "video") => {
    setShowOptions(false);
    onStartCall(callType);
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setShowOptions(!showOptions)}
        variant="ghost"
        className="bg-zinc-800 hover:bg-zinc-700 text-white"
      >
        <Video className="w-5 h-5 mr-2" />
        Call
      </Button>

      {showOptions && (
        <div className="absolute bottom-full mb-2 right-0 bg-zinc-800 rounded-xl p-2 border border-zinc-700 shadow-xl min-w-[200px] z-50">
          <div className="text-xs text-zinc-400 mb-2 px-2">
            Costs: {CALL_COSTS.audio} coins/min (audio), {CALL_COSTS.video} coins/min (video)
          </div>
          <div className="text-xs text-amber-400 mb-3 px-2 flex items-center gap-1">
            <Coins className="w-3 h-3" />
            Your balance: {loadingBalance ? "..." : coinBalance}
          </div>
          <button
            onClick={() => handleStartCall("audio")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-zinc-700 transition-colors text-left"
          >
            <Phone className="w-5 h-5 text-teal-400" />
            <div>
              <div className="text-white font-medium">Audio Call</div>
              <div className="text-xs text-zinc-400">{CALL_COSTS.audio} coins/min</div>
            </div>
          </button>
          <button
            onClick={() => handleStartCall("video")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-zinc-700 transition-colors text-left"
          >
            <Video className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-white font-medium">Video Call</div>
              <div className="text-xs text-zinc-400">{CALL_COSTS.video} coins/min</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
