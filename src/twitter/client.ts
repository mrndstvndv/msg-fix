/// <reference lib="webworker" />

import type { Result, TwitterClientConfig, TwitterError, TwitterErrorCode, GuestTokenResponse, TweetResult, TweetResultByRestIdResponse, TweetResultResponse } from './models';
import { AUTHORIZATION_TOKEN, DEFAULT_USER_AGENT, TWEET_BY_REST_ID_URL, TWEET_FEATURES } from './constants';

export class TwitterClient {
  private guestToken?: string;
  private userAgent: string;

  constructor(config?: TwitterClientConfig) {
    this.userAgent = config?.userAgent || DEFAULT_USER_AGENT;
  }

  private createError(message: string, statusCode?: number, code?: TwitterErrorCode): TwitterError {
    return { message, statusCode, code };
  }

  private extractTweetResult(data: TweetResultByRestIdResponse): Result<TweetResult, TwitterError> {
    const result = data?.data?.tweetResult?.result;
    if (!result) {
      return {
        success: false,
        error: this.createError('Tweet not found', 404, 'NOT_FOUND'),
      };
    }

    // Handle TweetTombstone (age-restricted/unavailable content)
    if (result.__typename === 'TweetTombstone') {
      const tombstoneText = result.tombstone?.text?.text ?? 'This tweet is unavailable';
      return {
        success: false,
        error: this.createError(tombstoneText, 451, 'RESTRICTED'),
      };
    }

    // Handle TweetWithVisibilityResults (unwrap nested tweet)
    if (result.__typename === 'TweetWithVisibilityResults') {
      return { success: true, data: result.tweet };
    }

    // Default: treat as normal Tweet (handles both explicit 'Tweet' typename and missing typename)
    return { success: true, data: result };
  }

  private async activateGuest(): Promise<Result<string, TwitterError>> {
    try {
      const response = await fetch('https://api.x.com/1.1/guest/activate.json', {
        method: 'POST',
        headers: {
          'authorization': AUTHORIZATION_TOKEN,
          'User-Agent': this.userAgent,
        },
      });

      if (!response.ok) {
        return {
          success: false,
          error: this.createError(
            `Failed to activate guest token: ${response.statusText}`,
            response.status,
            'GUEST_ACTIVATION_FAILED'
          ),
        };
      }

      const data: GuestTokenResponse = await response.json();
      this.guestToken = data.guest_token;

      return { success: true, data: this.guestToken };
    } catch (error) {
      return {
        success: false,
        error: this.createError(
          error instanceof Error ? error.message : 'Unknown error during guest activation',
          undefined,
          'GUEST_ACTIVATION_ERROR'
        ),
      };
    }
  }

  async getTweetInfo(tweetId: string): Promise<Result<TweetResult, TwitterError>> {
    if (!this.guestToken) {
      const guestResult = await this.activateGuest();
      if (!guestResult.success) {
        return guestResult;
      }
    }

    const variables = {
      tweetId,
      includePromotedContent: true,
      withBirdwatchNotes: true,
      withVoice: true,
      withCommunity: true,
    };

    const fieldToggles = {
      withArticleRichContentState: true,
      withArticlePlainText: false,
    };

    const params = new URLSearchParams({
      variables: JSON.stringify(variables),
      features: JSON.stringify(TWEET_FEATURES),
      fieldToggles: JSON.stringify(fieldToggles),
    });

    const url = `${TWEET_BY_REST_ID_URL}?${params.toString()}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'authorization': AUTHORIZATION_TOKEN,
          'User-Agent': this.userAgent,
          'x-guest-token': this.guestToken!,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          const retryResult = await this.activateGuest();
          if (retryResult.success) {
            const retryResponse = await fetch(url, {
              method: 'GET',
              headers: {
                'authorization': AUTHORIZATION_TOKEN,
                'User-Agent': this.userAgent,
                'x-guest-token': this.guestToken!,
              },
            });

            if (!retryResponse.ok) {
              return {
                success: false,
                error: this.createError(
                  `Failed to fetch tweet after retry: ${retryResponse.statusText}`,
                  retryResponse.status,
                  'TWEET_FETCH_FAILED'
                ),
              };
            }

            const retryData: TweetResultByRestIdResponse = await retryResponse.json();
            return this.extractTweetResult(retryData);
          }
        }

        return {
          success: false,
          error: this.createError(
            `Failed to fetch tweet: ${response.statusText}`,
            response.status,
            'TWEET_FETCH_FAILED'
          ),
        };
      }

      const data: TweetResultByRestIdResponse = await response.json();
      return this.extractTweetResult(data);
    } catch (error) {
      return {
        success: false,
        error: this.createError(
          error instanceof Error ? error.message : 'Unknown error during tweet fetch',
          undefined,
          'TWEET_FETCH_ERROR'
        ),
      };
    }
  }
}
