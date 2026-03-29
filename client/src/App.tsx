import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HomePage from "./pages/HomePage.tsx";
import PropertySearchPage from "./pages/PropertySearchPage.tsx";
import PropertyDetailPage from "./pages/PropertyDetailPage.tsx";
import AddListingPage from "./pages/AddListingPage.tsx";
import LandlordDashboard from "./pages/LandlordDashboard.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import Navbar from "./components/Navbar.tsx";
import Footer from "./components/Footer.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<PropertySearchPage />} />
              <Route path="/properties/:id" element={<PropertyDetailPage />} />
              <Route path="/add-listing" element={<AddListingPage />} />
              <Route path="/dashboard/landlord" element={<LandlordDashboard />} />
              <Route path="/dashboard/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
