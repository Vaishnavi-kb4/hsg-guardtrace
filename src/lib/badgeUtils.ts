export type BadgeShelfLifeStatus = "VALID" | "EXPIRING SOON" | "INVALID";

/**
 * Dynamically evaluates badge shelf life:
 * - Green (VALID): Expiry date is > 30 days away
 * - Amber/Yellow (EXPIRING SOON): Expiry date is within 30 days
 * - Red (INVALID): Expiry date has passed (shelf life expired)
 */
export function evaluateBadgeShelfLife(expiryStr?: string): BadgeShelfLifeStatus {
  if (!expiryStr) return "VALID";

  const expDate = new Date(expiryStr);
  if (isNaN(expDate.getTime())) return "VALID";

  const now = new Date();
  const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return "INVALID";
  }
  if (diffDays <= 30) {
    return "EXPIRING SOON";
  }
  return "VALID";
}

/**
 * Generates next unique iterative Badge ID (e.g. B-00125, B-00126, B-00127...)
 */
export function getNextIterativeBadgeId(existingBadges: { id: string }[] = [], registeredUsers: { badgeId?: string }[] = []): string {
  let maxNum = 125;
  const allIds = [
    ...existingBadges.map((b) => b?.id || ""),
    ...registeredUsers.map((u) => u?.badgeId || ""),
  ];

  allIds.forEach((id) => {
    if (!id) return;
    const match = id.match(/\d+/);
    if (match) {
      const num = parseInt(match[0], 10);
      if (!isNaN(num) && num >= maxNum) {
        maxNum = num;
      }
    }
  });

  const nextNum = maxNum + 1;
  return `B-${String(nextNum).padStart(5, "0")}`;
}

/**
 * Generates next unique iterative Batch ID (e.g. BATCH-07, BATCH-08, BATCH-09...)
 */
export function getNextIterativeBatchId(existingBadges: { batch?: string }[] = [], registeredUsers: { batchId?: string }[] = []): string {
  let maxNum = 7;
  const allBatches = [
    ...existingBadges.map((b) => b?.batch || ""),
    ...registeredUsers.map((u) => u?.batchId || ""),
  ];

  allBatches.forEach((b) => {
    if (!b) return;
    const match = b.match(/\d+/);
    if (match) {
      const num = parseInt(match[0], 10);
      if (!isNaN(num) && num >= maxNum) {
        maxNum = num;
      }
    }
  });

  const nextNum = maxNum + 1;
  return `BATCH-${String(nextNum).padStart(2, "0")}`;
}

/**
 * Generates next unique iterative Worker ID (e.g. WRK-1025, WRK-1026, WRK-1027...)
 */
export function getNextIterativeWorkerId(existingWorkers: { id: string }[] = [], registeredUsers: { id?: string }[] = []): string {
  let maxNum = 1025;
  const allIds = [
    ...existingWorkers.map((w) => w?.id || ""),
    ...registeredUsers.map((u) => u?.id || ""),
  ];

  allIds.forEach((id) => {
    if (!id) return;
    const match = id.match(/\d+/);
    if (match) {
      const num = parseInt(match[0], 10);
      if (!isNaN(num) && num >= maxNum) {
        maxNum = num;
      }
    }
  });

  const nextNum = maxNum + 1;
  return `WRK-${nextNum}`;
}
