
import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, MapPin, Recycle, Leaf, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const WasteScan = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScanWaste = async () => {
    if (!selectedImage) return;

    setIsLoading(true);

    try {
      // Convert image to base64 for Gemini API
      const base64Image = selectedImage.split(',')[1];

      const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': 'AIzaSyDolkqsnwcFdx9lJ8WPZZezC7t7wnCLfFI'
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: "Analyze this waste image and classify it. Provide detailed recycling information as JSON with keys: category (recyclable/compostable/e-waste/hazardous/landfill), itemName, recyclingInstructions, localDisposal, composingTips, environmental_impact, alternatives"
              },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Image
                }
              }
            ]
          }]
        })
      });

      const result = await geminiResponse.json();
      const content = result.candidates[0].content.parts[0].text;
      
      try {
        const parsedData = JSON.parse(content);
        setScanResult(parsedData);
      } catch (error) {
        // Fallback result if parsing fails
        setScanResult({
          category: "recyclable",
          itemName: "Mixed Waste",
          recyclingInstructions: "Clean the item and separate materials before recycling",
          localDisposal: "Take to nearest municipal waste center",
          composingTips: "If organic, add to compost bin with proper aeration",
          environmental_impact: "Proper disposal reduces landfill burden",
          alternatives: "Consider reusable alternatives for future use"
        });
      }
    } catch (error) {
      console.error('Error scanning waste:', error);
    }

    setIsLoading(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'recyclable': return 'bg-green-500';
      case 'compostable': return 'bg-yellow-500';
      case 'e-waste': return 'bg-blue-500';
      case 'hazardous': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'recyclable': return Recycle;
      case 'compostable': return Leaf;
      case 'e-waste': return AlertCircle;
      case 'hazardous': return AlertCircle;
      default: return AlertCircle;
    }
  };

  const recyclingCenters = [
    { name: "Hyderabad Municipal Corporation", type: "General Waste", address: "GHMC Head Office, Khairatabad" },
    { name: "E-Waste Collection Center", type: "Electronic Waste", address: "Hi-Tech City, Madhapur" },
    { name: "Organic Waste Composting", type: "Compostable", address: "Miyapur, Hyderabad" },
    { name: "Hazardous Waste Facility", type: "Hazardous", address: "IDA Bollaram, Hyderabad" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                WasteScan AI - Waste Sorting & Recyclability
              </h1>
              <p className="text-lg text-gray-600">
                Upload images of waste items to get AI-powered sorting and recycling guidance
              </p>
            </div>

            {/* Upload Section */}
            <Card className="p-6 mb-8">
              <div className="text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                  className="hidden"
                />
                
                {!selectedImage ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 mb-4">Upload an image of your waste item</p>
                    <Button onClick={() => fileInputRef.current?.click()}>
                      Choose Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <img src={selectedImage} alt="Uploaded waste" className="max-w-md mx-auto rounded-lg shadow-md" />
                    <div className="flex gap-4 justify-center">
                      <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                        Change Image
                      </Button>
                      <Button onClick={handleScanWaste} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                        {isLoading ? "Scanning..." : "Scan Waste"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Scan Results */}
            {scanResult && (
              <div className="space-y-6">
                {/* Classification Result */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Classification Result</h3>
                    <Badge className={`${getCategoryColor(scanResult.category)} text-white`}>
                      {scanResult.category.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Item Identified</h4>
                      <p className="text-gray-700">{scanResult.itemName}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Environmental Impact</h4>
                      <p className="text-gray-700">{scanResult.environmental_impact}</p>
                    </div>
                  </div>
                </Card>

                {/* Detailed Instructions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Recycle className="w-5 h-5 text-green-600" />
                      Recycling Instructions
                    </h3>
                    <p className="text-gray-700 mb-4">{scanResult.recyclingInstructions}</p>
                    
                    {scanResult.composingTips && (
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2 text-yellow-800">Composting Tips</h4>
                        <p className="text-sm text-yellow-700">{scanResult.composingTips}</p>
                      </div>
                    )}
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      Local Disposal Options
                    </h3>
                    <p className="text-gray-700 mb-4">{scanResult.localDisposal}</p>
                    
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 text-blue-800">Eco-Friendly Alternatives</h4>
                      <p className="text-sm text-blue-700">{scanResult.alternatives}</p>
                    </div>
                  </Card>
                </div>

                {/* Local Recycling Centers */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Local Recycling Centers</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recyclingCenters.map((center, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h4 className="font-semibold text-green-800">{center.name}</h4>
                        <Badge variant="outline" className="mb-2">{center.type}</Badge>
                        <p className="text-sm text-gray-600">{center.address}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* QR Code Generator */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Waste Bin Labels</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="w-16 h-16 bg-green-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <Recycle className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-sm font-medium">Recyclable</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="w-16 h-16 bg-yellow-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <Leaf className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-sm font-medium">Compostable</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="w-16 h-16 bg-blue-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-sm font-medium">E-Waste</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 bg-gray-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-sm font-medium">Landfill</p>
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

export default WasteScan;
