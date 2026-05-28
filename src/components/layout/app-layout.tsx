"use client";



import Link from "next/link";

import { usePathname } from "next/navigation";

import {

  MessageSquareText,

  FileText,

  History,

  Settings,

  Plus,

  Upload,

  Command,

  BookMarked,

  Search,

  ChevronDown,

  BookOpen,

  LogIn,

  LogOut,

} from "lucide-react";

import type { ReactNode } from "react";

import { useAuth } from "@/hooks/use-auth";

import {

  DropdownMenu,

  DropdownMenuContent,

  DropdownMenuItem,

  DropdownMenuTrigger,

} from "@/components/ui/dropdown-menu";



const nav = [

  { to: "/", label: "Chat", icon: MessageSquareText, end: true, badge: "12" },

  { to: "/documents", label: "Tài liệu", icon: FileText, badge: "12" },

  { to: "/practice", label: "Luyện Tập", icon: BookOpen, badge: "Mới" },

  { to: "/sessions", label: "Phiên hội thoại", icon: History, badge: "6" },

  { to: "/settings", label: "Cài đặt", icon: Settings },

];



const chapters = [

  { num: "01", title: "Tổng quan KTPM", count: 14 },

  { num: "02", title: "Quy trình phát triển", count: 22 },

  { num: "03", title: "Phân tích yêu cầu", count: 31 },

  { num: "04", title: "Mô hình hoá — UML", count: 28 },

  { num: "05", title: "Kiến trúc phần mềm", count: 19 },

];



