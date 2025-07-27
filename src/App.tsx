
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import LiveAQI from "./pages/LiveAQI";
import About from "./pages/About";
import Prediction from "./pages/Prediction";
import AQIInsights from "./pages/AQIInsights";
import CarbonTracker from "./pages/CarbonTracker";
import GreenWallet from "./pages/GreenWallet";
import PlantDesigner from "./pages/PlantDesigner";
import WasteScan from "./pages/WasteScan";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  console.log("App component rendering");

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/live-aqi" element={<LiveAQI />} />
            <Route path="/about" element={<About />} />
            <Route path="/prediction" element={<Prediction />} />
            <Route path="/aqi-insights" element={<AQIInsights />} />
            <Route path="/carbon-tracker" element={<CarbonTracker />} />
            <Route path="/green-wallet" element={<GreenWallet />} />
            <Route path="/plant-designer" element={<PlantDesigner />} />
            <Route path="/waste-scan" element={<WasteScan />} />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
