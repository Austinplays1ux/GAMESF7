import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import Discover from "@/pages/Discover";
import Create from "@/pages/Create";
import GameDetails from "@/pages/GameDetails";
import GamePlayer from "@/pages/GamePlayer";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function Router() {
  const [location] = useLocation();
  const isLoginPage = location === "/" || 
                      location === "/login" || 
                      location === "/signup" ||
                      location.startsWith("/auth");

  return (
    <div className="flex flex-col min-h-screen bg-[#16082F] text-white sofia-pro">
      {!isLoginPage && <AppHeader />}
      <div className="flex-grow">
        <Switch>
          <Route path="/" component={Login} />
          <Route path="/login" component={Login} />
          <Route path="/auth/:mode?" component={Login} />
          <ProtectedRoute path="/home" component={Home} />
          <ProtectedRoute path="/discover" component={Discover} />
          <ProtectedRoute path="/create" component={Create} />
          <ProtectedRoute path="/games/:id" component={GameDetails} />
          <ProtectedRoute path="/play/:id" component={GamePlayer} />
          <Route component={NotFound} />
        </Switch>
      </div>
      {!isLoginPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
