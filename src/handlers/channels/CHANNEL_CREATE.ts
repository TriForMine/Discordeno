import { eventHandlers } from "../../bot.ts";
import { cacheHandlers } from "../../cache.ts";
import { structures } from "../../structures/mod.ts";
import { DiscordChannel } from "../../types/channels/channel.ts";
import { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";

export async function handleChannelCreate(data: DiscordGatewayPayload) {
  const payload = data.d as DiscordChannel;

  const discordenoChannel = await structures.createDiscordenoChannel(payload);
  await cacheHandlers.set("channels", discordenoChannel.id, discordenoChannel);

  eventHandlers.channelCreate?.(discordenoChannel);
}
