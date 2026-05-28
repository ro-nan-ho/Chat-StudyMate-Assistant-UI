"use client";

import { CheckCircle2, XCircle, AlertCircle, Clock, BookOpen, ArrowRight, TrendingUp, Target, Award } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Status = "correct" | "wrong" | "review" | "pending";

const stats = {
  total: 50,
  correct: 38,
  wrong: 5,
  review: 4,
  pending: 3,
  acc: 76,
};

const recentQuizzes = [
  {
    id: "1",
    chapter: "Chương 3: Phân tích thiết kế",
    date: "2 giờ trước",
    score: 85,
    questions: 10,
  },
  {
    id: "2",
    chapter: "Chương 2: Cơ sở lý thuyết",
    date: "Hôm qua",
    score: 72,
    questions: 15,
  },
  {
    id: "3",
    chapter: "Chương 1: Tổng quan",
    date: "2 ngày trước",
    score: 90,
    questions: 10,
  },
];

function StatCard({ label, value, tone, icon: Icon }: { label: string; value: string | number; tone: "primary" | "secondary" | "destructive" | "warning" | "muted"; icon: any }) {
  const toneClass = {
    primary: "bg-primary-soft text-primary-foreground",
    secondary: "bg-secondary-soft text-secondary-foreground",
    destructive: "bg-destructive/20 text-destructive-foreground",
    warning: "bg-warning/30 text-warning-foreground",
    muted: "bg-muted text-muted-foreground",
  }[tone];

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-2 text-2xl font-semibold text-foreground">{value}</div>
    </div>
  );
}

export function StudentPracticeView() {
  const router = useRouter();

  return (
    <div className="scrollbar-thin h-[calc(100vh-3.5rem)] overflow-y-auto">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Luyện Tập</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Theo dõi tiến độ học tập và thực hành bài kiểm tra.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
          <StatCard label="Tổng câu hỏi" value={stats.total} tone="muted" icon={Target} />
          <StatCard label="Đúng" value={stats.correct} tone="secondary" icon={CheckCircle2} />
          <StatCard label="Sai" value={stats.wrong} tone="destructive" icon={XCircle} />
          <StatCard label="Cần xem lại" value={stats.review} tone="warning" icon={AlertCircle} />
          <StatCard label="Độ chính xác" value={`${stats.acc}%`} tone="primary" icon={TrendingUp} />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_350px]">
          {/* Recent Quizzes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Bài kiểm tra gần đây</h2>
            </div>
            <div className="space-y-3">
              {recentQuizzes.map((quiz) => (
                <Card key={quiz.id} className="shadow-soft hover:shadow-pop transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-foreground">{quiz.chapter}</h3>
                          <p className="text-xs text-muted-foreground">{quiz.date} · {quiz.questions} câu</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-foreground">{quiz.score}%</div>
                        <div className="text-xs text-muted-foreground">Điểm số</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Start Practice Card */}
          <Card className="shadow-soft bg-gradient-to-br from-primary-soft/50 via-card to-accent-soft/50">
            <CardHeader>
              <div className="mb-4 bg-primary/10 p-4 rounded-2xl w-fit ring-1 ring-primary/20">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Bắt đầu luyện tập</CardTitle>
              <CardDescription className="text-sm">
                Làm bài kiểm tra để ôn luyện kiến thức và cải thiện điểm số.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full h-12 text-base font-bold shadow-soft rounded-xl hover:shadow-pop transition-all"
                onClick={() => router.push("/practice/quiz?chapter=4&count=10")}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Làm bài kiểm tra
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
