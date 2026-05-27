import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "リバーシ | Web Reversi Application",
  description: "Webブラウザで手軽に遊べる、美しくモダンなデザインのリバーシアプリケーションです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
