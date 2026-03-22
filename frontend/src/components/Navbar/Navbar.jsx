import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";

function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Navbar({ onMenuToggle, activePage }) {
  const { student } = useAuth();

  const pageTitles = {
    profile: "My Profile",
    exams: "Examinations",
    results: "My Results",
  };

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button
          className="navbar__hamburger"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className="navbar__title">{pageTitles[activePage] || "Dashboard"}</h1>
      </div>

      <div className="navbar__right">
        <span className="navbar__date">{formatDate()}</span>

        <button className="navbar__notif" title="Notifications">
          🔔
          <span className="navbar__notif-badge" />
        </button>

        <div className="navbar__avatar" title={student?.name}>
          {getInitials(student?.name)}
        </div>
      </div>
    </header>
  );
}
