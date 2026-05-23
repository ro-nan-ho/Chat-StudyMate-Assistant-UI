import type { Metadata } from "next";

import { SettingsView } from "@/components/features/settings-view";

export const metadata: Metadata = {
  title: "Cài đặt",
};

export default function Page() {
  return <SettingsView />;
}
