import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { BottomNav } from "../../components/BottomNav";
import { RoleSwitcher } from "../../components/RoleSwitcher";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Switch } from "../../components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Language, 
  HelpCircle, 
  LogOut, 
  ArrowLeft, 
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

export function UserSettings() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    phone: "",
    password: "",
  });
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    jobUpdates: true,
    serviceProviderMessages: true,
    systemUpdates: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = () => {
    // Load existing user data from localStorage
    const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (existingUser) {
      setUser({
        email: existingUser.email || "",
        phone: existingUser.phone || "",
        password: "",
      });
    }
  };

  const handleSaveAccountSettings = async () => {
    setLoading(true);
    try {
      // In a real app, this would save to an API
      // For now, save to localStorage
      const updatedUser = {
        ...JSON.parse(localStorage.getItem("user") || "{}"),
        ...user,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      toast.success("Account settings updated successfully");
    } catch (error) {
      console.error("Error updating account settings:", error);
      toast.error("Failed to update account settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotificationSettings = async () => {
    setLoading(true);
    try {
      // In a real app, this would save to an API
      // For now, save to localStorage
      const updatedUser = {
        ...JSON.parse(localStorage.getItem("user") || "{}"),
        notifications,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      toast.success("Notification settings updated successfully");
    } catch (error) {
      console.error("Error updating notification settings:", error);
      toast.error("Failed to update notification settings");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      <div className="sticky top-0 z-40 bg-zinc-900 border-b border-zinc-800">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="text-white hover:text-teal-400"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <div className="flex-1" />
            <RoleSwitcher />
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="w-full grid grid-cols-4 bg-zinc-900 border border-zinc-800 mb-6">
            <TabsTrigger value="account" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white text-zinc-400">
              <User className="w-4 h-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white text-zinc-400">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white text-zinc-400">
              <Shield className="w-4 h-4 mr-2" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="billing" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white text-zinc-400">
              <CreditCard className="w-4 h-4 mr-2" />
              Billing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="w-full bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={user.phone}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    className="w-full bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Password
                  </label>
                  <Input
                    type="password"
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    placeholder="Enter new password (leave blank to keep current)"
                    className="w-full bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <Button
                  onClick={handleSaveAccountSettings}
                  disabled={loading}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold text-white mb-4">Profile Information</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-zinc-400">Personal Profile</h4>
                    <p className="text-xs text-zinc-500 mt-1">Update your personal details</p>
                  </div>
                  <Button
                    onClick={() => navigate("/user/profile")}
                    className="bg-teal-500 hover:bg-teal-600 text-white"
                  >
                    Edit Profile
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-zinc-400">Verification Status</h4>
                    <p className="text-xs text-zinc-500 mt-1">Verify your account for better trust</p>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-medium text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-zinc-400">Email Notifications</h4>
                    <p className="text-xs text-zinc-500 mt-1">Receive emails for important updates</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-zinc-400">SMS Notifications</h4>
                    <p className="text-xs text-zinc-500 mt-1">Receive text messages for urgent updates</p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-zinc-400">Push Notifications</h4>
                    <p className="text-xs text-zinc-500 mt-1">Receive app notifications</p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                  />
                </div>
                <div className="border-t border-zinc-800 pt-4">
                  <h4 className="text-sm font-medium text-zinc-400 mb-3">Notification Types</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400">Job updates</span>
                      <Switch
                        checked={notifications.jobUpdates}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, jobUpdates: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400">Service provider messages</span>
                      <Switch
                        checked={notifications.serviceProviderMessages}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, serviceProviderMessages: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-zinc-400">System updates</span>
                      <Switch
                        checked={notifications.systemUpdates}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, systemUpdates: checked })}
                      />
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleSaveNotificationSettings}
                  disabled={loading}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                >
                  {loading ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold text-white mb-4">Privacy Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-zinc-400">Profile Visibility</h4>
                    <p className="text-xs text-zinc-500 mt-1">Make your profile visible to service providers</p>
                  </div>
                  <Switch checked={true} onCheckedChange={() => {}} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-zinc-400">Data Sharing</h4>
                    <p className="text-xs text-zinc-500 mt-1">Share anonymous usage data for improvement</p>
                  </div>
                  <Switch checked={false} onCheckedChange={() => {}} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-zinc-400">Two-Factor Authentication</h4>
                    <p className="text-xs text-zinc-500 mt-1">Add an extra layer of security</p>
                  </div>
                  <Switch checked={false} onCheckedChange={() => {}} />
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold text-white mb-4">Data Management</h3>
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                >
                  Download My Data
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10"
                >
                  Delete My Account
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold text-white mb-4">Billing Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Payment Method
                  </label>
                  <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-blue-500 flex items-center justify-center text-white font-bold">
                          V
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">Visa ending in 4242</p>
                          <p className="text-xs text-zinc-500">Expires: 12/24</p>
                        </div>
                      </div>
                      <Button variant="outline" className="border-zinc-700 text-zinc-400 hover:bg-zinc-800">
                        Change
                      </Button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">
                    Billing Address
                  </label>
                  <Input
                    type="text"
                    value="123 Main Street, Harare, Zimbabwe"
                    readOnly
                    className="w-full bg-zinc-800 border-zinc-700 text-zinc-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <h3 className="text-lg font-semibold text-white mb-4">Subscription</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-zinc-400">Current Plan</h4>
                    <p className="text-xs text-zinc-500 mt-1">Free Plan</p>
                  </div>
                  <span className="text-sm font-medium text-white">$0/month</span>
                </div>
                <Button onClick={() => navigate("/user/vip")} className="w-full bg-teal-500 hover:bg-teal-600 text-white">
                  Upgrade to VIP
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full mt-6 border-red-500/20 text-red-400 hover:bg-red-500/10"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </div>

      <BottomNav role="user" />
    </div>
  );
}
