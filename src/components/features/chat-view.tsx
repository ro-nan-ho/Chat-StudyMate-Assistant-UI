"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  GraduationCap,
  Copy,
  RefreshCw,
  ThumbsUp,
  BookOpen,
  ChevronRight,
  AlertCircle,
  Paperclip,
  Mic,
  Quote,
  Bookmark,
  ArrowUpRight,
  Hash,
  Clock,
  Target,
  Sparkles,
  History,
} from "lucide-react";

type Citation = {
  doc: string;
  chapter: string;
  page: string;
  excerpt: string;
  score: number;
  tone: "primary" | "accent" | "secondary" | "peach";
  chunkId?: string;
  distance?: number;
};

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  time?: string;
  summary?: string;
  bullets?: string[];
  citations?: Citation[];
  outOfScope?: boolean;
  tokens?: number;
  processingTime?: number;
  chunksRetrieved?: number;
  similarityRange?: string;
  modelUsed?: string;
  stages?: {
    embedding: { completed: boolean; duration: number };
    searching: { completed: boolean; duration: number; chunksFound: number };
    generating: { completed: boolean; duration: number };
  };
  errorType?: "API timeout" | "No relevant chunks found" | "Rate limit exceeded";
  errorMessage?: string;
  searchChapter?: string;
};

const seedMessages: Message[] = [
  {
    id: "m1",
    role: "user",
    content: "UML là gì và dùng để làm gì trong kỹ thuật phần mềm?",
    time: "14:32",
  },
  {
    id: "m2",
    role: "bot",
    content: "",
    time: "14:32",
    tokens: 312,
    processingTime: 2.8,
    chunksRetrieved: 4,
    similarityRange: "0.81-0.92",
    modelUsed: "Gemini 1.5 Flash",
    summary:
      "UML (Unified Modeling Language) là ngôn ngữ mô hình hoá trực quan tiêu chuẩn dùng để mô tả, đặc tả và tài liệu hoá các thành phần của hệ thống phần mềm.",
    bullets: [
      "Cung cấp tập hợp các sơ đồ chuẩn: use case, class, sequence, activity, state, deployment.",
      "Giúp các bên liên quan (PM, dev, QA) có chung một ngôn ngữ trao đổi thiết kế.",
      "Hỗ trợ phân tích yêu cầu, thiết kế kiến trúc và sinh tài liệu kỹ thuật.",
    ],
    citations: [
      {
        doc: "Giáo trình KTPM.pdf",
        chapter: "Chương 4 — Mô hình hoá",
        page: "tr. 78",
        excerpt:
          "UML là ngôn ngữ mô hình hoá thống nhất, cung cấp ký pháp đồ hoạ để biểu diễn các khía cạnh của hệ thống phần mềm…",
        score: 0.92,
        tone: "primary",
        chunkId: "chunk_089",
        distance: 0.12,
      },
      {
        doc: "Slide bài giảng W04.pptx",
        chapter: "Slide 12",
        page: "—",
        excerpt:
          "Các loại sơ đồ UML phổ biến gồm 13 loại, chia thành hai nhóm: cấu trúc và hành vi.",
        score: 0.81,
        tone: "accent",
        chunkId: "chunk_142",
        distance: 0.23,
      },
    ],
  },
];

