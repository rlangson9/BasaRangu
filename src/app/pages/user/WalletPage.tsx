import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../../components/BottomNav";
import { RoleSwitcher } from "../../components/RoleSwitcher";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { ArrowLeft, Wallet, CreditCard, Plus, Minus, Clock, CheckCircle, ArrowUp, ArrowDown } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { PaymentModal } from "../../components/PaymentModal";
import { WithdrawalModal } from "../../components/WithdrawalModal";
import { toast } from "sonner";

export function WalletPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>({});
  const [wallet, setWallet] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // In a real app, this would fetch from an API
      // For now, use mock data
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(userData);
      
      // Set wallet balance (default to 100 if not set)
      const walletBalance = userData.wallet || 100;
      setWallet(walletBalance);
      
      // Mock transaction data
      const mockTransactions = [
        {
          id: "1",
          type: "credit",
          amount: 50,
          description: "Payment for completed job",
          date: "2024-03-15T10:30:00Z",
          status: "completed"
        },
        {
          id: "2",
          type: "debit",
          amount: 20,
          description: "Payment to service provider",
          date: "2024-03-10T14:20:00Z",
          status: "completed"
        },
        {
          id: "3",
          type: "credit",
          amount: 80,
          description: "Refund for cancelled job",
          date: "2024-03-05T09:15:00Z",
          status: "completed"
        },
        {
          id: "4",
          type: "debit",
          amount: 15,
          description: "Platform fee",
          date: "2024-02-28T16:45:00Z",
          status: "completed"
        }
      ];
      
      setTransactions(mockTransactions);
      setLoading(false);
    } catch (error) {
      console.error("Error loading wallet data:", error);
      toast.error("Failed to load wallet data");
      setLoading(false);
    }
  };

  const handleAddFunds = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (amount: number) => {
    const newBalance = wallet + amount;
    setWallet(newBalance);
    
    // Update user data in localStorage
    const updatedUser = { ...user, wallet: newBalance };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    // Add transaction to history
    const newTransaction = {
      id: Date.now().toString(),
      type: "credit",
      amount: amount,
      description: "Added funds to wallet",
      date: new Date().toISOString(),
      status: "completed"
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const handleWithdrawSuccess = () => {
    const newWallet = Math.max(0, wallet - 10);
    setWallet(newWallet);
    
    const updatedUser = { ...user, wallet: newWallet };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    const newTransaction = {
      id: Date.now().toString(),
      type: "debit",
      amount: 10,
      description: "Withdrawal to bank",
      date: new Date().toISOString(),
      status: "completed"
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const handleWithdraw = () => {
    if (wallet < 10) {
      toast.error("Minimum withdrawal amount is $10");
      return;
    }
    setShowWithdrawalModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white hover:text-teal-400"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <h1 className="text-2xl font-bold text-white">My Wallet</h1>
            <RoleSwitcher />
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Wallet Balance Card */}
        <Card className="bg-gradient-to-r from-teal-600 to-teal-700 text-white mb-6 border-none">
          <CardHeader>
            <CardTitle>Wallet Balance</CardTitle>
            <CardDescription className="text-teal-100">
              Available funds for services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-4">${wallet}</div>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={handleAddFunds}
                className="bg-white text-teal-700 hover:bg-teal-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Funds
              </Button>
              <Button 
                onClick={handleWithdraw}
                className="bg-transparent border border-white text-white hover:bg-white/10"
              >
                <Minus className="w-4 h-4 mr-2" />
                Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-zinc-900 mb-6">
            <TabsTrigger value="all" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white text-zinc-400">
              All
            </TabsTrigger>
            <TabsTrigger value="credit" className="data-[state=active]:bg-green-500 data-[state=active]:text-white text-zinc-400">
              Credits
            </TabsTrigger>
            <TabsTrigger value="debit" className="data-[state=active]:bg-red-500 data-[state=active]:text-white text-zinc-400">
              Debits
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-zinc-400">No transactions yet</p>
              </div>
            ) : (
              transactions.map((transaction) => (
                <Card key={transaction.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'credit' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                          {transaction.type === 'credit' ? <ArrowUp className="w-5 h-5" /> : <ArrowDown className="w-5 h-5" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{transaction.description}</h4>
                          <p className="text-sm text-zinc-500">{formatDate(transaction.date)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-semibold ${transaction.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                          {transaction.type === 'credit' ? '+' : '-'}$${transaction.amount}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {getStatusIcon(transaction.status)}
                          <span className="text-xs text-zinc-500 capitalize">{transaction.status}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="credit" className="space-y-4">
            {transactions.filter(t => t.type === 'credit').length === 0 ? (
              <div className="text-center py-12">
                <p className="text-zinc-400">No credit transactions yet</p>
              </div>
            ) : (
              transactions.filter(t => t.type === 'credit').map((transaction) => (
                <Card key={transaction.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-500/20 text-green-500">
                          <ArrowUp className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{transaction.description}</h4>
                          <p className="text-sm text-zinc-500">{formatDate(transaction.date)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-500">
                          +${transaction.amount}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {getStatusIcon(transaction.status)}
                          <span className="text-xs text-zinc-500 capitalize">{transaction.status}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="debit" className="space-y-4">
            {transactions.filter(t => t.type === 'debit').length === 0 ? (
              <div className="text-center py-12">
                <p className="text-zinc-400">No debit transactions yet</p>
              </div>
            ) : (
              transactions.filter(t => t.type === 'debit').map((transaction) => (
                <Card key={transaction.id} className="bg-zinc-900 border-zinc-800">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500/20 text-red-500">
                          <ArrowDown className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{transaction.description}</h4>
                          <p className="text-sm text-zinc-500">{formatDate(transaction.date)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-red-500">
                          -${transaction.amount}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {getStatusIcon(transaction.status)}
                          <span className="text-xs text-zinc-500 capitalize">{transaction.status}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Payment Methods */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">Payment Methods</h3>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-teal-400" />
                  <div>
                    <h4 className="font-medium text-white">**** **** **** 1234</h4>
                    <p className="text-sm text-zinc-500">Expires: 12/26</p>
                  </div>
                </div>
                <Badge className="bg-teal-500/20 text-teal-400">Default</Badge>
              </div>
              <Button 
                className="w-full border border-zinc-700 bg-transparent text-white hover:bg-zinc-800"
              >
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNav role="user" />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
      />

      <WithdrawalModal
        open={showWithdrawalModal}
        onClose={() => setShowWithdrawalModal(false)}
        availableBalance={wallet}
        onSuccess={handleWithdrawalSuccess}
      />
    </div>
  );
}
