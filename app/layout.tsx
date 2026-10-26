import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Light In the Light — Illuminating Minds, Empowering Futures",
    template: "%s · LITL",
  },
  description:
    "Light In the Light (LITL) is a Nigerian educational platform offering a study centre, computer-based testing, and learning resources for primary, secondary, WAEC, NECO, and JAMB learners.",
  applicationName: "Light In the Light",
  authors: [{ name: "Light In the Light" }],
  keywords: [
    "LITL",
    "Light In the Light",
    "Nigerian education",
    "WAEC",
    "NECO",
    "JAMB",
    "CBT",
    "Study Centre",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B3D91",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}