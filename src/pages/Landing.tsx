
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Leaf, Brain, Wallet, Camera, TreePine, BarChart3, MapPin, Recycle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: "aqi-insights",
      title: "Air Quality Insights + AI CO₂ Offset",
      description: "Real-time AQI monitoring with AI-powered plant recommendations for pollution reduction",
      icon: BarChart3,
      color: "from-blue-500 to-blue-700",
      route: "/aqi-insights"
    },
    {
      id: "carbon-tracker",
      title: "Carbon Footprint Tracker",
      description: "Track your daily habits and get personalized eco-friendly suggestions",
      icon: Leaf,
      color: "from-green-500 to-green-700",
      route: "/carbon-tracker"
    },
    {
      id: "green-wallet",
      title: "Green Wallet (Blockchain)",
      description: "Earn EcoPoints for climate-positive actions with blockchain verification",
      icon: Wallet,
      color: "from-purple-500 to-purple-700",
      route: "/green-wallet"
    },
    {
      id: "plant-designer",
      title: "AI Plant & Garden Designer",
      description: "Get AI recommendations for plants based on your local conditions",
      icon: TreePine,
      color: "from-emerald-500 to-emerald-700",
      route: "/plant-designer"
    },
    {
      id: "waste-scan",
      title: "WasteScan AI",
      description: "Upload waste images to get AI-powered sorting and recycling guidance",
      icon: Camera,
      color: "from-orange-500 to-orange-700",
      route: "/waste-scan"
    },
    {
      id: "live-aqi",
      title: "Live AQI Updates",
      description: "Real-time air quality monitoring from multiple stations",
      icon: MapPin,
      color: "from-indigo-500 to-indigo-700",
      route: "/live-aqi"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-green-50 to-blue-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                EcoSphere
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8">
                Your Complete AI-Powered Environmental Platform
              </p>
              <p className="text-lg text-gray-500 mb-12">
                Monitor air quality, track carbon footprint, earn eco-points, and get personalized environmental insights
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate("/live-aqi")}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                >
                  Start Monitoring
                </Button>
                <Button
                  onClick={() => navigate("/carbon-tracker")}
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 text-lg"
                >
                  Track Footprint
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Environmental Solutions
            </h2>
            <p className="text-lg text-gray-600">
              Powered by AI and real-time data to help you make a positive environmental impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.id}
                className={`p-6 bg-gradient-to-br ${feature.color} text-white transform hover:scale-105 transition-all duration-300 hover:shadow-xl cursor-pointer`}
                onClick={() => navigate(feature.route)}
              >
                <div className="flex items-center mb-4">
                  <feature.icon className="w-8 h-8 mr-3" />
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-sm opacity-90 mb-4">{feature.description}</p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  Explore Feature
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">15+</div>
                <div className="text-gray-600">Monitoring Stations</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">5</div>
                <div className="text-gray-600">AI Models</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">100+</div>
                <div className="text-gray-600">Plant Species</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                <div className="text-gray-600">Real-time Updates</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
