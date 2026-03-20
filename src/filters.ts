import { Message } from "grammy/types";
import { config } from "./config";

const TELEGRAM_LINK_RE = /https?:\/\/(t\.me|telegram\.me)\//i;
const ANY_LINK_RE = /https?:\/\//i;
const MIN_TEXT_LENGTH = 60;

export function isTargetUser(message: Message): boolean {
  return message.from?.id === config.targetUserId;
}

export function isNewsMessage(message: Message): boolean {
  // Пересланное из канала
  if (message.forward_origin?.type === "channel") return true;

  const text = message.text ?? message.caption ?? "";

  // Ссылка на телеграм-канал
  if (TELEGRAM_LINK_RE.test(text)) return true;

  // Любая ссылка
  if (ANY_LINK_RE.test(text)) return true;

  // Entities со ссылками
  const entities = message.entities ?? message.caption_entities ?? [];
  for (const entity of entities) {
    if (entity.type === "url" || entity.type === "text_link") return true;
  }

  // Длинный текст — скорее всего скопированная новость
  if (text.trim().length >= MIN_TEXT_LENGTH) return true;

  return false;
}

export function extractText(message: Message): string {
  return (message.text ?? message.caption ?? "").trim();
}
