import type { Metadata } from "next";

import { EvaluationView } from "@/components/features/evaluation-view";

export const metadata: Metadata = {
  title: "Evaluation",
};

export default function Page() {
  return <EvaluationView />;
}
