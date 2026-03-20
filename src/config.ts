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
  classifierModel: process.env.CLASSIFIER_MODEL ?? "qwen2.5:3b",
  writerModel: process.env.WRITER_MODEL ?? "qwen2.5:3b",
  targetUserIds: requireEnv("TARGET_USER_IDS")
    .split(",")
    .map((id) => Number(id.trim())),
};

if (config.targetUserIds.some(isNaN)) {
  throw new Error("TARGET_USER_IDS должен содержать числа через запятую");
}
