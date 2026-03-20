import { Message } from "grammy/types";
import { config } from "./config";

const TELEGRAM_LINK_RE = /https?:\/\/(t\.me|telegram\.me)\//i;

export function isTargetUser(message: Message): boolean {
  return message.from?.id === config.targetUserId;
}

export function isNewsMessage(message: Message): boolean {
  // Пересланное сообщение из канала
  if (
    message.forward_origin &&
    message.forward_origin.type === "channel"
  ) {
    return true;
  }

  // Ссылка на telegram-канал в тексте или подписи
  const text = message.text ?? message.caption ?? "";
  if (TELEGRAM_LINK_RE.test(text)) {
    return true;
  }

  // Ссылка в entities (inline url или text_link)
  const entities = message.entities ?? message.caption_entities ?? [];
  for (const entity of entities) {
    if (entity.type === "url") {
      const url = text.slice(entity.offset, entity.offset + entity.length);
      if (TELEGRAM_LINK_RE.test(url)) return true;
    }
    if (entity.type === "text_link" && entity.url) {
      if (TELEGRAM_LINK_RE.test(entity.url)) return true;
    }
  }

  return false;
}

export function extractNewsText(message: Message): string {
  return (message.text ?? message.caption ?? "").trim();
}
