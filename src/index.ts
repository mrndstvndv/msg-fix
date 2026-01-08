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

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const html = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Messenger Link Preview</title>

	<!-- Open Graph Meta Tags for Messenger -->
	<meta property="og:title" content="Check out this amazing page">
	<meta property="og:description" content="This is a sample page with a messenger-compatible link preview">
	<meta property="og:image" content="https://pbs.twimg.com/media/G-D4OGeWAAAHNt7?format=jpg&name=900x900">
	<meta property="og:image:width" content="1200">
	<meta property="og:image:height" content="630">
	<meta property="og:type" content="website">
	<meta property="og:url" content="https://example.com">

	<style>
		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
			max-width: 800px;
			margin: 0 auto;
			padding: 20px;
			background: #f5f5f5;
		}
		.container {
			background: white;
			border-radius: 8px;
			padding: 40px;
			box-shadow: 0 2px 8px rgba(0,0,0,0.1);
		}
		h1 { color: #333; }
		p { color: #666; line-height: 1.6; }
		.preview {
			margin: 20px 0;
			padding: 15px;
			background: #f9f9f9;
			border-left: 4px solid #0084ff;
			border-radius: 4px;
		}
	</style>
</head>
<body>
	<div class="container">
		<h1>Messenger Link Preview Sample</h1>
		<p>This page includes Open Graph meta tags that will display an image and title when shared in Messenger.</p>

		<div class="preview">
			<strong>When shared in Messenger, it will show:</strong>
			<ul>
				<li>Title: "Check out this amazing page"</li>
				<li>Description: "This is a sample page with a messenger-compatible link preview"</li>
				<li>Image: A beautiful landscape photo (1200x630px)</li>
			</ul>
		</div>
	</div>
</body>
</html>`;

		return new Response(html, {
			headers: {
				'Content-Type': 'text/html; charset=utf-8',
			},
		});
	},
} satisfies ExportedHandler<Env>;