export function ChatView() {
  const [messages, setMessages] = useState<Message[]>(seedMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ragStage, setRagStage] = useState<"embedding" | "searching" | "generating" | "citing" | null>(null);
  const [ragProgress, setRagProgress] = useState(0);
  const [chunksFound, setChunksFound] = useState(0);
  const [selectedChapter, setSelectedChapter] = useState<string>("all");
  const [selectedSubChapter, setSelectedSubChapter] = useState<string>("");
  const endRef = useRef<HTMLDivElement>(null);

  const chapterOptions = [
    { value: "all", label: "Tất cả chương" },
    { value: "ch1", label: "Chương 1" },
    { value: "ch2", label: "Chương 2" },
    { value: "ch3", label: "Chương 3" },
    { value: "ch4", label: "Chương 4" },
    { value: "ch5", label: "Chương 5" },
  ];

  const subChapterOptions = selectedChapter && selectedChapter !== "all"
    ? Array.from({ length: 5 }, (_, i) => (i + 1).toString())
    : [];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const simulateRAGPipeline = () => {
    setRagStage("embedding");
    setRagProgress(0);

    const embeddingInterval = setInterval(() => {
      setRagProgress((prev) => {
        if (prev >= 25) {
          clearInterval(embeddingInterval);
          setRagStage("searching");
          setChunksFound(0);

          const searchingInterval = setInterval(() => {
            setChunksFound((prev) => {
              if (prev >= 5) {
                clearInterval(searchingInterval);
                setRagStage("generating");
                setRagProgress(50);

                const generatingInterval = setInterval(() => {
                  setRagProgress((prev) => {
                    if (prev >= 90) {
                      clearInterval(generatingInterval);
                      setRagStage("citing");

                      setTimeout(() => {
                        setRagStage(null);
                        setRagProgress(100);
                      }, 300);
                    }
                    return prev + 10;
                  });
                }, 200);
              }
              return prev + 1;
            });
          }, 150);
        }
        return prev + 5;
      });
    }, 100);
  };

  function send(text: string) {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text, time: now };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);
    simulateRAGPipeline();

    setTimeout(() => {
      const lower = text.toLowerCase();
      const outOfScope = /thời tiết|bóng đá|nấu ăn|crypto/.test(lower);
      const bot: Message = outOfScope
        ? { id: crypto.randomUUID(), role: "bot", content: "", time: now, outOfScope: true }
        : {
            id: crypto.randomUUID(),
            role: "bot",
            content: "",
            time: now,
            tokens: 184,
            processingTime: 3.8,
            chunksRetrieved: 5,
            similarityRange: "0.82-0.95",
            modelUsed: "Gemini 1.5 Flash",
            searchChapter: selectedChapter === "all"
              ? undefined
              : selectedSubChapter
                ? `${chapterOptions.find((c) => c.value === selectedChapter)?.label}.${selectedSubChapter}`
                : chapterOptions.find((c) => c.value === selectedChapter)?.label,
            summary:
              "Dưới đây là tổng hợp ngắn gọn dựa trên các tài liệu đã được index trong môn học.",
            bullets: [
              "Khái niệm cốt lõi được trình bày trong chương liên quan của giáo trình.",
              "Các slide bài giảng minh hoạ ví dụ áp dụng vào dự án thực tế.",
              "Có thể đối chiếu thêm với phần bài tập để hiểu sâu hơn.",
            ],
            citations: [
              {
                doc: "Giáo trình KTPM.pdf",
                chapter: "Chương 2",
                page: "tr. 34",
                excerpt:
                  "Phần này trình bày chi tiết khái niệm liên quan và ngữ cảnh áp dụng trong quy trình phát triển phần mềm…",
                score: 0.88,
                tone: "secondary",
                chunkId: "chunk_142",
                distance: 0.18,
              },
            ],
          };
      setMessages((m) => [...m, bot]);
      setLoading(false);
      setRagStage(null);
      setRagProgress(0);
      setChunksFound(0);
    }, 3800);
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Chat column */}
      <section className="flex min-h-0 flex-1 flex-col">
        <div className="scrollbar-thin flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl px-6 py-8">
            {/* Hero header */}
            <div className="mb-10 grain relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary-soft via-card to-accent-soft p-6">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/30 blur-3xl" />
              <div className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-secondary/30 blur-3xl" />
              <div className="relative flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-accent to-secondary text-primary-foreground shadow-pop">
                    <GraduationCap className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-background bg-secondary text-[9px] tabular-nums font-semibold text-secondary-foreground">
                    SE
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[10px] tabular-nums uppercase tracking-[0.15em] text-muted-foreground">
                    <span className="h-1 w-1 rounded-full bg-primary" />
                    Trợ lý môn học · Phiên #042
                  </div>
                  <h1 className="mt-1 text-2xl leading-tight text-foreground">
                    Chào Minh An, hôm nay <span className="text-primary-deep">cần tra cứu</span> gì
                    nào?
                  </h1>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    Mình trả lời dựa trên 12 tài liệu đã index của môn{" "}
                    <span className="font-medium text-foreground">Kỹ thuật Phần mềm</span>. Mỗi câu
                    trả lời đều kèm trích dẫn rõ ràng.
                  </p>
                  {messages.length > 2 && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex items-center gap-1.5 rounded-full bg-card px-2.5 py-1 shadow-soft">
                        <History className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">
                          Context from {Math.min(messages.length - 1, 5)} messages
                        </span>
                        <button
                          className="ml-1 text-[10px] text-primary hover:underline"
                          onClick={() => setMessages([seedMessages[0]])}
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-7">
              {messages.map((m) => (
                <div key={m.id} className="animate-fade-in-up">
                  {m.role === "user" ? <UserBubble m={m} /> : <BotBubble message={m} />}
                </div>
              ))}
              {loading && <TypingIndicator ragStage={ragStage} ragProgress={ragProgress} chunksFound={chunksFound} />}
              <div ref={endRef} />
            </div>
          </div>
        </div>

        {/* Composer */}
        <div className="border-t border-border bg-gradient-to-b from-background/60 to-background px-6 py-4 backdrop-blur">
          <div className="mx-auto w-full max-w-3xl">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Tìm kiếm từ:</span>
              <select
                value={selectedChapter}
                onChange={(e) => {
                  setSelectedChapter(e.target.value);
                  setSelectedSubChapter("");
                }}
                className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {chapterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {selectedChapter && selectedChapter !== "all" && (
                <select
                  value={selectedSubChapter}
                  onChange={(e) => setSelectedSubChapter(e.target.value)}
                  className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="">-- Chọn chương con --</option>
                  {subChapterOptions.map((subChapter) => (
                    <option key={subChapter} value={subChapter}>
                      {subChapter}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="group flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-soft transition-all focus-within:border-primary/50 focus-within:shadow-pop focus-within:ring-4 focus-within:ring-primary/10"
            >
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                placeholder="Hỏi điều gì đó về tài liệu môn học…"
                className="max-h-40 flex-1 resize-none bg-transparent px-1 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary px-3.5 text-[13px] font-medium text-primary-foreground shadow-soft transition-all hover:shadow-pop disabled:opacity-40 disabled:shadow-none"
              >
                <Send className="h-3.5 w-3.5" />
                Gửi
              </button>
            </form>
            <div className="mt-2 flex items-center justify-between px-1 text-[10px] text-muted-foreground">
              <span className="tabular-nums">Shift + ↵ xuống dòng</span>
              <span>Câu trả lời tạo từ tài liệu đã index. Luôn kiểm tra trích dẫn.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function UserBubble({ m }: { m: Message }) {
  return (
    <div className="flex justify-end gap-3">
      <div className="max-w-[80%]">
        <div className="rounded-2xl rounded-tr-md border border-primary/15 bg-primary-soft px-4 py-3 text-sm text-foreground shadow-soft">
          {m.content}
        </div>
        <div className="mt-1 flex justify-end gap-2 text-[10px] tabular-nums text-muted-foreground">
          <span>{m.time}</span>
          <span>· bạn</span>
        </div>
      </div>
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-primary text-[10px] font-semibold text-primary-foreground">
        MA
      </div>
    </div>
  );
}

const toneMap = {
  primary: { bg: "bg-primary-soft", text: "text-primary-deep", chip: "bg-primary/15" },
  accent: { bg: "bg-accent-soft", text: "text-accent-foreground", chip: "bg-accent/20" },
  secondary: {
    bg: "bg-secondary-soft",
    text: "text-secondary-foreground",
    chip: "bg-secondary/25",
  },
  peach: { bg: "bg-peach-soft", text: "text-foreground", chip: "bg-peach/25" },
};

function BotBubble({ message }: { message: Message }) {
  return (
    <div className="flex gap-3">
      <div className="relative mt-1 shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-accent to-secondary text-primary-foreground">
          <GraduationCap className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-center gap-2 text-[10px] tabular-nums text-muted-foreground">
          <span className="font-semibold text-foreground/70">StudyMate</span>
          <span>·</span>
          <span>{message.time}</span>
          {message.searchChapter && (
            <>
              <span>·</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-1.5 py-0.5 text-accent-foreground">
                <BookOpen className="h-2.5 w-2.5" />
                {message.searchChapter}
              </span>
            </>
          )}
          {message.tokens && (
            <>
              <span>·</span>
              <span>{message.tokens} tokens</span>
            </>
          )}
          {message.processingTime && (
            <>
              <span>·</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-muted-foreground">
                <Clock className="h-2.5 w-2.5" />
                {message.processingTime}s
              </span>
            </>
          )}
          {message.chunksRetrieved && (
            <>
              <span>·</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-muted-foreground">
                <Hash className="h-2.5 w-2.5" />
                {message.chunksRetrieved} chunks
              </span>
            </>
          )}
          {message.similarityRange && (
            <>
              <span>·</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-muted-foreground">
                <Target className="h-2.5 w-2.5" />
                {message.similarityRange}
              </span>
            </>
          )}
          {message.modelUsed && (
            <>
              <span>·</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-1.5 py-0.5 text-primary-deep">
                <Sparkles className="h-2.5 w-2.5" />
                {message.modelUsed}
              </span>
            </>
          )}
          {message.citations && (
            <>
              <span>·</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary-soft px-1.5 py-0.5 text-secondary-foreground">
                <BookOpen className="h-2.5 w-2.5" />
                {message.citations.length} nguồn
              </span>
            </>
          )}
        </div>

        <div className="relative rounded-2xl rounded-tl-md border border-border bg-card p-5 shadow-soft">
          {message.errorType ? (
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-destructive/20">
                <AlertCircle className="h-4.5 w-4.5 text-destructive-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-base font-medium text-foreground">{message.errorType}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {message.errorMessage || "Có lỗi xảy ra khi xử lý yêu cầu của bạn."}
                </p>
                <div className="mt-3 flex gap-2">
                  <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90">
                    <RefreshCw className="h-3 w-3" />
                    Thử lại
                  </button>
                  <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
                    <AlertCircle className="h-3 w-3" />
                    Báo cáo vấn đề
                  </button>
                </div>
              </div>
            </div>
          ) : message.outOfScope ? (
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-warning/30">
                <AlertCircle className="h-4.5 w-4.5 text-warning-foreground" />
              </div>
              <div className="text-sm text-foreground">
                <p className="text-base">Nằm ngoài phạm vi tài liệu.</p>
                <p className="mt-1.5 text-muted-foreground">
                  Trợ lý chỉ trả lời dựa trên tài liệu đã được index. Bạn có thể hỏi lại theo nội
                  dung của môn học — ví dụ về kiến trúc phần mềm, UML, quy trình phát triển…
                </p>
              </div>
            </div>
          ) : (
            <>
              {message.summary && (
                <div className="relative">
                  <Quote
                    className="absolute -left-1 -top-1 h-4 w-4 text-primary/40"
                    strokeWidth={2.5}
                  />
                  <p className="pl-5 text-[15px] leading-relaxed text-foreground">
                    {message.summary}
                  </p>
                </div>
              )}
              {message.bullets && (
                <div className="mt-4 space-y-2.5 border-l-2 border-dashed border-border pl-4 text-sm text-foreground">
                  {message.bullets.map((b, i) => (
                    <div key={i} className="flex gap-2.5">
                      <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-md bg-muted tabular-nums text-[9px] font-semibold text-muted-foreground">
                        {i + 1}
                      </span>
                      <span className="text-foreground/90">{b}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {message.citations && message.citations.length > 0 && (
          <div className="mt-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] tabular-nums uppercase tracking-[0.12em] text-muted-foreground">
                <BookOpen className="h-3 w-3" />
                Nguồn trích dẫn
              </div>
              <button className="text-[10px] text-muted-foreground hover:text-foreground">
                Mở tất cả →
              </button>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {message.citations.map((c, i) => (
                <CitationCard key={i} c={c} index={i + 1} />
              ))}
            </div>
          </div>
        )}

        {!message.outOfScope && (
          <div className="mt-3 flex items-center gap-1 text-muted-foreground">
            <ActionBtn icon={Copy} label="Sao chép" />
            <ActionBtn icon={RefreshCw} label="Tạo lại" />
            <ActionBtn icon={ThumbsUp} label="Hữu ích" />
            <ActionBtn icon={Bookmark} label="Lưu" />
          </div>
        )}
      </div>
    </div>
  );
}

function CitationCard({ c, index }: { c: Citation; index: number }) {
  const t = toneMap[c.tone];
  return (
    <a
      className={`group relative block overflow-hidden rounded-2xl border border-border ${t.bg} p-3.5 transition-all hover:shadow-soft hover:-translate-y-0.5`}
    >
      <div className="absolute right-2 top-2">
        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`flex h-6 w-6 items-center justify-center rounded-lg bg-card tabular-nums text-[10px] font-bold ${t.text} shadow-soft`}
        >
          {index.toString().padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <div className="line-clamp-1 text-xs font-semibold text-foreground">{c.doc}</div>
          <div className="text-[10px] text-muted-foreground">
            {c.chapter} · {c.page}
          </div>
        </div>
      </div>
      <p className="line-clamp-2 text-[12.5px] leading-snug text-foreground/85">"{c.excerpt}"</p>
      <div className="mt-2.5 flex items-center justify-between">
        <div className={`flex items-center gap-1.5 rounded-full ${t.chip} px-2 py-0.5`}>
          <span className="h-1 w-1 rounded-full bg-current opacity-60" />
          <span className={`text-[10px] tabular-nums font-medium ${t.text}`}>
            relevance {(c.score * 100).toFixed(0)}%
          </span>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`h-1 w-2 rounded-sm ${i < Math.round(c.score * 5) ? "bg-foreground/60" : "bg-foreground/15"}`}
            />
          ))}
        </div>
      </div>
      {(c.chunkId || c.distance !== undefined) && (
        <div className="mt-2 flex items-center gap-2 text-[9px] text-muted-foreground">
          {c.chunkId && (
            <span className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5">
              <Hash className="h-2 w-2" />
              {c.chunkId}
            </span>
          )}
          {c.distance !== undefined && (
            <span className="inline-flex items-center gap-1 rounded bg-muted px-1.5 py-0.5">
              <Target className="h-2 w-2" />
              dist: {c.distance.toFixed(2)}
            </span>
          )}
        </div>
      )}
    </a>
  );
}

function ActionBtn({ icon: Icon, label }: { icon: typeof Copy; label: string }) {
  return (
    <button className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] hover:bg-muted hover:text-foreground">
      <Icon className="h-3 w-3" />
      {label}
    </button>
  );
}

function TypingIndicator({ ragStage, ragProgress, chunksFound }: { ragStage: "embedding" | "searching" | "generating" | "citing" | null; ragProgress: number; chunksFound: number }) {
  const stages = [
    { key: "embedding", label: "Embedding", icon: "🔄" },
    { key: "searching", label: "Searching", icon: "🔍" },
    { key: "generating", label: "Generating", icon: "✨" },
    { key: "citing", label: "Citing", icon: "📚" },
  ];

  const currentStageIndex = stages.findIndex((s) => s.key === ragStage);

  return (
    <div className="flex gap-3">
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-accent to-secondary text-primary-foreground">
        <GraduationCap className="h-3.5 w-3.5 animate-pulse" />
      </div>
      <div className="rounded-2xl rounded-tl-md border border-border bg-card px-4 py-3 shadow-soft">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-secondary" />
            </div>
            <span className="tabular-nums text-[10px]">
              {ragStage === "embedding" && "Converting question to vector..."}
              {ragStage === "searching" && `Searching 248 chunks... Found ${chunksFound}`}
              {ragStage === "generating" && "Generating response with Gemini..."}
              {ragStage === "citing" && "Extracting citations..."}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {stages.map((stage, index) => (
              <div key={stage.key} className="flex items-center gap-1.5">
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    index < currentStageIndex
                      ? "bg-primary"
                      : index === currentStageIndex
                      ? "bg-primary animate-pulse"
                      : "bg-muted"
                  }`}
                />
                <span
                  className={`text-[10px] ${
                    index <= currentStageIndex ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            ))}
          </div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${ragProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
