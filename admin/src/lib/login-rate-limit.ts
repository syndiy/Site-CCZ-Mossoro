const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const failures = new Map<string, { count: number; resetAt: number }>();

function currentRecord(key: string) {
  const now = Date.now();
  const record = failures.get(key);
  if (!record || record.resetAt <= now) {
    failures.delete(key);
    return null;
  }
  return record;
}

export function isLoginBlocked(key: string): boolean {
  const record = currentRecord(key);
  return Boolean(record && record.count >= MAX_ATTEMPTS);
}

export function registerLoginFailure(key: string): void {
  const record = currentRecord(key);
  if (record) {
    record.count += 1;
    return;
  }
  failures.set(key, { count: 1, resetAt: Date.now() + WINDOW_MS });
}

export function clearLoginFailures(key: string): void {
  failures.delete(key);
}
