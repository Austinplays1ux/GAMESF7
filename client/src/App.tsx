import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Discover from "@/pages/Discover";
import Create from "@/pages/Create";
import GameDetails from "@/pages/GameDetails";
import GamePlayer from "@/pages/GamePlayer";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";

function Router() {
  return (
    <div className="flex flex-col min-h-screen bg-dark text-white font-inter">
      <AppHeader />
      <div className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/discover" component={Discover} />
          <Route path="/create" component={Create} />
          <Route path="/games/:id" component={GameDetails} />
          <Route path="/play/:id" component={GamePlayer} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
