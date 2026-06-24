'use server'

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { ROLES } from '@/lib/permissions';

async function verifyEvaluator() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.role !== ROLES.EVALUATOR) {
    throw new Error('Unauthorized. Evaluator clearance required.');
  }
  return session;
}

export async function submitEvaluation(formData: FormData) {
  const session = await verifyEvaluator();

  const scriptId        = formData.get('scriptId') as string;
  const scoreRaw        = formData.get('score') as string;
  const notes           = formData.get('notes') as string;

  if (!scriptId || !scoreRaw || !notes?.trim()) {
    throw new Error('All fields are required.');
  }

  const score = parseInt(scoreRaw, 10);
  if (isNaN(score) || score < 1 || score > 100) {
    throw new Error('Score must be between 1 and 100.');
  }

  // Verify this script is actually assigned to this evaluator
  const script = db
    .prepare("SELECT id FROM scripts WHERE id = ? AND evaluatorId = ? AND status = 'ASSIGNED'")
    .get(scriptId, session.user.id);

  if (!script) {
    throw new Error('Script not found or not assigned to you.');
  }

  db.prepare(`
    UPDATE scripts
    SET status = 'EVALUATED',
        evaluationScore = ?,
        evaluationNotes = ?,
        evaluatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(score, notes.trim(), scriptId);

  revalidatePath('/evaluator/dashboard');
  revalidatePath('/admin/results');
}
