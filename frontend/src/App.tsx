import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { MainLayout } from "@/layouts/MainLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { RouteChangeTracker } from "@/components/RouteChangeTracker";
import { Home } from "@/pages/Home";

// Route-level code splitting: everything past the homepage loads on demand,
// keeping the initial bundle small for first paint.
const Login = lazy(() => import("@/pages/auth/Login").then((m) => ({ default: m.Login })));
const Register = lazy(() => import("@/pages/auth/Register").then((m) => ({ default: m.Register })));
const VerifyOTP = lazy(() => import("@/pages/auth/VerifyOTP").then((m) => ({ default: m.VerifyOTP })));
const Dashboard = lazy(() => import("@/pages/Dashboard").then((m) => ({ default: m.Dashboard })));

const Learn = lazy(() => import("@/pages/Learn").then((m) => ({ default: m.Learn })));
const TrackPage = lazy(() => import("@/pages/track/TrackPage").then((m) => ({ default: m.TrackPage })));
const LessonPage = lazy(() => import("@/pages/track/LessonPage").then((m) => ({ default: m.LessonPage })));

const Downloads = lazy(() => import("@/pages/Downloads").then((m) => ({ default: m.Downloads })));
const Calculators = lazy(() => import("@/pages/Calculators").then((m) => ({ default: m.Calculators })));
const CalculatorDetailPage = lazy(() =>
  import("@/pages/calculators/CalculatorDetailPage").then((m) => ({ default: m.CalculatorDetailPage }))
);
const WiringDiagrams = lazy(() => import("@/pages/WiringDiagrams").then((m) => ({ default: m.WiringDiagrams })));
const WiringDiagramDetailPage = lazy(() =>
  import("@/pages/wiring/WiringDiagramDetailPage").then((m) => ({ default: m.WiringDiagramDetailPage }))
);
const MachineLibrary = lazy(() => import("@/pages/MachineLibrary").then((m) => ({ default: m.MachineLibrary })));
const MachineDetailPage = lazy(() =>
  import("@/pages/machine/MachineDetailPage").then((m) => ({ default: m.MachineDetailPage }))
);
const FaultFinder = lazy(() => import("@/pages/FaultFinder").then((m) => ({ default: m.FaultFinder })));
const FaultDetailPage = lazy(() =>
  import("@/pages/fault/FaultDetailPage").then((m) => ({ default: m.FaultDetailPage }))
);
const AIAssistant = lazy(() => import("@/pages/AIAssistant").then((m) => ({ default: m.AIAssistant })));
const SearchResults = lazy(() => import("@/pages/search/SearchResults").then((m) => ({ default: m.SearchResults })));

const AutomationNews = lazy(() => import("@/pages/AutomationNews").then((m) => ({ default: m.AutomationNews })));
const Blog = lazy(() => import("@/pages/Blog").then((m) => ({ default: m.Blog })));
const PostDetailPage = lazy(() => import("@/pages/posts/PostDetailPage").then((m) => ({ default: m.PostDetailPage })));

const Community = lazy(() => import("@/pages/community/CommunityList").then((m) => ({ default: m.Community })));
const CommunityNewThread = lazy(() =>
  import("@/pages/community/CommunityNewThread").then((m) => ({ default: m.CommunityNewThread }))
);
const CommunityThreadDetail = lazy(() =>
  import("@/pages/community/CommunityThreadDetail").then((m) => ({ default: m.CommunityThreadDetail }))
);

const About = lazy(() => import("@/pages/About").then((m) => ({ default: m.About })));
const Contact = lazy(() => import("@/pages/Contact").then((m) => ({ default: m.Contact })));
const Privacy = lazy(() => import("@/pages/legal/Privacy").then((m) => ({ default: m.Privacy })));
const Terms = lazy(() => import("@/pages/legal/Terms").then((m) => ({ default: m.Terms })));
const NotFound = lazy(() => import("@/pages/NotFound").then((m) => ({ default: m.NotFound })));

