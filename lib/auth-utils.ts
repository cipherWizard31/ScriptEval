import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ROLES, Role } from "./permissions";

export async function checkRole(allowedRoles: Role[]) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !allowedRoles.includes(session.user.role as Role)) {
    return { authorized: false, session };
  }

  return { authorized: true, session };
}