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
  classifierModel: process.env.CLASSIFIER_MODEL ?? "qwen2.5:1.5b",
  writerModel: process.env.WRITER_MODEL ?? "qwen2.5:3b",
  targetUserId: Number(requireEnv("TARGET_USER_ID")),
};

if (isNaN(config.targetUserId)) {
  throw new Error("TARGET_USER_ID должен быть числом");
}