// Admin Panel
const AdminLayout = lazy(() => import("@/layouts/AdminLayout").then((m) => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard").then((m) => ({ default: m.AdminDashboard })));
const AdminUsers = lazy(() => import("@/pages/admin/AdminUsers").then((m) => ({ default: m.AdminUsers })));
const AdminDownloads = lazy(() => import("@/pages/admin/AdminDownloads").then((m) => ({ default: m.AdminDownloads })));
const AdminPosts = lazy(() => import("@/pages/admin/AdminPosts").then((m) => ({ default: m.AdminPosts })));
const AdminCommunity = lazy(() => import("@/pages/admin/AdminCommunity").then((m) => ({ default: m.AdminCommunity })));
const AdminStub = lazy(() => import("@/pages/admin/AdminStub").then((m) => ({ default: m.AdminStub })));

const RouteFallback = () => (
  <div className="flex min-h-[50vh] items-center justify-center text-ink-400">Loading...</div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <RouteChangeTracker />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route index element={<Home />} />

                {/* Auth */}
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="verify-otp" element={<VerifyOTP />} />

                {/* Learning tracks — dynamic, data-driven by the content API */}
                <Route path="learn" element={<Learn />} />
                <Route path="learn/:track" element={<TrackPage />} />
                <Route path="learn/:track/:slug" element={<LessonPage />} />

                {/* Tools */}
                <Route path="downloads" element={<Downloads />} />
                <Route path="calculators" element={<Calculators />} />
                <Route path="calculators/:slug" element={<CalculatorDetailPage />} />
                <Route path="wiring-diagrams" element={<WiringDiagrams />} />
                <Route path="wiring-diagrams/:slug" element={<WiringDiagramDetailPage />} />
                <Route path="machine-library" element={<MachineLibrary />} />
                <Route path="machine-library/:slug" element={<MachineDetailPage />} />
                <Route path="fault-finder" element={<FaultFinder />} />
                <Route path="fault-finder/:slug" element={<FaultDetailPage />} />
                <Route path="ai-assistant" element={<AIAssistant />} />
                <Route path="search" element={<SearchResults />} />

                {/* Community & content */}
                <Route path="news" element={<AutomationNews />} />
                <Route path="news/:slug" element={<PostDetailPage type="news" basePath="/news" />} />
                <Route path="blog" element={<Blog />} />
                <Route path="blog/:slug" element={<PostDetailPage type="blog" basePath="/blog" />} />

                <Route path="community" element={<Community />} />
                <Route path="community/:id" element={<CommunityThreadDetail />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="community/new" element={<CommunityNewThread />} />
                </Route>

                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="privacy" element={<Privacy />} />
                <Route path="terms" element={<Terms />} />

                {/* Authenticated */}
                <Route element={<ProtectedRoute />}>
                  <Route path="dashboard" element={<Dashboard />} />
                </Route>

                {/* Admin Panel — role-gated, never reachable via public registration */}
                <Route element={<AdminRoute />}>
                  <Route path="admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="downloads" element={<AdminDownloads />} />
                    <Route path="blog" element={<AdminPosts type="blog" label="Blog" />} />
                    <Route path="news" element={<AdminPosts type="news" label="News" />} />
                    <Route path="community" element={<AdminCommunity />} />
                    <Route
                      path="courses"
                      element={<AdminStub title="Course Management" description="Manage learning track lessons directly from the panel instead of the seed script. Planned for a later phase." />}
                    />
                    <Route
                      path="analytics"
                      element={<AdminStub title="Analytics" description="Traffic, engagement, and content performance dashboards. Planned for a later phase." />}
                    />
                    <Route
                      path="seo"
                      element={<AdminStub title="SEO Settings" description="Manage meta tags, sitemaps, and structured data site-wide from one screen. Planned for a later phase." />}
                    />
                    <Route
                      path="ads"
                      element={<AdminStub title="Advertisement Management" description="Manage ad placements and sponsors, if the platform introduces them. Planned for a later phase." />}
                    />
                  </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
