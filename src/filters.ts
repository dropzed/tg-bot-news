import { Message } from "grammy/types";
import { config } from "./config";

// Минимальная длина текста чтобы вообще отправлять в модель
const MIN_TEXT_LENGTH = 30;

export function isTargetUser(message: Message): boolean {
  return message.from?.id === config.targetUserId;
}

export function hasText(message: Message): boolean {
  const text = message.text ?? message.caption ?? "";
  return text.trim().length >= MIN_TEXT_LENGTH;
}

export function extractText(message: Message): string {
  return (message.text ?? message.caption ?? "").trim();
}
