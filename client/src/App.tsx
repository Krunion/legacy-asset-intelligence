import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import SiteNav from "./components/SiteNav";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Industries from "./pages/Industries";
import CaseStudies from "./pages/CaseStudiesPage";
import Solutions from "./pages/Solutions";
import Team from "./pages/Team";
import Blog from "./pages/Blog";
import Resources from "./pages/Resources";
import FAQ from "./pages/FAQ";
import Career from "./pages/Career";
import EmployeePortal from "./pages/EmployeePortal";
import Contact from "./pages/Contact";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/services"} component={Services} />
      <Route path={"/industries"} component={Industries} />
      <Route path={"/case-studies"} component={CaseStudies} />
      <Route path={"/solutions"} component={Solutions} />
      <Route path={"/team"} component={Team} />
      <Route path={"/blog"} component={Blog} />
      <Route path={"/resources"} component={Resources} />
      <Route path={"/faq"} component={FAQ} />
      <Route path={"/career"} component={Career} />
      <Route path={"/employee-portal"} component={EmployeePortal} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
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
