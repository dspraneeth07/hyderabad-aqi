
import { Link } from "react-router-dom";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg z-50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <div className="absolute w-full h-full">
                <div className="w-full h-full bg-white rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-110 flex items-center justify-center">
                  <span className="text-blue-600 text-xl font-bold">E</span>
                </div>
              </div>
            </div>
            <Link to="/" className="text-xl font-bold text-white">
              EcoSphere
            </Link>
          </div>
          
          {/* Navigation Menu */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/" className="text-white hover:text-blue-200 transition-colors text-sm font-medium px-4 py-2">
                  Home
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-white hover:text-blue-200 transition-colors text-sm font-medium">
                  Features
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 md:w-[500px] lg:w-[600px] lg:grid-cols-2">
                    <Link to="/live-aqi" className="block p-3 space-y-1 rounded-md hover:bg-gray-50">
                      <div className="text-sm font-medium">Live AQI Updates</div>
                      <div className="text-xs text-gray-600">Real-time air quality monitoring</div>
                    </Link>
                    <Link to="/aqi-insights" className="block p-3 space-y-1 rounded-md hover:bg-gray-50">
                      <div className="text-sm font-medium">AQI Insights</div>
                      <div className="text-xs text-gray-600">AI-powered plant recommendations</div>
                    </Link>
                    <Link to="/carbon-tracker" className="block p-3 space-y-1 rounded-md hover:bg-gray-50">
                      <div className="text-sm font-medium">Carbon Tracker</div>
                      <div className="text-xs text-gray-600">Track your carbon footprint</div>
                    </Link>
                    <Link to="/green-wallet" className="block p-3 space-y-1 rounded-md hover:bg-gray-50">
                      <div className="text-sm font-medium">Green Wallet</div>
                      <div className="text-xs text-gray-600">Earn EcoPoints with blockchain</div>
                    </Link>
                    <Link to="/plant-designer" className="block p-3 space-y-1 rounded-md hover:bg-gray-50">
                      <div className="text-sm font-medium">Plant Designer</div>
                      <div className="text-xs text-gray-600">AI garden design recommendations</div>
                    </Link>
                    <Link to="/waste-scan" className="block p-3 space-y-1 rounded-md hover:bg-gray-50">
                      <div className="text-sm font-medium">WasteScan AI</div>
                      <div className="text-xs text-gray-600">Waste sorting and recycling guide</div>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/prediction" className="text-white hover:text-blue-200 transition-colors text-sm font-medium px-4 py-2">
                  Prediction
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/about" className="text-white hover:text-blue-200 transition-colors text-sm font-medium px-4 py-2">
                  About
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
