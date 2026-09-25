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
