"use client";

import {
  FileText,
  Search,
  MoreHorizontal,
  Filter,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Lock,
  Download,
} from "lucide-react";
import { docs as teacherDocs } from "./teacher-documents-view";

type DocStatus = "uploading" | "parsing" | "chunking" | "embedding" | "indexed" | "error";

type Document = {
  id: string;
  name: string;
  chapter: string;
  type: string;
  date: string;
  updatedDate: string;
  status: DocStatus;
  progress: number;
  currentStage: string;
  chunks: number;
  totalChunks: number;
  embeddings: number;
  totalEmbeddings: number;
  errorMessage?: string;
  fileSize: string;
};

const docs: Document[] = teacherDocs;

// Group documents by chapter
const groupedDocs = docs.reduce((acc, doc) => {
  const chapter = doc.chapter;
  if (!acc[chapter]) {
    acc[chapter] = [];
  }
  acc[chapter].push(doc);
  return acc;
}, {} as Record<string, Document[]>);

const statusConfig: Record<DocStatus, { label: string; class: string; icon: typeof CheckCircle2 }> =
  {
    indexed: {
      label: "Đã index",
      class: "bg-secondary-soft text-secondary-foreground",
      icon: CheckCircle2,
    },
    parsing: { label: "Đang phân tích", class: "bg-accent-soft text-accent-foreground", icon: Loader2 },
    embedding: { label: "Embedding", class: "bg-primary-soft text-primary", icon: Loader2 },
    chunking: { label: "Chunking", class: "bg-accent-soft text-accent-foreground", icon: Loader2 },
    uploading: { label: "Đang tải", class: "bg-muted text-muted-foreground", icon: Loader2 },
    error: {
      label: "Lỗi",
      class: "bg-destructive/20 text-destructive-foreground",
      icon: AlertTriangle,
    },
  };

function StageIndicator({ stage, progress }: { stage: string; progress: number }) {
  const stageConfig: Record<string, { label: string; icon: typeof CheckCircle2; color: string }> = {
    uploading: { label: "Đang tải", icon: Loader2, color: "text-primary" },
    parsing: { label: "Đang phân tích", icon: Loader2, color: "text-accent-foreground" },
    chunking: { label: "Đang chia nhỏ", icon: Loader2, color: "text-accent-foreground" },
    embedding: { label: "Đang tạo vector", icon: Loader2, color: "text-primary" },
    indexed: { label: "Hoàn tất", icon: CheckCircle2, color: "text-secondary-foreground" },
  };

  const config = stageConfig[stage] || stageConfig.uploading;
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2">
      <Icon className={`h-4 w-4 ${stage === "parsing" || stage === "embedding" ? "animate-spin" : ""} ${config.color}`} />
      <span className="text-xs font-medium text-foreground">{config.label}</span>
      {progress > 0 && progress < 100 && <span className="text-xs text-muted-foreground">{progress}%</span>}
    </div>
  );
}

function ProgressBar({ progress, label, color = "primary" }: { progress: number; label?: string; color?: "primary" | "accent" | "secondary" | "warning" }) {
  const colorClass = {
    primary: "bg-primary",
    accent: "bg-accent-foreground",
    secondary: "bg-secondary-foreground",
    warning: "bg-warning-foreground",
  }[color];

  return (
    <div className="space-y-1">
      {label && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">{label}</span>
          <span className="tabular-nums text-foreground">{progress}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${colorClass} transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function StudentDocumentsView() {
  const handleDownloadChapter = (chapter: string) => {
    console.log(`Downloading all documents for ${chapter}`);
    // In a real implementation, this would trigger a download of all documents in the chapter
  };

  return (
    <div className="scrollbar-thin h-[calc(100vh-3.5rem)] overflow-y-auto">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Tài liệu</h1>
        </div>

        {/* Search bar */}
        <div className="mb-4 flex flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-soft sm:max-w-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Tìm tài liệu…"
            className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        {/* Grouped by chapter */}
        <div className="mt-4 space-y-4">
          {Object.entries(groupedDocs).map(([chapter, chapterDocs]) => (
            <div key={chapter} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
              {/* Chapter header with download button */}
              <div className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-3">
                <h2 className="text-sm font-semibold text-foreground">{chapter}</h2>
                <button
                  onClick={() => handleDownloadChapter(chapter)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary-soft"
                >
                  <Download className="h-3.5 w-3.5" />
                  Tải xuống
                </button>
              </div>

              {/* Documents table for this chapter */}
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Tài liệu</th>
                    <th className="px-3 py-3 font-medium">Định dạng</th>
                    <th className="px-3 py-3 font-medium">Ngày đăng</th>
                    <th className="px-3 py-3 font-medium">Ngày cập nhật</th>
                    <th className="px-3 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {chapterDocs.map((d) => (
                    <tr
                      key={d.id}
                      className="border-b border-border/60 last:border-0 hover:bg-muted/40"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
                            <FileText className="h-4 w-4" />
                          </div>
                          <span className="font-medium text-foreground">{d.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                          {d.type}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-muted-foreground">{d.date}</td>
                      <td className="px-3 py-3.5 text-muted-foreground">{d.updatedDate}</td>
                      <td className="px-3 py-3.5 text-right">
                        <div className="flex items-center gap-1">
                          <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
