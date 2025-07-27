
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Wallet, Award, Users, TreePine, Recycle, Car, Zap, Gift } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const GreenWallet = () => {
  const [ecoPoints, setEcoPoints] = useState(1250);
  const [userLevel, setUserLevel] = useState("Eco Warrior");
  const [weeklyGoal, setWeeklyGoal] = useState(200);
  const [currentWeekPoints, setCurrentWeekPoints] = useState(130);

  const [transactions, setTransactions] = useState([
    { id: 1, type: "Plant Tree", points: 50, date: "2024-01-15", verified: true },
    { id: 2, type: "Recycle Waste", points: 25, date: "2024-01-14", verified: true },
    { id: 3, type: "Public Transport", points: 15, date: "2024-01-14", verified: false },
    { id: 4, type: "Solar Usage", points: 30, date: "2024-01-13", verified: true },
    { id: 5, type: "Eco Purchase", points: 20, date: "2024-01-12", verified: true }
  ]);

  const [leaderboard, setLeaderboard] = useState([
    { rank: 1, name: "EcoHero2024", points: 2450, level: "Planet Protector" },
    { rank: 2, name: "GreenGuardian", points: 2100, level: "Eco Champion" },
    { rank: 3, name: "NatureNinja", points: 1890, level: "Eco Warrior" },
    { rank: 4, name: "You", points: 1250, level: "Eco Warrior" },
    { rank: 5, name: "TreeHugger", points: 1100, level: "Green Enthusiast" }
  ]);

  const [actionForm, setActionForm] = useState({
    type: "",
    description: "",
    proof: ""
  });

  const ecoActions = [
    { type: "Plant Tree", points: 50, icon: TreePine, description: "Plant a tree and upload photo" },
    { type: "Recycle Waste", points: 25, icon: Recycle, description: "Properly sort and recycle waste" },
    { type: "Public Transport", points: 15, icon: Car, description: "Use public transport instead of private vehicle" },
    { type: "Solar Usage", points: 30, icon: Zap, description: "Use solar energy for daily needs" },
    { type: "Eco Purchase", points: 20, icon: Gift, description: "Buy eco-friendly products" }
  ];

  const rewards = [
    { name: "Tree Sapling", cost: 100, available: true },
    { name: "Eco-friendly Bag", cost: 200, available: true },
    { name: "Solar Power Bank", cost: 500, available: true },
    { name: "Organic Seeds Pack", cost: 150, available: true },
    { name: "Green Certificate", cost: 1000, available: true }
  ];

  const handleSubmitAction = (action: any) => {
    const newTransaction = {
      id: transactions.length + 1,
      type: action.type,
      points: action.points,
      date: new Date().toISOString().split('T')[0],
      verified: false
    };
    
    setTransactions([newTransaction, ...transactions]);
    setEcoPoints(prev => prev + action.points);
    setCurrentWeekPoints(prev => prev + action.points);
  };

  const progressPercentage = (currentWeekPoints / weeklyGoal) * 100;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Green Wallet - Blockchain EcoPoints
              </h1>
              <p className="text-lg text-gray-600">
                Earn, verify, and redeem EcoPoints for climate-positive actions
              </p>
            </div>

            {/* Wallet Overview */}
            <Card className="p-6 mb-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Wallet className="w-12 h-12 mx-auto mb-2" />
                  <div className="text-3xl font-bold">{ecoPoints}</div>
                  <div className="text-sm opacity-90">Total EcoPoints</div>
                </div>
                <div className="text-center">
                  <Award className="w-12 h-12 mx-auto mb-2" />
                  <div className="text-xl font-semibold">{userLevel}</div>
                  <div className="text-sm opacity-90">Current Level</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-semibold">{currentWeekPoints}/{weeklyGoal}</div>
                  <div className="text-sm opacity-90 mb-2">Weekly Goal</div>
                  <Progress value={progressPercentage} className="bg-white/20" />
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Eco Actions */}
              <div className="lg:col-span-2">
                <Card className="p-6 mb-6">
                  <h3 className="text-xl font-semibold mb-4">Earn EcoPoints</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ecoActions.map((action) => (
                      <div key={action.type} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <action.icon className="w-5 h-5 text-green-600" />
                            <h4 className="font-medium">{action.type}</h4>
                          </div>
                          <Badge className="bg-green-600 text-white">+{action.points}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                        <Button 
                          size="sm" 
                          onClick={() => handleSubmitAction(action)}
                          className="w-full"
                        >
                          Submit Action
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Transaction History */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
                  <div className="space-y-3">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{transaction.type}</div>
                          <div className="text-sm text-gray-600">{transaction.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-600 font-semibold">+{transaction.points}</div>
                          <Badge variant={transaction.verified ? "default" : "secondary"}>
                            {transaction.verified ? "Verified" : "Pending"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Leaderboard */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Community Leaderboard
                  </h3>
                  <div className="space-y-3">
                    {leaderboard.map((user) => (
                      <div key={user.rank} className={`flex items-center justify-between p-2 rounded ${user.name === 'You' ? 'bg-green-50 border border-green-200' : ''}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${user.rank <= 3 ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}>
                            {user.rank}
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-gray-600">{user.level}</div>
                          </div>
                        </div>
                        <div className="text-green-600 font-semibold">{user.points}</div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Rewards Store */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Rewards Store</h3>
                  <div className="space-y-3">
                    {rewards.map((reward) => (
                      <div key={reward.name} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm">{reward.name}</h4>
                          <Badge variant="outline">{reward.cost} pts</Badge>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          disabled={ecoPoints < reward.cost}
                          className="w-full"
                        >
                          {ecoPoints >= reward.cost ? 'Redeem' : 'Insufficient Points'}
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
