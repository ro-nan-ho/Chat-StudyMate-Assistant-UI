"use client";

import { useRouter } from "next/navigation";
import { BookOpen, Plus, FileText, Users, TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const recentQuizzes = [
  {
    id: "1",
    title: "Bài kiểm tra Chương 4 - UML",
    chapter: "Chương 4",
    date: "2 ngày trước",
    questions: 15,
    students: 28,
  },
  {
    id: "2",
    title: "Ôn tập giữa kỳ",
    chapter: "Chương 1-3",
    date: "5 ngày trước",
    questions: 20,
    students: 35,
  },
  {
    id: "3",
    title: "Kiểm tra kiến trúc phần mềm",
    chapter: "Chương 5",
    date: "1 tuần trước",
    questions: 10,
    students: 22,
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

export function TeacherPracticeView() {
  const router = useRouter();
  return (
    <div className="scrollbar-thin h-[calc(100vh-3.5rem)] overflow-y-auto">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-2xl font-semibold text-foreground">Tạo Bài Kiểm Tra</h1>
        <p className="mt-1 text-sm text-muted-foreground">Quản lý và tạo bài kiểm tra cho sinh viên.</p>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Đã tạo" value="12" tone="primary" icon={FileText} />
          <StatCard label="Sinh viên" value="45" tone="secondary" icon={Users} />
          <StatCard label="Hoàn thành" value="38" tone="primary" icon={Award} />
          <StatCard label="Điểm trung bình" value="8.2" tone="warning" icon={TrendingUp} />
        </div>

        {/* Recent Quizzes */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Bài kiểm tra gần đây</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {recentQuizzes.map((quiz) => (
              <Card
                key={quiz.id}
                className="shadow-soft hover:shadow-pop transition-shadow cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{quiz.title}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {quiz.chapter} · {quiz.date}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{quiz.questions} câu hỏi</span>
                    <span>{quiz.students} sinh viên</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Create New Quiz Card */}
        <div className="mt-8">
          <Card className="shadow-soft bg-gradient-to-br from-primary-soft/50 via-card to-accent-soft/50">
            <CardHeader>
              <div className="mb-4 bg-primary/10 p-4 rounded-2xl w-fit ring-1 ring-primary/20">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Tạo bài kiểm tra mới</CardTitle>
              <CardDescription className="text-sm">
                Tạo bài kiểm tra mới cho sinh viên dựa trên tài liệu đã học.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full h-12 text-base font-bold shadow-soft rounded-xl hover:shadow-pop transition-all"
                onClick={() => router.push("/practice")}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Bắt đầu tạo
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
