
import "./Sidebar.css";
import { useAuth } from "../../context/AuthContext";
import examLogo from '../../assets/examLogo.jpeg'


function getInitials(name = "") {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const NAV_ITEMS = [
  { id: "profile", label: "My Profile", icon: "👤" },
  { id: "exams",   label: "Examinations", icon: "📝" },
  { id: "results", label: "Results", icon: "📊" },
];

export default function Sidebar({ activePage, onNavigate, isOpen, onClose }) {
  const { user, logout } = useAuth();

  const student = {
    name: user?.fullname ? `${user.fullname.firstname} ${user.fullname.lastname}` : user?.name,
    role: user?.role,
  };

  const handleNav = (id) => {
    onNavigate(id);
    onClose();
  };

  const handleLogout = () => {
    onClose();
    logout();
  };

  return (
    <>
      {isOpen && <div className="sidebar__overlay" onClick={onClose} />}

      <aside className={`sidebar${isOpen ? " open" : ""}`}>
        {/* Brand */}
        <div className="sidebar__brand">
          <div className="sidebar__brand-icon">  <img src={examLogo} alt="TestZen Logo" /></div>

          
          <div className="sidebar__brand-text">
            <span className="sidebar__brand-name">TESTZEN</span>
            <span className="sidebar__brand-sub"> Exam Management System</span>
          </div>
        </div>

        {/* Student mini profile */}
        <div className="sidebar__student">
          <div className="sidebar__student-avatar">
            {getInitials(student?.name)}
          </div>
          <div className="sidebar__student-info">
            <div className="sidebar__student-name">{student?.name}</div>
            <div className="sidebar__student-role">{student?.role?.toUpperCase()}</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav">
          <span className="sidebar__section-label">Menu</span>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`sidebar__nav-item${activePage === item.id ? " active" : ""}`}
              onClick={() => handleNav(item.id)}
            >
              <span className="sidebar__nav-icon">{item.icon}</span>
              <span className="sidebar__nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="sidebar__footer">
          <button className="sidebar__logout" onClick={handleLogout}>
            <span className="sidebar__logout-icon">🚪</span>
            <span className="sidebar__logout-label">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
