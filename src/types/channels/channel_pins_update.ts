import { SnakeCasedPropertiesDeep } from "../util.ts";

export interface ChannelPinsUpdate {
  /** The id of the guild */
  guildId?: string;
  /** The id of the channel */
  channelId: string;
  /** The time at which the most recent pinned message was pinned */
  lastPinTimestamp?: string | null;
}

/** https://discord.com/developers/docs/topics/gateway#channel-pins-update */
export type DiscordChannelPinsUpdate = SnakeCasedPropertiesDeep<
  ChannelPinsUpdate
>;
