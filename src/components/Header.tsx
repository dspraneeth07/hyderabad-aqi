
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-md shadow-2xl z-50 border-b border-gray-700/50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <div className="absolute w-full h-full">
                <div className="w-full h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-110 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">E</span>
                </div>
              </div>
            </div>
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              EcoSphere
            </Link>
          </div>
          
          {/* Navigation Menu - Direct Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/" className="text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/10">
              Home
            </Link>
            <Link to="/live-aqi" className="text-gray-300 hover:text-green-400 transition-all duration-300 text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-500/10">
              Live AQI
            </Link>
            <Link to="/aqi-insights" className="text-gray-300 hover:text-blue-400 transition-all duration-300 text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-500/10">
              AI Insights
            </Link>
            <Link to="/carbon-tracker" className="text-gray-300 hover:text-purple-400 transition-all duration-300 text-sm font-medium px-4 py-2 rounded-lg hover:bg-purple-500/10">
              Carbon Track
            </Link>
            <Link to="/green-wallet" className="text-gray-300 hover:text-emerald-400 transition-all duration-300 text-sm font-medium px-4 py-2 rounded-lg hover:bg-emerald-500/10">
              Blockchain
            </Link>
            <Link to="/plant-designer" className="text-gray-300 hover:text-yellow-400 transition-all duration-300 text-sm font-medium px-4 py-2 rounded-lg hover:bg-yellow-500/10">
              Plant AI
            </Link>
            <Link to="/waste-scan" className="text-gray-300 hover:text-red-400 transition-all duration-300 text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-500/10">
              WasteScan
            </Link>
            <Link to="/prediction" className="text-gray-300 hover:text-orange-400 transition-all duration-300 text-sm font-medium px-4 py-2 rounded-lg hover:bg-orange-500/10">
              Prediction
            </Link>
            <Link to="/about" className="text-gray-300 hover:text-cyan-400 transition-all duration-300 text-sm font-medium px-4 py-2 rounded-lg hover:bg-cyan-500/10">
              About
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button className="text-gray-300 hover:text-white p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
