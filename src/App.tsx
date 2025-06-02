
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import Navbar from "@/components/layout/Navbar";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Teams from "./pages/Teams";
import TeamDetails from "./pages/TeamDetails";
import CreateTeam from "./pages/CreateTeam";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import Championships from "./pages/Championships";
import CreateChampionship from "./pages/CreateChampionship";
import ChampionshipDetails from "./pages/ChampionshipDetails";
import Rankings from "./pages/Rankings";
import PrivateChat from "./pages/PrivateChat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/teams" element={<Teams />} />
                  <Route path="/teams/:id" element={<TeamDetails />} />
                  <Route path="/teams/create" element={
                    <ProtectedRoute>
                      <CreateTeam />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/events" element={<Events />} />
                  <Route path="/events/create" element={
                    <ProtectedRoute>
                      <CreateEvent />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/championships" element={<Championships />} />
                  <Route path="/championships/create" element={
                    <ProtectedRoute>
                      <CreateChampionship />
                    </ProtectedRoute>
                  } />
                  <Route path="/championships/:id" element={<ChampionshipDetails />} />
                  
                  <Route path="/rankings" element={<Rankings />} />
                  
                  <Route path="/chat/:userId" element={
                    <ProtectedRoute>
                      <PrivateChat />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
