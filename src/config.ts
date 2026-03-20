import "dotenv/config";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Отсутствует обязательная переменная окружения: ${name}`);
  }
  return value;
}

export const config = {
  botToken: requireEnv("BOT_TOKEN"),
  ollamaUrl: process.env.OLLAMA_URL ?? "http://localhost:11434/v1",
  writerModel: process.env.WRITER_MODEL ?? "qwen2.5:3b",
};
