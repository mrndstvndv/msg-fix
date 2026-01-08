import { describe, it, expect } from 'vitest';
import { TwitterClient } from '../src/twitter';

describe('TwitterClient', () => {
	describe('getTweetInfo', () => {
		it('should fetch tweet info with media successfully', async () => {
			const client = new TwitterClient();
			const tweetId = '2008917793123528940';
			const result = await client.getTweetInfo(tweetId);

			expect(result.success).toBe(true);
			if (result.success) {
				// Basic tweet structure
				expect(result.data.__typename).toBe('Tweet');
				expect(result.data.rest_id).toBe(tweetId);
				expect(result.data.legacy.full_text).toBeDefined();

				// Author info - screen_name is in core.user_results.result.core
				const userResult = result.data.core.user_results.result;
				expect(userResult).toBeDefined();
				expect(userResult.core.screen_name).toBe('NetflixAnime');

				// Media presence
				const media = result.data.legacy.extended_entities?.media
					?? result.data.legacy.entities.media;
				expect(media).toBeDefined();
				expect(media!.length).toBeGreaterThan(0);
			}
		}, 30000);

		it('should return error for non-existent tweet', async () => {
			const client = new TwitterClient();
			const result = await client.getTweetInfo('1');

			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error).toBeDefined();
				expect(result.error.message).toBe('Tweet not found');
				expect(result.error.code).toBe('TWEET_NOT_FOUND');
			}
		}, 30000);
	});
});
