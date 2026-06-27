"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  CreditCard,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
} from "lucide-react";

type NavItem =
  | { type: "link"; label: string; icon: React.ReactNode; href: string }
  | { type: "divider" };

interface SidebarProps {
  onLogout?: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auto-detect resourceId from URL — no prop needed
  const resourceId = pathname.match(/\/resource\/([^/]+)/)?.[1];

  const topNav: NavItem[] = [
    {
      type: "link",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-[18px] w-[18px]" />,
      href: "/studyresource",
    },
  ];

  const resourceNav: NavItem[] = resourceId
    ? [
        { type: "divider" },
        {
          type: "link",
          label: "Flashcards",
          icon: <CreditCard className="h-[18px] w-[18px]" />,
          href: `/resource/${resourceId}/flashcards`,
        },
        {
          type: "link",
          label: "Quiz",
          icon: <HelpCircle className="h-[18px] w-[18px]" />,
          href: `/resource/${resourceId}/quiz`,
        },
      ]
    : [];

  const allItems: NavItem[] = [...topNav, ...resourceNav];

  const isActive = (href: string) => {
    if (href === "/studyresource") return pathname === "/studyresource";
    return pathname.startsWith(href);
  };

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div
        className={`flex items-center gap-2.5 px-4 py-[18px] ${
          collapsed && !mobile ? "justify-center px-0" : ""
        }`}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#5B3F8C]">
          <BookOpen className="h-4 w-4 text-white" />
        </div>
        {(!collapsed || mobile) && (
          <span className="text-[15px] font-semibold tracking-tight text-[#3A3047]">
            StudyBuddy
          </span>
        )}
      </div>

      <div className="mx-3 mb-2 h-px bg-[#E8E0F5]" />

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-2 pt-1">
        {allItems.map((item, i) => {
          if (item.type === "divider") {
            return <div key={`d-${i}`} className="mx-1 my-2 h-px bg-[#E8E0F5]" />;
          }
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              title={collapsed && !mobile ? item.label : undefined}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                collapsed && !mobile ? "justify-center px-2 py-3" : ""
              } ${
                active
                  ? "bg-[#5B3F8C] text-white shadow-sm"
                  : "text-[#6B5B8A] hover:bg-[#EEEDFE] hover:text-[#5B3F8C]"
              }`}
            >
              <span
                className={`shrink-0 ${
                  active ? "text-white" : "text-[#9B86BD] group-hover:text-[#5B3F8C]"
                }`}
              >
                {item.icon}
              </span>
              {(!collapsed || mobile) && (
                <span className="font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 pb-5">
        <div className="mx-1 mb-2 h-px bg-[#E8E0F5]" />
        <button
          onClick={onLogout}
          title={collapsed && !mobile ? "Log out" : undefined}
          className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#6B5B8A] transition-all hover:bg-red-50 hover:text-red-500 ${
            collapsed && !mobile ? "justify-center px-2 py-3" : ""
          }`}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0 text-[#9B86BD] group-hover:text-red-400" />
          {(!collapsed || mobile) && <span className="font-medium">Log out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className={`relative hidden h-screen shrink-0 flex-col border-r border-[#E8E0F5] bg-white transition-all duration-300 md:flex ${
          collapsed ? "w-[64px]" : "w-56"
        }`}
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-[68px] flex h-6 w-6 items-center justify-center rounded-full border border-[#E8E0F5] bg-white text-[#9B86BD] shadow-sm transition hover:border-[#9B86BD] hover:text-[#5B3F8C]"
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      </aside>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-9 w-9 items-center justify-center rounded-xl border border-[#E8E0F5] bg-white shadow-sm text-[#5B3F8C] md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl md:hidden">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-[#9B86BD] hover:bg-[#EEEDFE]"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent mobile />
          </div>
        </>
      )}
    </>
  );
}