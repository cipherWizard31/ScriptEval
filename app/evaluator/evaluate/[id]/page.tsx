// app/evaluator/evaluate/[id]/page.tsx
// Server component — resolves params, then renders the client form
import EvaluateForm from './EvaluateForm';
import db from '@/lib/db';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>
}

export default async function EvaluatePage({ params }: Props) {
  const { id } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/login');

  // Confirm this script is actually assigned to this evaluator
  const script = db
    .prepare("SELECT id, title FROM scripts WHERE id = ? AND evaluatorId = ? AND status = 'ASSIGNED'")
    .get(id, session.user.id) as { id: string; title: string } | undefined;

  if (!script) notFound();

  return <EvaluateForm scriptId={script.id} scriptTitle={script.title} />;
}
