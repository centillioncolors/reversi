import { ReversiGame } from "@/features/reversi/components/ReversiGame";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "リバーシ | Web Reversi Application",
  description: "Webブラウザで手軽に遊べる、美しくモダンなデザインのリバーシアプリケーションです。",
};

export default function ReversiPage() {
  return <ReversiGame />;
}
