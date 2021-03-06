import { SnakeCasedPropertiesDeep } from "../util.ts";

export interface MessageDelete {
  /** The id of the message */
  id: string;
  /** The id of the channel */
  channelId: string;
  /** The id of the guild */
  guildId?: string;
}

/** https://discord.com/developers/docs/topics/gateway#message-delete */
export type DiscordMessageDelete = SnakeCasedPropertiesDeep<MessageDelete>;
