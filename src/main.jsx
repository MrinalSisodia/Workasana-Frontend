// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import App from "./App.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoginPage from "./Pages/LoginScreen.jsx";
import DashboardPage from "./Pages/Dashboard.jsx";
import TeamsPage from "./Pages/Teams.jsx";
import TeamDetail from "./Pages/TeamDetail.jsx";
import TaskDetail from "./Pages/TaskDetail.jsx";
import ProjectDetail from "./Pages/ProjectDetail.jsx";
import ReportsDashboard from "./Pages/Reports.jsx";
import SettingsPage from "./Pages/Settings.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { ProjectProvider } from "./context/ProjectContext.jsx";
import { TaskProvider } from "./context/TaskContext.jsx";
import { TeamProvider } from "./context/TeamContext.jsx";

import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <BrowserRouter>
  <AuthProvider>
    <UserProvider>
      <ProjectProvider>
        <TeamProvider>
          <TaskProvider>
            <Routes>
              {/* Login page (public) */}
              <Route path="/" element={<LoginPage />} />

              {/* App layout (protected routes) */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <App />   {/* App has <Outlet /> */}
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="teams" element={<TeamsPage />} />
                <Route path="teams/:id" element={<TeamDetail />} />
                <Route path="tasks/:id" element={<TaskDetail />} />
                <Route path="projects/:id" element={<ProjectDetail />} />
                <Route path="reports" element={<ReportsDashboard />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Routes>
          </TaskProvider>
        </TeamProvider>
      </ProjectProvider>
    </UserProvider>
  </AuthProvider>
</BrowserRouter>

    </StrictMode>
)