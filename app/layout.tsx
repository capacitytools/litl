import type { Metadata, Viewport } from "next";
import "./globals.css";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "Light In the Light — Illuminating Minds, Empowering Futures",
  description: "A Nigerian educational platform offering a study centre, computer-based testing, and learning resources.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B3D91",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      {/* pb-16 adds padding to the bottom so the mobile nav doesn't hide your content */}
      <body className="bg-slate-50 pb-16 sm:pb-0">
        <Header user={user} />
        <div className="min-h-[calc(100vh-4rem)]">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}