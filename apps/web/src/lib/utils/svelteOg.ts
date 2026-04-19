import { initSvelteOg } from 'svelte-og';
import fs from 'node:fs';
import path from 'node:path';

export const svelteOg = initSvelteOg({
	width: 600,
	height: 600,
	fonts: [
		{
			name: 'Noto Sans',
			// Reading font bytes at runtime avoids bundling .ttf directly into the server bundle.
			data: fs.readFileSync(path.resolve(process.cwd(), 'src/lib/assets/fonts/NotoSans-Regular.ttf')),
			style: 'normal'
		}
	]
});
