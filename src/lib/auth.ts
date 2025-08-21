import { cookies } from 'next/headers';
import { decrypt, SessionPayload } from './session';

export async function getSession(): Promise<SessionPayload | null> {
  const sessionCookie = (await cookies()).get('session')?.value;
  if (!sessionCookie) {
    return null;
  }
  return await decrypt(sessionCookie);
}