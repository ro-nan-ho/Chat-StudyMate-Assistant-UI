"use client";

import {
  UploadCloud,
  FileText,
  Search,
  MoreHorizontal,
  Filter,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Layers,
} from "lucide-react";
import { useState, useRef } from "react";

type DocStatus = "uploading" | "parsing" | "chunking" | "embedding" | "indexed" | "error";

type Document = {
  id: string;
  name: string;
  chapter: string;
  type: string;
  date: string;
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

const docs: Document[] = [
  {
    id: "1",
    name: "Giáo trình KTPM.pdf",
    chapter: "Chương 2.1",
    type: "PDF",
    date: "12/03/2025",
    status: "indexed",
    progress: 100,
    currentStage: "indexed",
    chunks: 124,
    totalChunks: 124,
    embeddings: 124,
    totalEmbeddings: 124,
    fileSize: "15.2 MB",
  },
  {
    id: "2",
    name: "Slide bài giảng W04.pptx",
    chapter: "Chương 2.2",
    type: "PPTX",
    date: "18/03/2025",
    status: "indexed",
    progress: 100,
    currentStage: "indexed",
    chunks: 32,
    totalChunks: 32,
    embeddings: 32,
    totalEmbeddings: 32,
    fileSize: "8.5 MB",
  },
  {
    id: "3",
    name: "Bài tập nhóm UML.docx",
    chapter: "Chương 3.1",
    type: "DOCX",
    date: "21/03/2025",
    status: "embedding",
    progress: 75,
    currentStage: "embedding",
    chunks: 18,
    totalChunks: 18,
    embeddings: 12,
    totalEmbeddings: 18,
    fileSize: "2.1 MB",
  },
  {
    id: "4",
    name: "Tham khảo Microservices.pdf",
    chapter: "Chương 3.2",
    type: "PDF",
    date: "22/03/2025",
    status: "chunking",
    progress: 50,
    currentStage: "chunking",
    chunks: 12,
    totalChunks: 24,
    embeddings: 0,
    totalEmbeddings: 24,
    fileSize: "5.8 MB",
  },
  {
    id: "5",
    name: "Đề kiểm tra giữa kỳ.pdf",
    chapter: "Chương 4.1",
    type: "PDF",
    date: "25/03/2025",
    status: "error",
    progress: 0,
    currentStage: "uploading",
    chunks: 0,
    totalChunks: 0,
    embeddings: 0,
    totalEmbeddings: 0,
    fileSize: "3.2 MB",
    errorMessage: "File corrupted: unable to parse PDF structure",
  },
  {
    id: "6",
    name: "Slide W05 — Kiến trúc.pptx",
    chapter: "Chương 5.1",
    type: "PPTX",
    date: "26/03/2025",
    status: "indexed",
    progress: 100,
    currentStage: "indexed",
    chunks: 28,
    totalChunks: 28,
    embeddings: 28,
    totalEmbeddings: 28,
    fileSize: "7.3 MB",
  },
];

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
    uploading: { label: "Đang tải", icon: UploadCloud, color: "text-primary" },
    parsing: { label: "Đang phân tích", icon: Loader2, color: "text-accent-foreground" },
    chunking: { label: "Đang chia nhỏ", icon: Layers, color: "text-accent-foreground" },
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

export function DocumentsView() {
  const [drag, setDrag] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const chapterOptions = [
    "Chương 1.1",
    "Chương 1.2",
    "Chương 2.1",
    "Chương 2.2",
    "Chương 2.3",
    "Chương 3.1",
    "Chương 3.2",
    "Chương 4.1",
    "Chương 4.2",
    "Chương 5.1",
    "Chương 5.2",
  ];

  const simulateUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadStage("uploading");

    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setUploadStage("parsing");
          setTimeout(() => {
            setUploadStage("chunking");
            setTimeout(() => {
              setUploadStage("embedding");
              setTimeout(() => {
                setUploadStage("indexed");
                setIsUploading(false);
                setSelectedFile(null);
              }, 4000);
            }, 3000);
          }, 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleStartUpload = () => {
    if (selectedFile) {
      simulateUpload(selectedFile);
    }
  };

  return (
    <div className="scrollbar-thin h-[calc(100vh-3.5rem)] overflow-y-auto">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Tài liệu môn học</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Kỹ thuật Phần mềm · 12 tài liệu · 248 chunks · 248 embeddings
            </p>
          </div>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
          className={`group relative overflow-hidden rounded-3xl border-2 border-dashed p-10 text-center transition-all ${
            drag
              ? "border-primary bg-primary-soft"
              : "border-border bg-gradient-to-br from-primary-soft/40 via-card to-accent-soft/40"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.pptx"
            onChange={handleFileInputChange}
            className="hidden"
          />
          {selectedFile ? (
            <div className="space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-card shadow-soft">
                <FileText className="h-7 w-7 text-primary" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">{selectedFile.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · {selectedFile.type || "Unknown"}
                </p>
              </div>
              {!isUploading && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-foreground">Chọn chương:</label>
                  <select
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">-- Chọn chương --</option>
                    {chapterOptions.map((chapter) => (
                      <option key={chapter} value={chapter}>
                        {chapter}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {isUploading ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {uploadStage === "uploading" && "Đang tải lên..."}
                      {uploadStage === "parsing" && "Đang phân tích văn bản..."}
                      {uploadStage === "chunking" && "Đang chia nhỏ dữ liệu..."}
                      {uploadStage === "embedding" && "Đang tạo vector embeddings..."}
                      {uploadStage === "indexed" && "Hoàn tất!"}
                    </span>
                    <span className="tabular-nums text-foreground">{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleStartUpload}
                    disabled={!selectedChapter}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-soft hover:opacity-90 disabled:opacity-40 disabled:shadow-none"
                  >
                    <UploadCloud className="h-4 w-4" />
                    Bắt đầu tải lên
                  </button>
                  <button
                    onClick={handleChooseFile}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2 text-sm font-medium text-foreground shadow-soft hover:bg-muted"
                  >
                    Chọn tệp khác
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-card shadow-soft">
                <UploadCloud className="h-7 w-7 text-primary" strokeWidth={1.75} />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                Kéo & thả tài liệu vào đây
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Hỗ trợ PDF, DOCX, PPTX · Tối đa 50MB / file
              </p>
              <button
                onClick={handleChooseFile}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-soft hover:opacity-90"
              >
                <UploadCloud className="h-4 w-4" />
                Chọn tệp từ máy
              </button>
            </>
          )}
        </div>

        {/* Pipeline status */}
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            {
              label: "Upload",
              value: docs.filter((d) => d.status === "uploading" || d.status === "parsing").length,
              icon: UploadCloud,
              tone: "primary",
            },
            {
              label: "Chunking",
              value: docs.filter((d) => d.status === "chunking").length,
              icon: Layers,
              tone: "accent",
            },
            {
              label: "Embedding",
              value: docs.filter((d) => d.status === "embedding").length,
              icon: Loader2,
              tone: "primary",
            },
            {
              label: "Đã index",
              value: docs.filter((d) => d.status === "indexed").length,
              icon: CheckCircle2,
              tone: "secondary",
            },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{s.label}</span>
                <s.icon
                  className={`h-4 w-4 ${s.tone === "secondary" ? "text-secondary-foreground" : s.tone === "accent" ? "text-accent-foreground" : "text-primary"}`}
                />
              </div>
              <div className="mt-1 text-2xl font-semibold text-foreground">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 shadow-soft sm:max-w-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Tìm tài liệu…"
              className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            {["Tất cả", "PDF", "DOCX", "PPTX"].map((t, i) => (
              <button
                key={t}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  i === 0
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {t}
              </button>
            ))}
            <button className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted">
              <Filter className="h-3.5 w-3.5" />
              Lọc
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Tài liệu</th>
                <th className="px-3 py-3 font-medium">Chương</th>
                <th className="px-3 py-3 font-medium">Định dạng</th>
                <th className="px-3 py-3 font-medium">Ngày</th>
                <th className="px-3 py-3 font-medium">Chunk / Emb</th>
                <th className="px-3 py-3 font-medium">Trạng thái</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody>
              {docs.map((d) => {
                const s = statusConfig[d.status];
                const Icon = s.icon;
                return (
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
                    <td className="px-3 py-3.5 text-muted-foreground">{d.chapter}</td>
                    <td className="px-3 py-3.5">
                      <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {d.type}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-muted-foreground">{d.date}</td>
                    <td className="px-3 py-3.5 text-muted-foreground">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span>Chunks:</span>
                          <span className="tabular-nums font-medium text-foreground">
                            {d.chunks}/{d.totalChunks}
                          </span>
                        </div>
                        {d.status === "chunking" && d.totalChunks > 0 && (
                          <div className="h-1 w-full max-w-16 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-accent-foreground"
                              style={{ width: `${(d.chunks / d.totalChunks) * 100}%` }}
                            />
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs">
                          <span>Emb:</span>
                          <span className="tabular-nums font-medium text-foreground">
                            {d.embeddings}/{d.totalEmbeddings}
                          </span>
                        </div>
                        {d.status === "embedding" && d.totalEmbeddings > 0 && (
                          <div className="h-1 w-full max-w-16 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${(d.embeddings / d.totalEmbeddings) * 100}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${s.class}`}
                        >
                          <Icon
                            className={`h-3 w-3 ${d.status === "embedding" || d.status === "chunking" ? "animate-spin" : ""}`}
                          />
                          {s.label}
                        </span>
                        {d.errorMessage && (
                          <p className="text-[10px] text-destructive-foreground max-w-32 truncate" title={d.errorMessage}>
                            {d.errorMessage}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <div className="flex items-center gap-1">
                        {d.status === "error" && (
                          <>
                            <button
                              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                              title="Thử lại"
                            >
                              <Loader2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/20 hover:text-destructive-foreground"
                              title="Xóa"
                            >
                              <AlertTriangle className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                        <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
