'use server'

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ROLES, Role } from '@/lib/permissions';

// Middleware secures the routes, but Server Actions should also be secured!
async function verifyAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session || session.user.role !== ROLES.ADMIN) {
    throw new Error('Unauthorized action. Theater Class clearance required.');
  }
}

export async function assignScript(formData: FormData) {
  await verifyAdmin();
  
  const scriptId = formData.get('scriptId') as string;
  const evaluatorId = formData.get('evaluatorId') as string;
  
  if (!scriptId || !evaluatorId) {
    throw new Error("Missing required data for assignment.");
  }

  // Assign the script and update its status
  db.prepare("UPDATE scripts SET status = 'ASSIGNED', evaluatorId = ? WHERE id = ?").run(evaluatorId, scriptId);
  
  revalidatePath('/admin/dashboard');
  revalidatePath('/evaluator/dashboard');
}

export async function updateUserRole(formData: FormData) {
  await verifyAdmin();
  
  const userId = formData.get('userId') as string;
  const newRole = formData.get('role') as string;
  
  if (!userId || !newRole) {
    throw new Error("Missing required data for role update.");
  }

  db.prepare("UPDATE user SET role = ? WHERE id = ?").run(newRole, userId);
  
  revalidatePath('/admin/users');
}
