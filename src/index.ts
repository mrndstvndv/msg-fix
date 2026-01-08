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

export default {
	async fetch(request, env, ctx): Promise<Response> {

		const url = new URL(request.url);
		const statusId = url.searchParams.get('id')

		if (!statusId) {
			return new Response('Missing required "id" query parameter', { status: 400 });
		}

		// Check if request is from Messenger embed bot
		const userAgent = request.headers.get('User-Agent') || '';
		const isEmbedBot = /WhatsApp/i.test(userAgent);

		// If regular browser, redirect to original tweet
		if (!isEmbedBot) {
			return Response.redirect(`https://x.com/i/status/${statusId}`, 302);
		}

		const twitter = new TwitterClient()
		const result = await twitter.getTweetInfo(statusId)

		if (!result.success) {
			return new Response(`Error: ${result.error.message}`, { status: 404 });
		}

		const tweetData = result.data

		const image = tweetData.legacy.extended_entities?.media?.[0] ?? result.data.legacy.entities.media?.[0];

		const html = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta property="og:title" content="@${tweetData.core.user_results.result.core.screen_name}">
	<meta property="og:description" content="${tweetData.legacy.full_text}">
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
