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
  ollamaModel: process.env.OLLAMA_MODEL ?? "qwen2.5:7b",
  ollamaUrl: process.env.OLLAMA_URL ?? "http://localhost:11434/v1",
  targetUserId: Number(requireEnv("TARGET_USER_ID")),
};

if (isNaN(config.targetUserId)) {
  throw new Error("TARGET_USER_ID должен быть числом");
}
