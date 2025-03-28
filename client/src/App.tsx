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

function Router() {
  const [location] = useLocation();
  const isLoginPage = location === "/" || location === "/login";

  return (
    <div className="flex flex-col min-h-screen bg-[#16082F] text-white sofia-pro">
      {!isLoginPage && <AppHeader />}
      <div className="flex-grow">
        <Switch>
          <Route path="/" component={Login} />
          <Route path="/login" component={Login} />
          <Route path="/home" component={Home} />
          <Route path="/discover" component={Discover} />
          <Route path="/create" component={Create} />
          <Route path="/games/:id" component={GameDetails} />
          <Route path="/play/:id" component={GamePlayer} />
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
        <Router />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
