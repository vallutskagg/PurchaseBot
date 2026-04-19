import { localStorageStore } from '@skeletonlabs/skeleton';
import { derived, type Writable } from 'svelte/store';
import { decodeJwt, errors } from 'jose';
import { isValidJwt } from '$lib/utils/kideUtils';
import { reverseString } from '$lib/utils/common';

export interface AuthTokenPayload {
	aud: string;
	exp: number;
	iss: string;
	nbf: number;
	sub: string;
	token_id: string;
	user_id: string;
}

export const token: Writable<string> = localStorageStore('token', '');

const extractJwtCandidate = (value: string) => {
	const trimmed = value.trim();
	const withoutQuotes = trimmed.replace(/^"+|"+$/g, '');
	const withoutBearer = withoutQuotes.replace(/^Bearer\s+/i, '');
	const match = withoutBearer.match(/[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/);
	return match?.[0] ?? '';
};

export const normalizedToken = derived(token, $token => {
	const direct = extractJwtCandidate($token);
	if (direct && isValidJwt(direct)) return direct;

	const reversed = extractJwtCandidate(reverseString($token));
	if (reversed && isValidJwt(reversed)) return reversed;

	return '';
});

export const decodedToken = derived(normalizedToken, $token => {
	try {
		const { exp, sub } = decodeJwt($token);
		if (!exp || !sub) return null;

		return {
			expEpoch: exp,
			expDate: new Date(exp * 1000),
			userEmail: sub
		};
	} catch (error) {
		if (error instanceof errors.JOSEError) {
			return null;
		}
		throw error;
	}
});

export const tokenIsExpired = derived(decodedToken, $decodedToken => {
	const now = new Date();
	return $decodedToken && $decodedToken.expDate < now;
});

export const tokenIsSet = derived(
	[normalizedToken, tokenIsExpired],
	([$token, $tokenIsExpired]) => !!$token && !$tokenIsExpired
);
