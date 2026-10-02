export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'suspended' | 'cancelled';

export const VALID_TRANSITIONS: Record<SubscriptionStatus, SubscriptionStatus[]> = {
  trial: ['active', 'cancelled'],
  active: ['past_due', 'cancelled'],
  past_due: ['suspended', 'active', 'cancelled'],
  suspended: ['cancelled'],
  cancelled: [],
};

export function validateTransition(from: SubscriptionStatus, to: SubscriptionStatus): boolean {
  const allowed = VALID_TRANSITIONS[from];
  return allowed ? allowed.includes(to) : false;
}
