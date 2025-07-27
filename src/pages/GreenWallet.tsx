
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Wallet, Award, Users, TreePine, Recycle, Car, Zap, Gift, Blocks, Shield, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BlockchainVisualizer } from "@/components/BlockchainVisualizer";
import { ParticleBackground } from "@/components/ParticleBackground";
import { ecoBlockchain, Transaction, Block } from "@/utils/blockchain";

const GreenWallet = () => {
  const [userAddress] = useState("0x742d35Cc6634C0532925a3b8D6aBC4c2b5C7FDec");
  const [ecoPoints, setEcoPoints] = useState(0);
  const [userLevel, setUserLevel] = useState("Eco Warrior");
  const [weeklyGoal] = useState(200);
  const [currentWeekPoints, setCurrentWeekPoints] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [blockchainInfo, setBlockchainInfo] = useState<any>(null);

  const [leaderboard] = useState([
    { rank: 1, name: "EcoHero2024", points: 2450, level: "Planet Protector", address: "0x123...abc" },
    { rank: 2, name: "GreenGuardian", points: 2100, level: "Eco Champion", address: "0x456...def" },
    { rank: 3, name: "NatureNinja", points: 1890, level: "Eco Warrior", address: "0x789...ghi" },
    { rank: 4, name: "You", points: ecoPoints, level: userLevel, address: userAddress },
    { rank: 5, name: "TreeHugger", points: 1100, level: "Green Enthusiast", address: "0x321...jkl" }
  ]);

  const ecoActions = [
    { type: "Plant Tree", points: 50, icon: TreePine, description: "Plant a tree and upload verification", color: "from-green-500 to-emerald-600" },
    { type: "Recycle Waste", points: 25, icon: Recycle, description: "Properly sort and recycle waste", color: "from-blue-500 to-cyan-600" },
    { type: "Public Transport", points: 15, icon: Car, description: "Use public transport instead of private vehicle", color: "from-purple-500 to-violet-600" },
    { type: "Solar Usage", points: 30, icon: Zap, description: "Use solar energy for daily needs", color: "from-yellow-500 to-orange-600" },
    { type: "Eco Purchase", points: 20, icon: Gift, description: "Buy eco-friendly products", color: "from-pink-500 to-rose-600" }
  ];

  const rewards = [
    { name: "Tree Sapling", cost: 100, available: true, description: "Real tree sapling delivered to your location" },
    { name: "Eco-friendly Bag", cost: 200, available: true, description: "Biodegradable shopping bag" },
    { name: "Solar Power Bank", cost: 500, available: true, description: "Portable solar charging device" },
    { name: "Organic Seeds Pack", cost: 150, available: true, description: "Variety of organic vegetable seeds" },
    { name: "Green Certificate", cost: 1000, available: true, description: "Official environmental impact certificate" }
  ];

  useEffect(() => {
    // Initialize blockchain data
    const initializeBlockchain = () => {
      const balance = ecoBlockchain.getBalance(userAddress);
      const allTransactions = ecoBlockchain.getAllTransactions();
      const info = ecoBlockchain.getBlockchainInfo();
      
      setEcoPoints(balance);
      setTransactions(allTransactions.slice(-10)); // Show last 10 transactions
      setBlocks(info.isValid ? ecoBlockchain['chain'] : []);
      setBlockchainInfo(info);
      setCurrentWeekPoints(balance % 200); // Mock weekly progress
    };

    initializeBlockchain();
  }, [userAddress]);

  const handleSubmitAction = async (action: any) => {
    setIsLoading(true);
    
    try {
      // Create a new transaction on the blockchain
      const transaction = ecoBlockchain.createTransaction({
        from: 'system',
        to: userAddress,
        amount: action.points,
        type: 'EARN',
        action: action.type
      });

      // Mine the pending transactions
      const newBlock = ecoBlockchain.minePendingTransactions(userAddress);
      
      // Update local state
      const newBalance = ecoBlockchain.getBalance(userAddress);
      const allTransactions = ecoBlockchain.getAllTransactions();
      const info = ecoBlockchain.getBlockchainInfo();
      
      setEcoPoints(newBalance);
      setTransactions(allTransactions.slice(-10));
      setBlocks(info.isValid ? ecoBlockchain['chain'] : []);
      setBlockchainInfo(info);
      setCurrentWeekPoints(prev => prev + action.points);
      
      console.log('Transaction completed:', transaction);
      console.log('New block mined:', newBlock);
      
    } catch (error) {
      console.error('Transaction failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedeemReward = async (reward: any) => {
    if (ecoPoints < reward.cost) return;
    
    setIsLoading(true);
    
    try {
      // Create a spending transaction
      const transaction = ecoBlockchain.createTransaction({
        from: userAddress,
        to: 'rewards-system',
        amount: reward.cost,
        type: 'SPEND',
        action: `Redeemed: ${reward.name}`
      });

      // Mine the pending transactions
      const newBlock = ecoBlockchain.minePendingTransactions(userAddress);
      
      // Update local state
      const newBalance = ecoBlockchain.getBalance(userAddress);
      const allTransactions = ecoBlockchain.getAllTransactions();
      const info = ecoBlockchain.getBlockchainInfo();
      
      setEcoPoints(newBalance);
      setTransactions(allTransactions.slice(-10));
      setBlocks(info.isValid ? ecoBlockchain['chain'] : []);
      setBlockchainInfo(info);
      
      console.log('Reward redeemed:', transaction);
      console.log('New block mined:', newBlock);
      
    } catch (error) {
      console.error('Redemption failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const progressPercentage = Math.min((currentWeekPoints / weeklyGoal) * 100, 100);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <ParticleBackground />
      <Header />
      
      <main className="flex-grow pt-20 relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
                EcoChain Wallet
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Earn, verify, and redeem EcoPoints on a real blockchain ecosystem for climate-positive actions
              </p>
            </div>

            {/* Blockchain Visualizer */}
            <Card className="mb-8 bg-gray-900/50 border-gray-700 backdrop-blur-sm">
              <div className="p-6">
                <h3 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
                  <Blocks className="w-6 h-6 text-blue-400" />
                  Live Blockchain Network
                </h3>
                <BlockchainVisualizer blocks={blocks} className="rounded-lg bg-gray-800/30" />
                {blockchainInfo && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">{blockchainInfo.totalBlocks}</div>
                      <div className="text-gray-400">Total Blocks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{blockchainInfo.totalTransactions}</div>
                      <div className="text-gray-400">Transactions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">{blockchainInfo.difficulty}</div>
                      <div className="text-gray-400">Difficulty</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-400">
                        {blockchainInfo.isValid ? 'Valid' : 'Invalid'}
                      </div>
                      <div className="text-gray-400">Chain Status</div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Wallet Overview */}
            <Card className="p-8 mb-8 bg-gradient-to-r from-green-600/90 to-emerald-700/90 text-white backdrop-blur-sm border-green-500/30">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <Wallet className="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
                  <div className="text-4xl font-bold mb-2">{ecoPoints}</div>
                  <div className="text-sm opacity-90">EcoPoints Balance</div>
                  <div className="text-xs opacity-75 mt-1 font-mono">
                    {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                  </div>
                </div>
                <div className="text-center">
                  <Award className="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
                  <div className="text-2xl font-semibold mb-2">{userLevel}</div>
                  <div className="text-sm opacity-90">Current Level</div>
                  <Badge className="mt-2 bg-white/20 text-white">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>
                <div className="text-center">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
                  <div className="text-2xl font-semibold mb-2">{currentWeekPoints}/{weeklyGoal}</div>
                  <div className="text-sm opacity-90 mb-2">Weekly Goal</div>
                  <Progress value={progressPercentage} className="bg-white/20" />
                </div>
                <div className="text-center">
                  <Blocks className="w-16 h-16 mx-auto mb-4 drop-shadow-lg" />
                  <div className="text-2xl font-semibold mb-2">{blocks.length}</div>
                  <div className="text-sm opacity-90">Blocks Mined</div>
                  <div className="text-xs opacity-75 mt-1">
                    Chain Status: {blockchainInfo?.isValid ? 'Valid' : 'Invalid'}
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Eco Actions */}
              <div className="lg:col-span-2">
                <Card className="p-6 mb-6 bg-gray-900/50 border-gray-700 backdrop-blur-sm">
                  <h3 className="text-2xl font-semibold mb-6 text-white">Earn EcoPoints</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ecoActions.map((action) => (
                      <div key={action.type} className={`bg-gradient-to-r ${action.color} rounded-xl p-6 text-white transform hover:scale-105 transition-all duration-300 hover:shadow-2xl`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <action.icon className="w-8 h-8 drop-shadow-lg" />
                            <h4 className="font-semibold text-lg">{action.type}</h4>
                          </div>
                          <Badge className="bg-white/20 text-white text-lg px-3 py-1">
                            +{action.points}
                          </Badge>
                        </div>
                        <p className="text-sm mb-4 opacity-90">{action.description}</p>
                        <Button 
                          onClick={() => handleSubmitAction(action)}
                          disabled={isLoading}
                          className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
                        >
                          {isLoading ? "Processing..." : "Submit & Mine Block"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Transaction History */}
                <Card className="p-6 bg-gray-900/50 border-gray-700 backdrop-blur-sm">
                  <h3 className="text-2xl font-semibold mb-6 text-white">Blockchain Transactions</h3>
                  <div className="space-y-4">
                    {transactions.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        No transactions yet. Start earning EcoPoints to see your blockchain history!
                      </div>
                    ) : (
                      transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                          <div className="flex-1">
                            <div className="font-medium text-white">{transaction.action}</div>
                            <div className="text-sm text-gray-400">
                              {new Date(transaction.timestamp).toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500 font-mono mt-1">
                              Hash: {transaction.hash.slice(0, 16)}...
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-semibold ${transaction.type === 'EARN' ? 'text-green-400' : 'text-red-400'}`}>
                              {transaction.type === 'EARN' ? '+' : '-'}{transaction.amount}
                            </div>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {transaction.type}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Leaderboard */}
                <Card className="p-6 bg-gray-900/50 border-gray-700 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                    <Users className="w-5 h-5" />
                    Global Leaderboard
                  </h3>
                  <div className="space-y-3">
                    {leaderboard.map((user) => (
                      <div key={user.rank} className={`flex items-center justify-between p-3 rounded-lg ${user.name === 'You' ? 'bg-green-500/20 border border-green-500/50' : 'bg-gray-800/50'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${user.rank <= 3 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : 'bg-gray-600 text-white'}`}>
                            {user.rank}
                          </div>
                          <div>
                            <div className="font-medium text-white">{user.name}</div>
                            <div className="text-xs text-gray-400">{user.level}</div>
                            <div className="text-xs text-gray-500 font-mono">
                              {user.address.slice(0, 6)}...{user.address.slice(-4)}
                            </div>
                          </div>
                        </div>
                        <div className="text-green-400 font-semibold">{user.points}</div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Rewards Store */}
                <Card className="p-6 bg-gray-900/50 border-gray-700 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-4 text-white">Rewards Store</h3>
                  <div className="space-y-4">
                    {rewards.map((reward) => (
                      <div key={reward.name} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-white">{reward.name}</h4>
                          <Badge variant="outline" className="text-green-400 border-green-400">
                            {reward.cost} ECP
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">{reward.description}</p>
                        <Button 
                          onClick={() => handleRedeemReward(reward)}
                          disabled={ecoPoints < reward.cost || isLoading}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 disabled:opacity-50"
                        >
                          {ecoPoints >= reward.cost ? 'Redeem' : 'Insufficient EcoPoints'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GreenWallet;
