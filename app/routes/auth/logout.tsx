import axios from 'axios';
import { redirect } from 'react-router';
import { destroySession, getSession } from '~/sessions.server';
import type { Route } from './+types/logout';

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  const token = session.get('jwtoken');

  if (token) {
    try {
      await axios.post('/auth/logout', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Backend logout failed:', error);
    }
  }

  const cookie = await destroySession(session);

  return redirect('/login', {
    headers: {
      'Set-Cookie': cookie,
    },
  });
}
