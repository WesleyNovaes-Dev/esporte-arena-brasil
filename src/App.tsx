
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import PrivateChatIcon from "./components/chat/PrivateChatIcon";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import Teams from "./pages/Teams";
import CreateTeam from "./pages/CreateTeam";
import TeamDetails from "./pages/TeamDetails";
import Championships from "./pages/Championships";
import Rankings from "./pages/Rankings";
import PrivateChat from "./pages/PrivateChat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
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
            <Route path="/events" element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            } />
            <Route path="/create-event" element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            } />
            <Route path="/teams" element={
              <ProtectedRoute>
                <Teams />
              </ProtectedRoute>
            } />
            <Route path="/teams/:teamId" element={
              <ProtectedRoute>
                <TeamDetails />
              </ProtectedRoute>
            } />
            <Route path="/create-team" element={
              <ProtectedRoute>
                <CreateTeam />
              </ProtectedRoute>
            } />
            <Route path="/championships" element={
              <ProtectedRoute>
                <Championships />
              </ProtectedRoute>
            } />
            <Route path="/rankings" element={
              <ProtectedRoute>
                <Rankings />
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <PrivateChat />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Private Chat Icon - Only show on protected routes */}
          <Routes>
            <Route path="/dashboard" element={<PrivateChatIcon />} />
            <Route path="/profile" element={<PrivateChatIcon />} />
            <Route path="/events" element={<PrivateChatIcon />} />
            <Route path="/create-event" element={<PrivateChatIcon />} />
            <Route path="/teams/*" element={<PrivateChatIcon />} />
            <Route path="/create-team" element={<PrivateChatIcon />} />
            <Route path="/championships" element={<PrivateChatIcon />} />
            <Route path="/rankings" element={<PrivateChatIcon />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
