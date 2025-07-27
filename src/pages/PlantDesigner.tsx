
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TreePine, Sun, Droplets, MapPin, Calendar, Lightbulb } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PlantDesigner = () => {
  const [designForm, setDesignForm] = useState({
    region: "",
    spaceType: "",
    spaceSize: "",
    lightCondition: "",
    timeAvailable: "",
    purpose: ""
  });

  const [recommendations, setRecommendations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateDesign = async () => {
    if (!designForm.region || !designForm.spaceType || !designForm.lightCondition) {
      alert("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

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
              text: `Create a personalized plant garden design for: Region=${designForm.region}, Space=${designForm.spaceType}, Size=${designForm.spaceSize}, Light=${designForm.lightCondition}, Time=${designForm.timeAvailable}, Purpose=${designForm.purpose}.
              
              Please provide recommendations as JSON with keys:
              - recommendedPlants (array with name, scientificName, co2Absorption, waterNeeds, lightRequirement, maintenance, seasonalTips)
              - gardenLayout (array of placement suggestions)
              - seasonalGuide (object with spring, summer, monsoon, winter activities)
              - careTips (array of maintenance tips)
              - waterSavingTips (array of water conservation methods)
              - localNurseries (array of suggested nursery types to visit)
              - expectedBenefits (object with co2Reduction, oxygenProduction, aestheticValue)`
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
          recommendedPlants: [
            {
              name: "Neem",
              scientificName: "Azadirachta indica",
              co2Absorption: "High (22kg/year)",
              waterNeeds: "Low to Medium",
              lightRequirement: "Full Sun",
              maintenance: "Low",
              seasonalTips: "Plant during monsoon, prune in winter"
            },
            {
              name: "Tulsi",
              scientificName: "Ocimum sanctum",
              co2Absorption: "Medium (5kg/year)",
              waterNeeds: "Medium",
              lightRequirement: "Partial Sun",
              maintenance: "Easy",
              seasonalTips: "Harvest leaves in morning, protect from frost"
            },
            {
              name: "Aloe Vera",
              scientificName: "Aloe barbadensis",
              co2Absorption: "Low (2kg/year)",
              waterNeeds: "Very Low",
              lightRequirement: "Bright Indirect",
              maintenance: "Very Easy",
              seasonalTips: "Water sparingly in winter, more in summer"
            }
          ],
          gardenLayout: [
            "Place tall plants like Neem on north side to avoid shading",
            "Keep herb garden near kitchen for easy access",
            "Create a seating area surrounded by fragrant plants",
            "Use vertical space with hanging planters"
          ],
          seasonalGuide: {
            spring: ["Plant new saplings", "Prepare soil", "Start herb garden"],
            summer: ["Increase watering", "Add mulch", "Harvest herbs"],
            monsoon: ["Plant trees", "Drainage management", "Pest control"],
            winter: ["Pruning", "Fertilizing", "Protection from frost"]
          },
          careTips: [
            "Water plants early morning or evening",
            "Use organic compost for fertilization",
            "Rotate crops in vegetable garden",
            "Regular pruning for healthy growth"
          ],
          waterSavingTips: [
            "Install drip irrigation system",
            "Use mulch to retain moisture",
            "Collect rainwater for plants",
            "Group plants by water needs"
          ],
          localNurseries: [
            "Visit local organic nurseries",
            "Check government nurseries for native plants",
            "Join plant swapping communities",
            "Contact agricultural extension offices"
          ],
          expectedBenefits: {
            co2Reduction: "50-100 kg CO2/year",
            oxygenProduction: "Daily oxygen for 2-4 people",
            aestheticValue: "Improved property value and ambiance"
          }
        });
      }
    } catch (error) {
      console.error('Error generating design:', error);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                AI Plant & Garden Designer
              </h1>
              <p className="text-lg text-gray-600">
                Get personalized plant recommendations based on your local conditions and preferences
              </p>
            </div>

            {/* Design Form */}
            <Card className="p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6">Garden Design Preferences</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="region" className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4" />
                    Region/City
                  </Label>
                  <Input
                    id="region"
                    value={designForm.region}
                    onChange={(e) => setDesignForm({...designForm, region: e.target.value})}
                    placeholder="e.g., Hyderabad, Telangana"
                  />
                </div>

                <div>
                  <Label htmlFor="spaceType">Space Type</Label>
                  <Select value={designForm.spaceType} onValueChange={(value) => setDesignForm({...designForm, spaceType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select space type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balcony">Balcony</SelectItem>
                      <SelectItem value="terrace">Terrace</SelectItem>
                      <SelectItem value="backyard">Backyard</SelectItem>
                      <SelectItem value="frontyard">Front Yard</SelectItem>
                      <SelectItem value="indoor">Indoor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="spaceSize">Space Size</Label>
                  <Select value={designForm.spaceSize} onValueChange={(value) => setDesignForm({...designForm, spaceSize: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (< 50 sq ft)</SelectItem>
                      <SelectItem value="medium">Medium (50-200 sq ft)</SelectItem>
                      <SelectItem value="large">Large (> 200 sq ft)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="lightCondition" className="flex items-center gap-2 mb-2">
                    <Sun className="w-4 h-4" />
                    Light Condition
                  </Label>
                  <Select value={designForm.lightCondition} onValueChange={(value) => setDesignForm({...designForm, lightCondition: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select light condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-sun">Full Sun (6+ hours)</SelectItem>
                      <SelectItem value="partial-sun">Partial Sun (3-6 hours)</SelectItem>
                      <SelectItem value="shade">Shade (< 3 hours)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timeAvailable">Time Available for Maintenance</Label>
                  <Select value={designForm.timeAvailable} onValueChange={(value) => setDesignForm({...designForm, timeAvailable: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimal">Minimal (< 30 min/week)</SelectItem>
                      <SelectItem value="moderate">Moderate (30-60 min/week)</SelectItem>
                      <SelectItem value="extensive">Extensive (> 60 min/week)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="purpose">Primary Purpose</Label>
                  <Select value={designForm.purpose} onValueChange={(value) => setDesignForm({...designForm, purpose: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="air-purification">Air Purification</SelectItem>
                      <SelectItem value="food-production">Food Production</SelectItem>
                      <SelectItem value="aesthetic">Aesthetic Beauty</SelectItem>
                      <SelectItem value="medicinal">Medicinal Plants</SelectItem>
                      <SelectItem value="mixed">Mixed Purpose</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleGenerateDesign}
                disabled={isLoading}
                className="w-full mt-6 bg-green-600 hover:bg-green-700"
              >
                {isLoading ? "Generating Design..." : "Generate AI Garden Design"}
              </Button>
            </Card>

            {/* Recommendations */}
            {recommendations && (
              <div className="space-y-8">
                {/* Recommended Plants */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <TreePine className="w-6 h-6 text-green-600" />
                    Recommended Plants
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendations.recommendedPlants?.map((plant: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-green-800">{plant.name}</h4>
                          <Badge variant="outline">{plant.maintenance}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 italic mb-2">{plant.scientificName}</p>
                        <div className="space-y-1 text-sm">
                          <p><strong>CO₂ Absorption:</strong> {plant.co2Absorption}</p>
                          <p><strong>Water Needs:</strong> {plant.waterNeeds}</p>
                          <p><strong>Light:</strong> {plant.lightRequirement}</p>
                          <p className="text-green-600"><strong>Tip:</strong> {plant.seasonalTips}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Garden Layout & Seasonal Guide */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Garden Layout Suggestions</h3>
                    <ul className="space-y-2">
                      {recommendations.gardenLayout?.map((suggestion: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                          <span className="text-sm">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      Seasonal Planting Guide
                    </h3>
                    <div className="space-y-4">
                      {recommendations.seasonalGuide && Object.entries(recommendations.seasonalGuide).map(([season, activities]: [string, any]) => (
                        <div key={season} className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-semibold capitalize text-blue-800">{season}</h4>
                          <ul className="text-sm space-y-1">
                            {activities.map((activity: string, index: number) => (
                              <li key={index}>• {activity}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Care Tips & Water Saving */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Care Tips</h3>
                    <ul className="space-y-2">
                      {recommendations.careTips?.map((tip: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Droplets className="w-5 h-5 text-blue-600" />
                      Water Saving Tips
                    </h3>
                    <ul className="space-y-2">
                      {recommendations.waterSavingTips?.map((tip: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>

                {/* Expected Benefits */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Expected Benefits</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center bg-green-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-600">
                        {recommendations.expectedBenefits?.co2Reduction}
                      </div>
                      <div className="text-sm text-gray-600">CO₂ Reduction</div>
                    </div>
                    <div className="text-center bg-blue-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-600">
                        {recommendations.expectedBenefits?.oxygenProduction}
                      </div>
                      <div className="text-sm text-gray-600">Oxygen Production</div>
                    </div>
                    <div className="text-center bg-purple-50 rounded-lg p-4">
                      <div className="text-sm font-semibold text-purple-600">
                        {recommendations.expectedBenefits?.aestheticValue}
                      </div>
                      <div className="text-sm text-gray-600">Additional Benefits</div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PlantDesigner;
