import { Hono } from "npm:hono";

const coinsRouter = new Hono();

// Coin packages configuration
const COIN_PACKAGES = [
  { id: "basic", coins: 50, price: 4.99, discount: 0 },
  { id: "standard", coins: 120, price: 9.99, discount: 17 },
  { id: "premium", coins: 250, price: 19.99, discount: 25 },
  { id: "pro", coins: 600, price: 39.99, discount: 33 },
  { id: "enterprise", coins: 1500, price: 99.99, discount: 40 },
];

// Call cost configuration (per minute)
const CALL_COSTS = {
  audio: 2, // 2 coins per minute
  video: 5, // 5 coins per minute
};

// Mock database - in production, use Supabase
const mockUserCoins = new Map<string, number>();
const mockTransactions = new Map<string, any[]>();

// Initialize with some mock data
mockUserCoins.set("1", 100); // User 1 has 100 coins
mockUserCoins.set("2", 50); // User 2 has 50 coins

// Middleware - simplified auth check
const authCheck = async (c: any, next: any) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  
  // Simplified - in production, verify JWT
  c.set("userId", token); // Use token as userId for mock
  await next();
};

coinsRouter.use("/*", authCheck);

// Get user's coin balance
coinsRouter.get("/balance", async (c) => {
  const userId = c.get("userId");
  const balance = mockUserCoins.get(userId) || 0;
  
  return c.json({
    success: true,
    balance,
    currency: "coins",
  });
});

// Get coin packages for purchase
coinsRouter.get("/packages", async (c) => {
  return c.json({
    success: true,
    packages: COIN_PACKAGES,
  });
});

// Purchase coins
coinsRouter.post("/purchase", async (c) => {
  const userId = c.get("userId");
  const { packageId, paymentMethod } = await c.req.json();
  
  const selectedPackage = COIN_PACKAGES.find(p => p.id === packageId);
  
  if (!selectedPackage) {
    return c.json({ error: "Invalid package" }, 400);
  }
  
  const currentBalance = mockUserCoins.get(userId) || 0;
  const newBalance = currentBalance + selectedPackage.coins;
  
  mockUserCoins.set(userId, newBalance);
  
  // Record transaction
  const transaction = {
    id: `txn-${Date.now()}`,
    userId,
    type: "purchase",
    packageId,
    coins: selectedPackage.coins,
    amount: selectedPackage.price,
    paymentMethod,
    timestamp: Date.now(),
    status: "completed",
  };
  
  if (!mockTransactions.has(userId)) {
    mockTransactions.set(userId, []);
  }
  mockTransactions.get(userId)!.unshift(transaction);
  
  return c.json({
    success: true,
    balance: newBalance,
    transaction,
    message: `Successfully purchased ${selectedPackage.coins} coins!`,
  });
});

// Get transaction history
coinsRouter.get("/transactions", async (c) => {
  const userId = c.get("userId");
  const transactions = mockTransactions.get(userId) || [];
  
  return c.json({
    success: true,
    transactions,
  });
});

// Get call cost information
coinsRouter.get("/call-costs", async (c) => {
  return c.json({
    success: true,
    costs: CALL_COSTS,
    description: "Audio calls cost 2 coins per minute, video calls cost 5 coins per minute",
  });
});

// Deduct coins for a call
coinsRouter.post("/deduct", async (c) => {
  const userId = c.get("userId");
  const { callType, durationMinutes, callId } = await c.req.json();
  
  const costPerMinute = CALL_COSTS[callType as keyof typeof CALL_COSTS];
  
  if (!costPerMinute) {
    return c.json({ error: "Invalid call type" }, 400);
  }
  
  const totalCost = costPerMinute * durationMinutes;
  const currentBalance = mockUserCoins.get(userId) || 0;
  
  if (currentBalance < totalCost) {
    return c.json({
      error: "Insufficient coins",
      required: totalCost,
      current: currentBalance,
    }, 400);
  }
  
  const newBalance = currentBalance - totalCost;
  mockUserCoins.set(userId, newBalance);
  
  // Record transaction
  const transaction = {
    id: `txn-${Date.now()}`,
    userId,
    type: "call",
    callId,
    callType,
    durationMinutes,
    coins: -totalCost,
    timestamp: Date.now(),
    status: "completed",
  };
  
  if (!mockTransactions.has(userId)) {
    mockTransactions.set(userId, []);
  }
  mockTransactions.get(userId)!.unshift(transaction);
  
  return c.json({
    success: true,
    balance: newBalance,
    transaction,
    message: `Call complete. ${totalCost} coins deducted.`,
  });
});

// Check if user has enough coins for a call
coinsRouter.post("/check", async (c) => {
  const userId = c.get("userId");
  const { callType, estimatedMinutes } = await c.req.json();
  
  const costPerMinute = CALL_COSTS[callType as keyof typeof CALL_COSTS];
  
  if (!costPerMinute) {
    return c.json({ error: "Invalid call type" }, 400);
  }
  
  const estimatedCost = costPerMinute * estimatedMinutes;
  const currentBalance = mockUserCoins.get(userId) || 0;
  const hasEnough = currentBalance >= estimatedCost;
  
  return c.json({
    success: true,
    hasEnough,
    required: estimatedCost,
    current: currentBalance,
    message: hasEnough 
      ? "You have enough coins for this call"
      : "Please purchase more coins to make this call",
  });
});

export { coinsRouter, COIN_PACKAGES, CALL_COSTS };
