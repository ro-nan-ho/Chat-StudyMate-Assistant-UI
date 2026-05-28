"use client";

import { StudentDocumentsView } from "@/components/features/student-documents-view";
import { DocumentsView } from "@/components/features/teacher-documents-view";
import { useAuth } from "@/hooks/use-auth";

export default function Page() {
  const { session } = useAuth();
  const userRole = session?.role || "student";

  return userRole === "student" ? <StudentDocumentsView /> : <DocumentsView />;
}
