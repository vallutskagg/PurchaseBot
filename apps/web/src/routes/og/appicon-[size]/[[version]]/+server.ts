import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return new Response('Self-hosted OG generation is disabled.', { status: 404 });
};
