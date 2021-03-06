import { rest } from "../../rest/rest.ts";
import { ModifyGuildChannelPositions } from "../../types/guilds/modify_guild_channel_position.ts";
import { endpoints } from "../../util/constants.ts";

/** Modify the positions of channels on the guild. Requires MANAGE_CHANNELS permisison. */
export async function swapChannels(
  guildId: string,
  channelPositions: ModifyGuildChannelPositions[],
): Promise<undefined> {
  if (channelPositions.length < 2) {
    throw "You must provide at least two channels to be swapped.";
  }

  const result = await rest.runMethod(
    "patch",
    endpoints.GUILD_CHANNELS(guildId),
    channelPositions,
  );

  return result;
}
