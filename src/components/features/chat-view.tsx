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
} from "lucide-react";

type Citation = {
  doc: string;
  chapter: string;
  page: string;
  excerpt: string;
  score: number;
  tone: "primary" | "accent" | "secondary" | "peach";
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
};

const quickQuestions = [
  { q: "Tóm tắt chương 1", tag: "Ch.01" },
  { q: "UML là gì?", tag: "Ch.04" },
  { q: "So sánh use case và class diagram", tag: "Ch.04" },
  { q: "Giải thích kiến trúc phần mềm", tag: "Ch.05" },
  { q: "Lấy ví dụ từ tài liệu", tag: "All" },
];

const recentSessions = [
  { id: "1", title: "Chương 3 — Phân tích yêu cầu", time: "2 giờ", msgs: 14, active: true },
  { id: "2", title: "MVC vs MVVM khác nhau ra sao?", time: "Hôm qua", msgs: 22 },
  { id: "3", title: "Tóm tắt kiến trúc microservices", time: "2 ngày", msgs: 9 },
];

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
      },
      {
        doc: "Slide bài giảng W04.pptx",
        chapter: "Slide 12",
        page: "—",
        excerpt:
          "Các loại sơ đồ UML phổ biến gồm 13 loại, chia thành hai nhóm: cấu trúc và hành vi.",
        score: 0.81,
        tone: "accent",
      },
    ],
  },
];

export function ChatView() {
  const [messages, setMessages] = useState<Message[]>(seedMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function send(text: string) {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text, time: now };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

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
              },
            ],
          };
      setMessages((m) => [...m, bot]);
      setLoading(false);
    }, 900);
  }

  return (
    <div className="grid h-[calc(100vh-3.5rem)] grid-cols-1 lg:grid-cols-[280px_1fr]">
      {/* Left panel */}
      <aside className="scrollbar-thin hidden overflow-y-auto border-r border-border bg-background/40 lg:flex lg:flex-col">
        {/* Session group */}
        <div className="px-5 pt-6">
          <div className="flex items-baseline justify-between">
            <h3 className="text-base text-foreground">Phiên gần đây</h3>
            <button className="text-[11px] text-muted-foreground hover:text-foreground">
              Xem tất cả →
            </button>
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-1.5 px-3">
          {recentSessions.map((s) => (
            <button
              key={s.id}
              className={`group relative flex flex-col items-start gap-1 rounded-2xl border px-3.5 py-3 text-left transition-all ${
                s.active
                  ? "border-primary/30 bg-card shadow-soft"
                  : "border-transparent hover:border-border hover:bg-card/60"
              }`}
            >
              {s.active && (
                <span className="absolute right-3 top-3 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary" />
                </span>
              )}
              <span className="line-clamp-1 text-[13px] font-medium text-foreground">
                {s.title}
              </span>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <span className="tabular-nums">{s.time}</span>
                <span className="h-0.5 w-0.5 rounded-full bg-muted-foreground/50" />
                <span>{s.msgs} tin nhắn</span>
              </div>
            </button>
          ))}
        </div>

        {/* Quick prompts */}
        <div className="mt-7 px-5">
          <h3 className="text-base text-foreground">Gợi ý câu hỏi</h3>
        </div>
        <div className="mt-3 flex flex-col gap-1.5 px-3 pb-6">
          {quickQuestions.map((q) => (
            <button
              key={q.q}
              onClick={() => send(q.q)}
              className="group flex items-center gap-2 rounded-xl border border-transparent px-2.5 py-2 text-left text-xs hover:border-border hover:bg-card"
            >
              <span className="rounded-md bg-muted px-1.5 py-0.5 tabular-nums text-[9px] text-muted-foreground group-hover:bg-primary-soft group-hover:text-primary-deep">
                {q.tag}
              </span>
              <span className="line-clamp-1 flex-1 text-foreground/85">{q.q}</span>
              <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          ))}
        </div>

        {/* Stats card */}
        <div className="mt-auto px-4 pb-5">
          <div className="rounded-2xl border border-dashed border-border p-3.5">
            <div className="flex items-center justify-between text-[10px] tabular-nums uppercase tracking-wider text-muted-foreground">
              <span>Hôm nay</span>
              <span>22.05</span>
            </div>
            <div className="mt-2 flex items-end justify-between">
              <div>
                <div className="text-2xl text-foreground">14</div>
                <div className="text-[10px] text-muted-foreground">câu đã hỏi</div>
              </div>
              <div className="flex items-end gap-0.5">
                {[3, 5, 2, 7, 4, 6, 8].map((h, i) => (
                  <span
                    key={i}
                    className="w-1.5 rounded-sm bg-primary/70"
                    style={{ height: `${h * 3}px` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Chat column */}
      <section className="flex min-h-0 flex-col">
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
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-7">
              {messages.map((m) => (
                <div key={m.id} className="animate-fade-in-up">
                  {m.role === "user" ? <UserBubble m={m} /> : <BotBubble message={m} />}
                </div>
              ))}
              {loading && <TypingIndicator />}
              <div ref={endRef} />
            </div>
          </div>
        </div>

        {/* Composer */}
        <div className="border-t border-border bg-gradient-to-b from-background/60 to-background px-6 py-4 backdrop-blur">
          <div className="mx-auto w-full max-w-3xl">
            <div className="marquee-fade mb-3 flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {quickQuestions.map((q) => (
                <button
                  key={q.q}
                  onClick={() => send(q.q)}
                  className="group flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:bg-primary-soft hover:text-foreground"
                >
                  <Hash className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
                  {q.q}
                </button>
              ))}
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
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Mic className="h-4 w-4" />
              </button>
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
          {message.tokens && (
            <>
              <span>·</span>
              <span>{message.tokens} tokens</span>
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
          {message.outOfScope ? (
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

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-accent to-secondary text-primary-foreground">
        <GraduationCap className="h-3.5 w-3.5 animate-pulse" />
      </div>
      <div className="rounded-2xl rounded-tl-md border border-border bg-card px-4 py-3 shadow-soft">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-secondary" />
          </div>
          <span className="tabular-nums text-[10px]">tra cứu 248 chunks…</span>
        </div>
      </div>
    </div>
  );
}
