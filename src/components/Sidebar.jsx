import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Checks if the current path matches or starts with the given route
  const isActive = (path) => {
    if (path === "/projects") {
      // Highlight "Projects" for project detail pages too
      return currentPath === "/projects" || currentPath.startsWith("/projects/");
    }
    return currentPath === path;
  };

  return (
    <aside className="bg-light border-end p-4" style={{ width: "250px", flexShrink: 0 }}>
      <h2 className="fw-bold text-primary mb-5">workasana</h2>
      <nav className="nav flex-column gap-3">
        <Link
          to="/dashboard"
          className={`nav-link d-flex align-items-center gap-2 ${isActive("/dashboard") ? "fw-bold text-primary" : "text-dark"}`}
        >
          <i className="bi bi-grid-1x2"></i> Dashboard
        </Link>
       <div
  className={`nav-link d-flex align-items-center gap-2 ${
    isActive("/projects") ? "fw-bold text-primary" : "text-dark"
  }`}
  style={{ cursor: "default" }} // optional: show non-clickable cursor
>
  <i className="bi bi-grid-3x3-gap"></i> Project
</div>
        <Link
          to="/teams"
          className={`nav-link d-flex align-items-center gap-2 ${isActive("/teams") ? "fw-bold text-primary" : "text-dark"}`}
        >
          <i className="bi bi-people"></i> Teams
        </Link>
        <Link
          to="/reports"
          className={`nav-link d-flex align-items-center gap-2 ${isActive("/reports") ? "fw-bold text-primary" : "text-dark"}`}
        >
          <i className="bi bi-bar-chart"></i> Reports
        </Link>
        <Link
          to="/settings"
          className={`nav-link d-flex align-items-center gap-2 ${isActive("/settings") ? "fw-bold text-primary" : "text-dark"}`}
        >
          <i className="bi bi-gear"></i> Settings
        </Link>
      </nav>
    </aside>
  );
}
