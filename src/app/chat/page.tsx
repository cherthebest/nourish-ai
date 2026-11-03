import { ChatPageClient } from "@/components/chat/chat-page-client";

export const metadata = {
  title: "Nutrition chat — NourishAI",
  description: "Nutrition and recipe chat guided by curated notes and recipes.",
};

export default function ChatPage() {
  return <ChatPageClient />;
}