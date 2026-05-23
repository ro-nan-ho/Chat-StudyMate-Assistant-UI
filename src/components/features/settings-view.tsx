export function SettingsView() {
  return (
    <div className="scrollbar-thin h-[calc(100vh-3.5rem)] overflow-y-auto">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="text-2xl font-semibold text-foreground">Cài đặt</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Quản lý môn học, mô hình embedding và guardrails.
        </p>

        <div className="mt-6 space-y-4">
          <Section title="Môn học" desc="Tên môn học hiển thị trong header và đầu mỗi câu trả lời.">
            <input
              defaultValue="Kỹ thuật Phần mềm"
              className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10"
            />
          </Section>

          <Section title="Mô hình embedding" desc="Mô hình dùng để vector hoá tài liệu và câu hỏi.">
            <select className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10">
              <option>gemini-embedding-001 (3072)</option>
              <option>text-embedding-3-small (1536)</option>
              <option>text-embedding-3-large (3072)</option>
            </select>
          </Section>

          <Section title="Guardrails" desc="Chỉ trả lời dựa trên tài liệu đã được index.">
            <Toggle label="Từ chối câu hỏi ngoài phạm vi" defaultOn />
            <Toggle label="Yêu cầu trích dẫn cho mọi câu trả lời" defaultOn />
            <Toggle label="Hiển thị mức độ liên quan của citation" defaultOn />
          </Section>

          <Section title="Vùng nguy hiểm" desc="Xoá toàn bộ index và bắt đầu lại.">
            <button className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/20">
              Xoá toàn bộ index
            </button>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
      <div className="mt-4 space-y-2">{children}</div>
    </div>
  );
}

function Toggle({ label, defaultOn }: { label: string; defaultOn?: boolean }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl bg-muted/40 px-3 py-2.5 text-sm text-foreground">
      {label}
      <span
        className={`relative h-5 w-9 rounded-full transition-colors ${defaultOn ? "bg-primary" : "bg-muted"}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-card shadow-soft transition-transform ${defaultOn ? "translate-x-4" : "translate-x-0.5"}`}
        />
      </span>
    </label>
  );
}
