import { cacheHandlers } from "../controllers/cache.ts";
import { ChannelCreatePayload, Unpromise } from "../../types/types.ts";

export async function createChannel(
  data: ChannelCreatePayload,
  guildID?: string,
) {
  const {
    guild_id: rawGuildID,
    last_message_id: lastMessageID,
    user_limit: userLimit,
    rate_limit_per_user: rateLimitPerUser,
    parent_id: parentID,
    last_pin_timestamp: lastPinTimestamp,
    permission_overwrites,
    ...rest
  } = data;

  const channel = {
    ...rest,
    /** The guild id of the channel if it is a guild channel. */
    guildID: guildID || rawGuildID || "",
    /** The id of the last message sent in this channel */
    lastMessageID,
    /** The amount of users allowed in this voice channel. */
    userLimit,
    /** The rate limit(slowmode) in this text channel that users can send messages. */
    rateLimitPerUser,
    /** The category id for this channel */
    parentID,
    /** The last time when a message was pinned in this channel */
    lastPinTimestamp,
    /** The permission overwrites for this channel */
    permissionOverwrites: permission_overwrites,
    /** Whether this channel is nsfw or not */
    nsfw: data.nsfw || false,
    /** The mention of the channel */
    mention: `<#${data.id}>`,
  };

  cacheHandlers.set("channels", data.id, channel);
  return channel;
}

export interface Channel extends Unpromise<ReturnType<typeof createChannel>> {}