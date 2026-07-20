import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import SiteNav from "./components/SiteNav";
import SiteFooter from "./components/SiteFooter";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Industries from "./pages/Industries";
import Team from "./pages/Team";
import FAQ from "./pages/FAQ";
import Career from "./pages/Career";
import EmployeePortal from "./pages/EmployeePortal";
import Contact from "./pages/Contact";
import Insights from "./pages/Insights";
import Resources from "./pages/Resources";
import InsightArticle from "./pages/InsightArticle";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/about"} component={About} />
      <Route path={"/services"} component={Services} />
      <Route path={"/industries"} component={Industries} />
      <Route path={"/team"} component={Team} />
      <Route path={"/insights"} component={Insights} />
      <Route path={"/resources"} component={Resources} />
      <Route path="/insights/:slug" component={InsightArticle} />
      <Route path={"/faq"} component={FAQ} />
      <Route path={"/careers"} component={Career} />
      <Route path={"/career"} component={Career} />
      <Route path={"/employee-portal"} component={EmployeePortal} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/terms"} component={Terms} />
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
          <ScrollToTop />
          <Router />
          <SiteFooter />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
