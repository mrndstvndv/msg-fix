export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

export interface TwitterClientConfig {
  userAgent?: string;
}

export interface TwitterError {
  message: string;
  code?: string;
  statusCode?: number;
}

export interface GuestTokenResponse {
  guest_token: string;
}

export interface UserCore {
  created_at: string;
  name: string;
  screen_name: string;
}

export interface UserLegacy {
  default_profile: boolean;
  default_profile_image: boolean;
  description?: string;
  entities?: {
    description?: {
      urls?: UrlEntity[];
    };
    url?: {
      urls?: UrlEntity[];
    };
  };
  fast_followers_count?: number;
  favourites_count: number;
  followers_count: number;
  friends_count: number;
  has_custom_timelines?: boolean;
  is_translator: boolean;
  listed_count: number;
  media_count?: number;
  normal_followers_count?: number;
  pinned_tweet_ids_str?: string[];
  possibly_sensitive?: boolean;
  profile_banner_url?: string;
  profile_interstitial_type?: string;
  statuses_count: number;
  translator_type: string;
  url?: string;
  withheld_in_countries?: string[];
}

export interface UserAvatar {
  image_url: string;
}

export interface UserLocation {
  location: string;
}

export interface UserPrivacy {
  protected: boolean;
}

export interface UserVerification {
  verified: boolean;
  verified_type?: string;
}

export interface UserProfileBio {
  description: string;
}

export interface UserTipjarSettings {
  is_enabled: boolean;
  bandcamp_handle?: string;
  bitcoin_handle?: string;
  cash_app_handle?: string;
  ethereum_handle?: string;
  gofundme_handle?: string;
  patreon_handle?: string;
  pay_pal_handle?: string;
  venmo_handle?: string;
}

export interface UserResult {
  __typename: 'User';
  id: string;
  rest_id: string;
  affiliates_highlighted_label?: any;
  avatar?: UserAvatar;
  core: UserCore;
  dm_permissions?: any;
  is_blue_verified: boolean;
  legacy: UserLegacy;
  location?: UserLocation;
  media_permissions?: any;
  parody_commentary_fan_label?: string;
  profile_image_shape: string;
  profile_bio?: UserProfileBio;
  privacy?: UserPrivacy;
  relationship_perspectives?: any;
  tipjar_settings?: UserTipjarSettings;
  verification?: UserVerification;
  profile_description_language?: string;
}

export interface MediaSize {
  w: number;
  h: number;
  resize: 'crop' | 'fit' | 'thumb';
}

export interface MediaSizes {
  large?: MediaSize;
  medium?: MediaSize;
  small?: MediaSize;
  thumb?: MediaSize;
}

export interface VideoVariant {
  bitrate?: number;
  content_type: string;
  url: string;
}

export interface VideoInfo {
  duration_millis: number;
  variants: VideoVariant[];
}

export interface MediaEntity {
  id: number;
  id_str: string;
  indices: [number, number];
  media_url: string;
  media_url_https: string;
  url: string;
  display_url: string;
  expanded_url: string;
  type: 'photo' | 'video' | 'animated_gif';
  sizes: MediaSizes;
  video_info?: VideoInfo;
  ext_alt_text?: string;
  ext_media_color?: any;
  ext_media_av_status?: any;
}

export interface HashtagEntity {
  text: string;
  indices: [number, number];
}

export interface UrlEntity {
  url: string;
  expanded_url: string;
  display_url: string;
  indices: [number, number];
  unwound?: {
    url: string;
    status: number;
    title: string;
    description?: string;
  };
}

export interface UserMentionEntity {
  screen_name: string;
  name: string;
  id: number;
  id_str: string;
  indices: [number, number];
}

export interface SymbolEntity {
  text: string;
  indices: [number, number];
}

export interface TweetEntities {
  hashtags?: HashtagEntity[];
  urls?: UrlEntity[];
  user_mentions?: UserMentionEntity[];
  symbols?: SymbolEntity[];
  media?: MediaEntity[];
}

export interface TweetViews {
  count: string;
  state: 'EnabledWithCount' | 'Enabled' | 'Disabled';
}

export interface TweetLegacy {
  id_str: string;
  created_at: string;
  full_text: string;
  truncated: boolean;
  display_text_range?: [number, number];
  entities: TweetEntities;
  extended_entities?: TweetEntities;
  source: string;
  in_reply_to_status_id_str?: string;
  in_reply_to_user_id_str?: string;
  in_reply_to_screen_name?: string;
  user_id_str: string;
  user?: UserResult;
  geo?: any;
  coordinates?: any;
  place?: any;
  contributors?: string[];
  is_quote_status: boolean;
  quote_count: number;
  reply_count: number;
  retweet_count: number;
  favorite_count: number;
  favorited: boolean;
  retweeted: boolean;
  possibly_sensitive?: boolean;
  filter_level: string;
  lang: string;
  quoted_status_id_str?: string;
  quoted_status?: TweetResult;
  quoted_status_permalink?: any;
  withheld_in_countries?: string[];
  withheld_scope?: string;
}

export interface TweetResult {
  __typename: 'Tweet';
  rest_id: string;
  core: {
    user_results: {
      result: UserResult;
    };
  };
  legacy: TweetLegacy;
  views?: TweetViews;
  quote_count: number;
  reply_count: number;
  retweet_count: number;
  favorite_count: number;
  bookmark_count: number;
  favorited: boolean;
  bookmarked: boolean;
  retweeted: boolean;
  possibly_sensitive?: boolean;
  quoted_tweet?: TweetResult;
}

export interface TweetResultByRestIdResponse {
  data?: {
    tweetResult?: {
      result?: TweetResult;
    };
  };
}
