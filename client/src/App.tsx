import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import SiteNav from "./components/SiteNav";
import Home from "./pages/Home";
import Team from "./pages/Team";
import FAQ from "./pages/FAQ";
import Career from "./pages/Career";
import EmployeePortal from "./pages/EmployeePortal";
import Contact from "./pages/Contact";
import Insights from "./pages/Insights";
import Resources from "./pages/Resources";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/team"} component={Team} />
      <Route path={"/insights"} component={Insights} />
      <Route path={"/resources"} component={Resources} />
      <Route path={"/faq"} component={FAQ} />
      <Route path={"/career"} component={Career} />
      <Route path={"/employee-portal"} component={EmployeePortal} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
      >
        <TooltipProvider>
          <Toaster />
          <SiteNav />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
