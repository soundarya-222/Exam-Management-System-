import { useState } from "react";
import DashboardShell    from "../../components/DashboardShell";
import TeacherHome       from "./TeacherHome";
import TeacherProfile    from "./TeacherProfile";

import Submissions       from "./Submissions";
import Students          from "./Students";

const PAGE_META = {
  dashboard:   { title: "Dashboard",        sub: "Your teaching overview at a glance." },
  profile:     { title: "My Profile",       sub: "View and update your details." },
  "create-exam": { title: "Create Exam",    sub: "Build a new exam for your students." },
  submissions: { title: "Submissions",      sub: "Review and grade student submissions." },
  students:    { title: "Students",         sub: "All enrolled students and their performance." },
};

export default function TeacherDashboard() {
  const [page, setPage] = useState("dashboard");
  const meta = PAGE_META[page] || PAGE_META.dashboard;

  return (
    <DashboardShell activePage={page} onNavigate={setPage} pageTitle={meta.title}>
      <div className="page-header">
        <h2>{meta.title}</h2>
        <p>{meta.sub}</p>
      </div>

      {page === "dashboard"    && <TeacherHome    onNavigate={setPage} />}
      {page === "profile"      && <TeacherProfile />}
      {page === "create-exam"  && <CreateExam     onSuccess={() => setPage("dashboard")} />}
      {page === "submissions"  && <Submissions />}
      {page === "students"     && <Students />}
    </DashboardShell>
  );
}
