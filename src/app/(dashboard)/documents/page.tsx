import type { Metadata } from "next";

import { DocumentsView } from "@/components/features/documents-view";

export const metadata: Metadata = {
  title: "Tài liệu",
  description: "Quản lý và index tài liệu môn học.",
};

export default function Page() {
  return <DocumentsView />;
}
