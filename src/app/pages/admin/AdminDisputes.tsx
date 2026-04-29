import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Search,
} from "lucide-react";
import { projectId } from "../../../../utils/supabase/info";
import { toast } from "sonner";

export function AdminDisputes() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolution, setResolution] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5ed51d91/admin/disputes`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      setDisputes(data.disputes || []);
    } catch (error) {
      console.error("Error fetching disputes:", error);
      toast.error("Failed to load disputes");
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!resolution) {
      toast.error("Please provide a resolution");
      return;
    }

    setResolving(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-5ed51d91/admin/disputes/${selectedDispute.id}/resolve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            resolution,
            refundAmount: refundAmount ? parseFloat(refundAmount) : 0,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Dispute resolved successfully");
        setShowResolveModal(false);
        setSelectedDispute(null);
        setResolution("");
        setRefundAmount("");
        fetchDisputes();
      } else {
        toast.error(data.error || "Failed to resolve dispute");
      }
    } catch (error) {
      console.error("Error resolving dispute:", error);
      toast.error("Failed to resolve dispute");
    } finally {
      setResolving(false);
    }
  };

  const filteredDisputes = disputes.filter((dispute) =>
    dispute.jobId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dispute.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dispute.reason?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "resolved":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-500 border-zinc-500/20";
    }
  };

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      incomplete: "Incomplete Work",
      quality: "Poor Quality",
      noshow: "No Show",
      damage: "Property Damage",
      other: "Other",
    };
    return labels[reason] || reason;
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dispute Management</h1>
          <p className="text-zinc-400">Review and resolve user disputes</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by job ID, user, or reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-900 border-zinc-800 text-white"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <div className="text-sm text-zinc-400 mb-1">Total Disputes</div>
            <div className="text-2xl font-bold text-white">{disputes.length}</div>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4 border border-yellow-500/20">
            <div className="text-sm text-zinc-400 mb-1">Pending</div>
            <div className="text-2xl font-bold text-yellow-500">
              {disputes.filter((d) => d.status === "pending").length}
            </div>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4 border border-green-500/20">
            <div className="text-sm text-zinc-400 mb-1">Resolved</div>
            <div className="text-2xl font-bold text-green-500">
              {disputes.filter((d) => d.status === "resolved").length}
            </div>
          </div>
        </div>

        {/* Disputes List */}
        {loading ? (
          <div className="text-center text-white py-12">Loading...</div>
        ) : filteredDisputes.length === 0 ? (
          <div className="bg-zinc-900 rounded-lg p-12 border border-zinc-800 text-center">
            <AlertTriangle className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Disputes Found</h3>
            <p className="text-zinc-400">
              {searchQuery ? "Try adjusting your search" : "No disputes have been filed yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDisputes.map((dispute) => (
              <div
                key={dispute.id}
                className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {getReasonLabel(dispute.reason)}
                      </h3>
                      <Badge className={getStatusColor(dispute.status)}>
                        {dispute.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-zinc-400 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Job ID:</span>
                        <span className="font-mono">{dispute.jobId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">User:</span>
                        <span>{dispute.userName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(dispute.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedDispute(dispute);
                      setShowResolveModal(true);
                    }}
                    className="bg-teal-500 hover:bg-teal-600 text-white"
                    disabled={dispute.status === "resolved"}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {dispute.status === "resolved" ? "View" : "Resolve"}
                  </Button>
                </div>

                <div className="bg-zinc-800 rounded-lg p-4">
                  <div className="text-xs font-semibold text-zinc-400 mb-2">Description</div>
                  <p className="text-sm text-zinc-300">{dispute.description}</p>
                </div>

                {dispute.resolution && (
                  <div className="mt-4 bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                    <div className="flex items-center gap-2 text-green-500 font-semibold mb-2">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs">Resolution</span>
                    </div>
                    <p className="text-sm text-zinc-300">{dispute.resolution}</p>
                    <div className="text-xs text-zinc-500 mt-2">
                      Resolved on {new Date(dispute.resolvedAt).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resolve Modal */}
      <Dialog open={showResolveModal} onOpenChange={setShowResolveModal}>
        <DialogContent className="bg-zinc-900 text-white border-zinc-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {selectedDispute?.status === "resolved" ? "View" : "Resolve"} Dispute
            </DialogTitle>
          </DialogHeader>

          {selectedDispute && (
            <div className="space-y-4">
              {/* Dispute Details */}
              <div className="bg-zinc-800 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-zinc-500 mb-1">Reason</div>
                    <div className="text-white font-medium">
                      {getReasonLabel(selectedDispute.reason)}
                    </div>
                  </div>
                  <div>
                    <div className="text-zinc-500 mb-1">Job ID</div>
                    <div className="text-white font-mono">{selectedDispute.jobId}</div>
                  </div>
                  <div>
                    <div className="text-zinc-500 mb-1">User</div>
                    <div className="text-white">{selectedDispute.userName}</div>
                  </div>
                  <div>
                    <div className="text-zinc-500 mb-1">Filed On</div>
                    <div className="text-white">
                      {new Date(selectedDispute.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="text-sm font-semibold text-zinc-300 mb-2">Description</div>
                <div className="bg-zinc-800 rounded-lg p-4 text-sm text-zinc-400">
                  {selectedDispute.description}
                </div>
              </div>

              {selectedDispute.status === "pending" ? (
                <>
                  {/* Resolution Input */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Resolution Decision *
                    </label>
                    <Textarea
                      placeholder="Provide details of your decision and any actions taken..."
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white min-h-24"
                    />
                  </div>

                  {/* Refund Amount */}
                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Refund Amount (Optional)
                    </label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                    <p className="text-xs text-zinc-500 mt-1">
                      Leave empty if no refund is issued
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowResolveModal(false);
                        setSelectedDispute(null);
                        setResolution("");
                        setRefundAmount("");
                      }}
                      disabled={resolving}
                      className="flex-1 border-zinc-700 text-white hover:bg-zinc-800"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleResolve}
                      disabled={resolving || !resolution}
                      className="flex-1 bg-teal-500 hover:bg-teal-600 text-white"
                    >
                      {resolving ? "Resolving..." : "Resolve Dispute"}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Resolved Info */}
                  <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                    <div className="flex items-center gap-2 text-green-500 font-semibold mb-3">
                      <CheckCircle className="w-5 h-5" />
                      <span>Resolved</span>
                    </div>
                    <div className="text-sm text-zinc-300 mb-2">
                      {selectedDispute.resolution}
                    </div>
                    <div className="text-xs text-zinc-500">
                      Resolved on {new Date(selectedDispute.resolvedAt).toLocaleString()}
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setShowResolveModal(false);
                      setSelectedDispute(null);
                    }}
                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-white"
                  >
                    Close
                  </Button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
