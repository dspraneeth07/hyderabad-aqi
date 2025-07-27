
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Car, Zap, UtensilsCrossed, Home, Leaf, TrendingDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CarbonTracker = () => {
  const [formData, setFormData] = useState({
    transport: "",
    dailyCommute: "",
    electricity: "",
    diet: "",
    homeSize: "",
    flights: ""
  });
  
  const [carbonFootprint, setCarbonFootprint] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Calculate carbon footprint
    const transportEmission = getTransportEmission(formData.transport, parseInt(formData.dailyCommute) || 0);
    const electricityEmission = parseInt(formData.electricity) * 0.5 || 0; // kg CO2 per kWh
    const dietEmission = getDietEmission(formData.diet);
    const homeEmission = getHomeEmission(formData.homeSize);
    const flightEmission = parseInt(formData.flights) * 0.25 || 0; // kg CO2 per km

    const totalFootprint = transportEmission + electricityEmission + dietEmission + homeEmission + flightEmission;
    setCarbonFootprint(totalFootprint);

    // Get AI recommendations
    try {
      const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': 'AIzaSyDolkqsnwcFdx9lJ8WPZZezC7t7wnCLfFI'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Based on carbon footprint data: Total=${totalFootprint.toFixed(2)}kg CO2/day, Transport=${formData.transport}, Diet=${formData.diet}, Electricity=${formData.electricity}kWh, Home=${formData.homeSize}, Flights=${formData.flights}km/year.
              
              Please provide personalized recommendations as JSON with keys:
              - suggestions (array of specific actionable recommendations)
              - alternativeTransport (array of transport alternatives)
              - energySaving (array of energy-saving tips)
              - dietChanges (array of diet modifications)
              - greenScore (number 0-100 based on current habits)
              - challenges (array of weekly challenges to improve footprint)`
            }]
          }]
        })
      });

      const result = await geminiResponse.json();
      const content = result.candidates[0].content.parts[0].text;
      
      try {
        const parsedData = JSON.parse(content);
        setRecommendations(parsedData);
      } catch (error) {
        // Fallback recommendations
        setRecommendations({
          suggestions: [
            "Switch to public transport or cycling for daily commute",
            "Reduce meat consumption by 2 days per week",
            "Use LED bulbs and energy-efficient appliances",
            "Work from home 2-3 days per week if possible"
          ],
          alternativeTransport: [
            "Electric scooter for short distances",
            "Public bus or metro for longer commutes",
            "Carpooling with colleagues",
            "Bicycle for distances under 5km"
          ],
          energySaving: [
            "Unplug electronics when not in use",
            "Use natural light during day",
            "Set AC temperature to 24°C",
            "Install solar panels if possible"
          ],
          dietChanges: [
            "Try plant-based meals 3 times per week",
            "Buy local and seasonal produce",
            "Reduce food waste by meal planning",
            "Choose organic options when available"
          ],
          greenScore: Math.max(100 - Math.round(totalFootprint * 2), 0),
          challenges: [
            "Week 1: Use public transport for 3 days",
            "Week 2: Try 2 plant-based meals",
            "Week 3: Reduce electricity usage by 10%",
            "Week 4: Walk or cycle for one daily trip"
          ]
        });
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
    }

    setIsLoading(false);
  };

  const getTransportEmission = (transport: string, distance: number) => {
    const emissions = {
      car: 0.21,
      bike: 0.05,
      bus: 0.08,
      metro: 0.04,
      walk: 0
    };
    return (emissions[transport as keyof typeof emissions] || 0.21) * distance;
  };

  const getDietEmission = (diet: string) => {
    const emissions = {
      vegetarian: 2.5,
      vegan: 1.5,
      omnivore: 4.0,
      pescatarian: 3.0
    };
    return emissions[diet as keyof typeof emissions] || 4.0;
  };

  const getHomeEmission = (homeSize: string) => {
    const emissions = {
      small: 3.0,
      medium: 5.0,
      large: 8.0
    };
    return emissions[homeSize as keyof typeof emissions] || 5.0;
  };

  const getFootprintColor = (footprint: number) => {
    if (footprint < 10) return "text-green-600";
    if (footprint < 20) return "text-yellow-600";
    if (footprint < 30) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Carbon Footprint Tracker & Lifestyle Optimizer
              </h1>
              <p className="text-lg text-gray-600">
                Calculate your daily carbon footprint and get personalized eco-friendly suggestions
              </p>
            </div>

            {/* Carbon Footprint Form */}
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6">Daily Habits Assessment</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="transport" className="flex items-center gap-2 mb-2">
                      <Car className="w-4 h-4" />
                      Primary Transport Mode
                    </Label>
                    <Select value={formData.transport} onValueChange={(value) => setFormData({...formData, transport: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transport" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="bike">Motorcycle</SelectItem>
                        <SelectItem value="bus">Bus</SelectItem>
                        <SelectItem value="metro">Metro/Train</SelectItem>
                        <SelectItem value="walk">Walk/Cycle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="dailyCommute">Daily Commute Distance (km)</Label>
                    <Input
                      id="dailyCommute"
                      type="number"
                      value={formData.dailyCommute}
                      onChange={(e) => setFormData({...formData, dailyCommute: e.target.value})}
                      placeholder="Enter daily distance"
                    />
                  </div>

                  <div>
                    <Label htmlFor="electricity" className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4" />
                      Daily Electricity Usage (kWh)
                    </Label>
                    <Input
                      id="electricity"
                      type="number"
                      value={formData.electricity}
                      onChange={(e) => setFormData({...formData, electricity: e.target.value})}
                      placeholder="Average daily consumption"
                    />
                  </div>

                  <div>
                    <Label htmlFor="diet" className="flex items-center gap-2 mb-2">
                      <UtensilsCrossed className="w-4 h-4" />
                      Diet Type
                    </Label>
                    <Select value={formData.diet} onValueChange={(value) => setFormData({...formData, diet: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select diet" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vegan">Vegan</SelectItem>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="pescatarian">Pescatarian</SelectItem>
                        <SelectItem value="omnivore">Omnivore</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="homeSize" className="flex items-center gap-2 mb-2">
                      <Home className="w-4 h-4" />
                      Home Size
                    </Label>
                    <Select value={formData.homeSize} onValueChange={(value) => setFormData({...formData, homeSize: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select home size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small (1-2 BHK)</SelectItem>
                        <SelectItem value="medium">Medium (3-4 BHK)</SelectItem>
                        <SelectItem value="large">Large (5+ BHK)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="flights">Annual Flight Distance (km)</Label>
                    <Input
                      id="flights"
                      type="number"
                      value={formData.flights}
                      onChange={(e) => setFormData({...formData, flights: e.target.value})}
                      placeholder="Yearly air travel"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? "Calculating..." : "Calculate Carbon Footprint"}
                </Button>
              </form>
            </Card>

            {/* Results */}
            {carbonFootprint !== null && (
              <div className="space-y-6">
                {/* Carbon Footprint Result */}
                <Card className="p-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold mb-4">Your Daily Carbon Footprint</h3>
                    <div className={`text-6xl font-bold mb-2 ${getFootprintColor(carbonFootprint)}`}>
                      {carbonFootprint.toFixed(1)}
                    </div>
                    <p className="text-lg text-gray-600">kg CO₂ per day</p>
                    {recommendations && (
                      <div className="mt-4">
                        <Badge className="bg-green-600 text-white text-lg px-4 py-2">
                          Green Score: {recommendations.greenScore}/100
                        </Badge>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Recommendations */}
                {recommendations && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <TrendingDown className="w-5 h-5 text-green-600" />
                        Personalized Suggestions
                      </h4>
                      <ul className="space-y-2">
                        {recommendations.suggestions?.map((suggestion: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <Leaf className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                            <span className="text-sm">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>

                    <Card className="p-6">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Car className="w-5 h-5 text-blue-600" />
                        Transport Alternatives
                      </h4>
                      <ul className="space-y-2">
                        {recommendations.alternativeTransport?.map((alt: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm">{alt}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>

                    <Card className="p-6">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-600" />
                        Energy Saving Tips
                      </h4>
                      <ul className="space-y-2">
                        {recommendations.energySaving?.map((tip: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>

                    <Card className="p-6">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <UtensilsCrossed className="w-5 h-5 text-orange-600" />
                        Diet Modifications
                      </h4>
                      <ul className="space-y-2">
                        {recommendations.dietChanges?.map((change: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm">{change}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </div>
                )}

                {/* Weekly Challenges */}
                {recommendations?.challenges && (
                  <Card className="p-6">
                    <h4 className="font-semibold mb-4">Weekly Green Challenges</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recommendations.challenges.map((challenge: string, index: number) => (
                        <div key={index} className="bg-green-50 rounded-lg p-4">
                          <p className="text-sm font-medium">{challenge}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CarbonTracker;
