import { env } from '$env/dynamic/public';
import { appVersion } from '$lib/utils/appInfo';
import { H } from 'highlight.run';

if (location.hostname !== 'localhost' && env.PUBLIC_HIGHLIGHT_PROJECT_ID) {
	H.init(env.PUBLIC_HIGHLIGHT_PROJECT_ID, {
		environment: 'production',
		version: appVersion,
		tracingOrigins: true,
		networkRecording: {
			enabled: true,
			recordHeadersAndBody: true
		}
	});
}
