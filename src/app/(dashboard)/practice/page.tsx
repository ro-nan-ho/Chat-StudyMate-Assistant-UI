"use client";

import { StudentPracticeView } from "@/components/features/student-practice-view";
import { TeacherPracticeView } from "@/components/features/teacher-practice-view";
import { useAuth } from "@/hooks/use-auth";

export default function Page() {
  const { session } = useAuth();
  const userRole = session?.role || "student";

  return userRole === "student" ? <StudentPracticeView /> : <TeacherPracticeView />;
}
