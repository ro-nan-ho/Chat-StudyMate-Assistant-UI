import type { Metadata } from "next";

import { ChatView } from "@/components/features/chat-view";

export const metadata: Metadata = {
  title: "Chat",
  description: "Tra cứu tài liệu môn học bằng AI với trích dẫn rõ ràng.",
};

export default function Page() {
  return <ChatView />;
}
