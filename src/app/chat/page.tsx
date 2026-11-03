import { ChatPageClient } from "@/components/chat/chat-page-client";

export const metadata = {
  title: "Nutrition chat — NourishAI",
  description: "RAG-powered nutrition and recipe chat.",
};

export default function ChatPage() {
  return <ChatPageClient />;
}