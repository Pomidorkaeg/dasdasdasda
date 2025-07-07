import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, createRoutesFromElements, createHashRouter, RouterProvider } from "react-router-dom";
import { PlayersPage } from './pages/admin/PlayersPage';

// Lazy-load all route components
const Index = lazy(() => import("./pages/Index"));
const Team = lazy(() => import("./pages/Team"));
const News = lazy(() => import("./pages/News"));
const NewsDetail = lazy(() => import("./components/NewsDetail"));
const Matches = lazy(() => import("./pages/Matches"));
const Tournaments = lazy(() => import("./pages/Tournaments"));
const Contacts = lazy(() => import("./pages/Contacts"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin routes
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminHome = lazy(() => import("./pages/admin/AdminHome"));
const PlayersManagement = lazy(() => import("./pages/admin/PlayersManagement"));
const CoachesManagement = lazy(() => import("./pages/admin/CoachesManagement"));
const Coaches2Management = lazy(() => import("./pages/admin/Coaches2Management"));
const MatchesManagement = lazy(() => import("./pages/admin/MatchesManagement"));
const NewsManagement = lazy(() => import("./pages/admin/NewsManagement"));
const MediaManagement = lazy(() => import("./pages/admin/MediaManagement"));
const TeamsManagement = lazy(() => import("./app/admin/page"));

// Fallback loading component
const PageLoading = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-fc-green border-t-transparent"></div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

// Create router with future flags
const router = createHashRouter(
  createRoutesFromElements(
    <>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/team" element={<Team />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/tournaments" element={<Tournaments />} />
              <Route path="/tournaments/:id" element={<Tournaments />} />
              <Route path="/contacts" element={<Contacts />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={<AdminDashboard />}>
                <Route index element={<AdminHome />} />
                <Route path="teams" element={<TeamsManagement />} />
                <Route path="players" element={<PlayersManagement />} />
                <Route path="coaches" element={<CoachesManagement />} />
                <Route path="coaches2" element={<Coaches2Management />} />
                <Route path="tournaments" element={<AdminHome />} />
                <Route path="matches" element={<MatchesManagement />} />
                <Route path="news" element={<NewsManagement />} />
              </Route>
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
    </>
  ),
  {
    future: {
      v7_relativeSplatPath: true
    }
  }
);

// Always use HashRouter for compatibility with GitHub Pages
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Suspense fallback={<PageLoading />}>
          <RouterProvider router={router} />
          </Suspense>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
