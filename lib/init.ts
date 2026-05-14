import { seedDemoData } from "./seed";

const g = globalThis as unknown as { __seeded?: boolean };

if (!g.__seeded) {
  g.__seeded = true;
  seedDemoData();
}
