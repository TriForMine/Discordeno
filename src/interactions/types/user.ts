export interface UserPayload {
  /** The user's id */
  id: string;
  /** the user's username, not unique across the platform */
  username: string;
  /** The user's 4 digit discord tag */
  discriminator: string;
  /** The user's avatar hash */
  avatar: string | null;
  /** Whether the user is a bot */
  bot?: boolean;
  /** Whether the user is an official discord system user (part of the urgent message system.) */
  system?: boolean;
  /** Whether the user has two factor enabled on their account */
  mfa_enabled?: boolean;
  /** the user's chosen language option */
  locale?: string;
  /** Whether the email on this account has been verified */
  verified?: boolean;
  /** The user's email */
  email?: string;
  /** The flags on a user's account. */
  flags?: number;
  /** The type of Nitro subscription on a user's account. */
  premium_type?: number;
}
