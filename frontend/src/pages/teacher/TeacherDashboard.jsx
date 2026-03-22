import { useState } from "react";
import DashboardShell from "../../components/DashboardShell";

import TeacherHome from "./TeacherHome";
import Students from "./Students";
import Submissions from "./Submissions";
import TeacherProfile from "./TeacherProfile";
import CreateExam from "./CreateExam";
import Results from "./result";

export default function TeacherDashboard() {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    switch (page) {
      case "students":
        return <Students />;
      case "submissions":
        return <Submissions />;
      case "profile":
        return <TeacherProfile />;
      case "create-exam":
        return <CreateExam onNavigate={setPage} />;
      case "results":
        return <Results />;
      default:
        return <TeacherHome onNavigate={setPage} />;
    }
  };

  return (
    <DashboardShell role="teacher" onNavigate={setPage}>
      {renderPage()}
    </DashboardShell>
  );
}