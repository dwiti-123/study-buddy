"use client";
import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/api/auth";
import { showToast } from "@/lib/toast";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const result = await logoutUser();
      if (result.success) {
        showToast.success("Logged out", "See you next time");
        router.push("/login");
      } else {
        showToast.error("Logout failed", result.message || "Please try again");
      }
    } catch (err: any) {
      showToast.error("Error", err.message || "An error occurred");
    }
  };

  return (
    <div className="flex h-screen bg-[#F4F0FA]">
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}