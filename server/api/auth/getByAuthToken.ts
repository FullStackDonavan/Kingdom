import { defineEventHandler, parseCookies } from 'h3';
import { getUserBySessionToken } from '~/server/database/repositories/sessionRepository';

export default defineEventHandler(async (event) => {
  try {
    const cookies = parseCookies(event);
    const authToken = cookies['auth_token'];

    if (!authToken) {
      throw createError({ statusCode: 401, message: 'Unauthorized: Missing token' });
    }

    const user = await getUserBySessionToken(authToken);

    if (!user) {
      throw createError({ statusCode: 401, message: 'Unauthorized: Invalid token' });
    }

    return { user };
  } catch (error) {
    console.error('API Error:', error);
    throw createError({ statusCode: 500, message: error.message || 'Internal Server Error' });
  }
});
