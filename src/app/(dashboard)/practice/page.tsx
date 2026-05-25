"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Sparkles, Brain, CheckCircle2, Loader2, Target, Hash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function PracticePage() {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState("");
  const [questionCount, setQuestionCount] = useState<number | string>(10);

  const handleGenerate = async () => {
    if (!selectedChapter) return;
    setIsGenerating(true);
    // Simulate API call to backend, activating LLM to generate quiz (Workflow 3)
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setIsGenerating(false);
    const countParam = Number(questionCount) || 10;
    router.push(`/practice/quiz?chapter=${selectedChapter}&count=${countParam}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 animate-fade-in-up">
      <div className="mb-10 text-center space-y-4 relative">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
        <h1 className="text-4xl font-extrabold tracking-tight gradient-text">
          Luyện Tập Thông Minh
        </h1>
        <p className="text-lg text-muted-foreground w-full max-w-2xl mx-auto">
          Ứng dụng trí tuệ nhân tạo để tự động tạo bài trắc nghiệm và flashcard, giúp bạn ôn luyện kiến thức nhanh chóng và ghi nhớ sâu hơn.
        </p>
      </div>

      <div className="max-w-xl mx-auto relative z-10">
        <Card className="border-border/50 shadow-soft overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
          <CardHeader>
            <div className="mb-4 bg-primary/10 p-4 rounded-2xl w-fit ring-1 ring-primary/20">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Sinh Bài Trắc Nghiệm</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Tạo bộ câu hỏi trắc nghiệm khách quan mới nhất dựa trên tài liệu đã học. Hãy chọn chương để bắt đầu.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> Mục tiêu ôn tập
              </label>
              <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                <SelectTrigger className="h-12 text-base rounded-xl bg-muted/50 border-border/50 focus:ring-primary focus:border-primary transition-all">
                  <SelectValue placeholder="Chọn nội dung ôn tập..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="1">Chương 1: Tổng quan</SelectItem>
                  <SelectItem value="2">Chương 2: Cơ sở lý thuyết</SelectItem>
                  <SelectItem value="3">Chương 3: Phân tích thiết kế</SelectItem>
                  <SelectItem value="4">Toàn bộ môn học (Trộn ngẫu nhiên)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Hash className="w-4 h-4 text-primary" /> Số lượng câu hỏi
              </label>
              <Input
                type="number"
                min={5}
                max={50}
                value={questionCount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestionCount(e.target.value)}
                className="h-12 px-4 shadow-sm bg-muted/50 focus-visible:ring-primary focus-visible:bg-white transition-all text-base rounded-xl"
                placeholder="Ví dụ: 15"
              />
              <p className="text-xs text-muted-foreground">
                Tạo càng nhiều câu hỏi, thời gian gen càng lâu (khoảng 2-3s cho 10 câu). Giới hạn tối đa 50 câu.
              </p>
            </div>

            <div className="bg-muted/40 rounded-xl p-4 border border-border/50 space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Hệ thống sẽ thực hiện:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Tập hợp các đoạn kiến thức liên quan
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> AI Đóng vai chuyên gia ra {Number(questionCount) || 10} câu hỏi
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Kèm theo giải thích cực kỳ chi tiết
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full h-12 text-base font-bold shadow-soft rounded-xl hover:shadow-pop transition-all group overflow-hidden relative"
              disabled={!selectedChapter || isGenerating}
              onClick={handleGenerate}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  AI đang phân tích kiến thức...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2 text-primary-foreground/70 group-hover:text-primary-foreground transition-all" />
                  Bắt đầu tạo bài tập
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform hidden group-hover:block" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
