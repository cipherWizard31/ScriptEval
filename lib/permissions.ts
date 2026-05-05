export const ROLES = {
  ADMIN: "theater class",
  RECORD_OFFICE: "record office",
  EVALUATOR: "evaluator",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];