function SidebarItem({

  to,

  label,

  icon: Icon,

  active,

  badge,

}: {

  to: string;

  label: string;

  icon: typeof MessageSquareText;

  active: boolean;

  badge?: string;

}) {

  return (

    <Link

      href={to}

      className={`group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all ${

        active

          ? "bg-card text-foreground shadow-soft"

          : "text-muted-foreground hover:bg-card/60 hover:text-foreground"

      }`}

    >

      {active && (

        <span className="absolute -left-3 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />

      )}

      <Icon

        className={`h-[17px] w-[17px] ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}

        strokeWidth={1.75}

      />

      <span className="flex-1">{label}</span>

      {badge && (

        <span

          className={`rounded-md px-1.5 py-0.5 text-[10px] tabular-nums font-medium ${

            active ? "bg-primary-soft text-primary-deep" : "bg-muted text-muted-foreground"

          }`}

        >

          {badge}

        </span>

      )}

    </Link>

  );

}



export function AppLayout({ children }: { children: ReactNode }) {

  const pathname = usePathname();

  const { signOut } = useAuth();



  return (

    <div className="flex min-h-screen w-full">

      {/* Sidebar */}

      <aside className="hidden w-[260px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar/70 backdrop-blur md:flex">

        {/* Brand */}

        <div className="px-5 pt-5 pb-4">

          <div className="flex items-center gap-2.5">

            <div className="relative">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-accent to-secondary text-primary-foreground shadow-soft">

                <BookMarked className="h-4 w-4" strokeWidth={2} />

              </div>

              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-sidebar bg-secondary" />

            </div>

            <div className="leading-tight">

              <div className="text-[15px] font-semibold tracking-tight text-foreground">

                Study<span className="font-normal text-primary-deep">Mate</span>

              </div>

              <div className="text-[10px] tabular-nums uppercase tracking-wider text-muted-foreground">

                v0.4 · RAG

              </div>

            </div>

          </div>

        </div>



        {/* Search trigger */}

        <div className="px-3 pb-3">

          <button className="group flex w-full items-center gap-2 rounded-xl border border-border bg-card/60 px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-card">

            <Search className="h-3.5 w-3.5" />

            <span className="flex-1 text-left">Tìm mọi thứ…</span>

            <kbd className="inline-flex items-center gap-0.5 rounded-md border border-border bg-background px-1.5 py-0.5 tabular-nums text-[10px]">

              <Command className="h-2.5 w-2.5" />K

            </kbd>

          </button>

        </div>



        <nav className="flex flex-col gap-0.5 px-3">

          {nav.map((n) => (

            <SidebarItem

              key={n.to}

              to={n.to}

              label={n.label}

              icon={n.icon}

              badge={n.badge}

              active={n.end ? pathname === n.to : pathname.startsWith(n.to)}

            />

          ))}

        </nav>



        {/* Chapters tree */}

        <div className="mt-6 px-5">

          <div className="flex items-center justify-between">

            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">

              Chương · Kỳ này

            </span>

            <ChevronDown className="h-3 w-3 text-muted-foreground" />

          </div>

        </div>

        <div className="mt-2 flex flex-col gap-0.5 px-3">

          {chapters.map((c, i) => (

            <button

              key={c.num}

              className={`flex items-center gap-3 rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors hover:bg-card ${

                i === 3 ? "bg-accent-soft/60" : ""

              }`}

            >

              <span

                className={`tabular-nums text-[10px] tabular-nums ${i === 3 ? "text-accent-foreground" : "text-muted-foreground"}`}

              >

                {c.num}

              </span>

              <span className="flex-1 truncate text-foreground/85">{c.title}</span>

              <span className="tabular-nums text-[10px] text-muted-foreground">{c.count}</span>

            </button>

          ))}

        </div>



        {/* Footer card */}

        <div className="mt-auto p-4">

          <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary-soft via-card to-accent-soft p-4">

            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-secondary/30 blur-2xl" />

            <div className="relative">

              <div className="text-base leading-tight text-foreground">

                Kỹ thuật

                <br />

                Phần mềm

              </div>

              <div className="mt-2 text-[10px] tabular-nums uppercase tracking-wider text-muted-foreground">

                CS3001 · Học kỳ 2

              </div>

              <div className="mt-3 flex items-center justify-between">

                <div className="flex -space-x-1.5">

                  <div className="h-5 w-5 rounded-full border-2 border-card bg-primary" />

                  <div className="h-5 w-5 rounded-full border-2 border-card bg-accent" />

                  <div className="h-5 w-5 rounded-full border-2 border-card bg-secondary" />

                  <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-card bg-muted text-[8px] font-medium text-muted-foreground">

                    +2

                  </div>

                </div>

                <span className="tabular-nums text-[10px] text-muted-foreground">12 docs</span>

              </div>

            </div>

          </div>

        </div>

      </aside>



      {/* Main */}

      <div className="flex min-w-0 flex-1 flex-col">

        <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border bg-background/70 px-4 backdrop-blur-md md:px-6">

          <div className="flex min-w-0 items-center gap-3">

            <div className="hidden items-center gap-2 rounded-full border border-border bg-card/80 py-1 pl-1 pr-3 text-xs sm:flex">

              <span className="relative flex h-5 w-5 items-center justify-center">

                <span className="pulse-ring absolute h-2 w-2 rounded-full bg-secondary" />

                <span className="relative h-2 w-2 rounded-full bg-secondary" />

              </span>

              <span className="whitespace-nowrap font-medium text-foreground">Sẵn sàng</span>

              <span className="whitespace-nowrap tabular-nums text-[10px] text-muted-foreground">

                248 vecs

              </span>

            </div>

            <div className="hidden items-center gap-1.5 text-xs text-muted-foreground xl:flex">

              <span className="tabular-nums">gemini-embedding-001</span>

              <span className="h-3 w-px bg-border" />

              <span>3072d</span>

            </div>

          </div>

          <div className="flex shrink-0 items-center gap-2">

            <Link

              href="/"

              className="group inline-flex h-9 items-center gap-2 rounded-full bg-primary pl-2 pr-4 text-[13px] font-medium text-primary-foreground shadow-soft transition-all hover:shadow-pop"

            >

              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/15 transition-transform group-hover:rotate-90">

                <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />

              </span>

              <span className="whitespace-nowrap">Phiên mới</span>

            </Link>

            <DropdownMenu>

              <DropdownMenuTrigger asChild>

                <button className="ml-1 flex h-9 items-center gap-2 rounded-full border border-border bg-card pl-1 pr-1 lg:pr-3.5 outline-none hover:bg-card/80 transition-colors">

                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary text-[10px] font-semibold text-primary-foreground">

                    MA

                  </div>

                  <span className="hidden whitespace-nowrap text-[13px] font-medium text-foreground lg:inline">

                    Minh An

                  </span>

                </button>

              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">

                <DropdownMenuItem onClick={() => signOut()} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer">

                  <LogOut className="mr-2 h-4 w-4" />

                  <span>Đăng xuất</span>

                </DropdownMenuItem>

              </DropdownMenuContent>

            </DropdownMenu>

          </div>

        </header>



        <main className="min-h-0 flex-1">{children}</main>

      </div>

    </div>

  );

}

