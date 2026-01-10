/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { TwitterClient } from './twitter'
import { getDisplayText, sanitizeHtml } from './utils'

export default {
	async fetch(request, env, ctx): Promise<Response> {

		const url = new URL(request.url);

		// Support both query param (?id=xxx) and path (/xxx) formats
		const queryId = url.searchParams.get('id');
		const pathId = url.pathname.split('/').filter(Boolean).pop();

		// Query param format: always redirect to original tweet
		if (queryId) {
			return Response.redirect(`https://x.com/i/status/${queryId}`, 302);
		}

		// Path format: return embed HTML for bots, redirect for browsers
		const statusId = pathId;

		if (!statusId) {
			return new Response('Missing status ID. Use /{statusId} or ?id={statusId}', { status: 400 });
		}

		const twitter = new TwitterClient()
		const result = await twitter.getTweetInfo(statusId)

		if (!result.success) {
			const statusCode = result.error.statusCode ?? (result.error.code === 'RESTRICTED' ? 451 : 404);
			return new Response(`Error: ${result.error.message}`, { status: statusCode });
		}

		const tweetData = result.data

		const image = tweetData.legacy.extended_entities?.media?.[0] ?? result.data.legacy.entities.media?.[0];

		const html = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta property="og:title" content="@${tweetData.core.user_results.result.core.screen_name}">
	<meta property="og:description" content="${sanitizeHtml(getDisplayText(tweetData.legacy))}">
	<meta property="og:image" content="${image?.media_url_https}">
	<meta property="og:image:width" content="${image?.sizes.large?.w}">
	<meta property="og:image:height" content="${image?.sizes.large?.h}">
	<meta property="og:type" content="website">
	<meta property="og:url" content="${url.origin}?id=${statusId}">
</head>
</html>`;

		return new Response(html, {
			headers: {
				'Content-Type': 'text/html; charset=utf-8',
			},
		});
	},
} satisfies ExportedHandler<Env>;
