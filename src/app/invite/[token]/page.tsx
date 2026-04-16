import { InviteClient } from './invite-client';
import { getAuthUser } from '@/lib/supabase/server';

interface Props {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: Props) {
  const { token } = await params;
  const user = await getAuthUser();
  return <InviteClient token={token} isAuthenticated={Boolean(user)} />;
}
