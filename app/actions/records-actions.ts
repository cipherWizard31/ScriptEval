// app/actions/records-actions.ts
'use server'
import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function stripAndSend(formData: FormData) {
  const id = formData.get('id');
  // We don't delete the name from the DB, we just change the status
  // so the Admin/Evaluator queries don't pull that column.
  db.prepare("UPDATE scripts SET status = 'CLEARED' WHERE id = ?").run(id);
  revalidatePath('/records/dashboard');
}