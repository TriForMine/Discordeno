import { eventHandlers } from "../../bot.ts";
import { cacheHandlers } from "../../cache.ts";
import { structures } from "../../structures/mod.ts";
import { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";
import { DiscordGuildMemberAdd } from "../../types/members/guild_member_add.ts";

export async function handleGuildMemberAdd(data: DiscordGatewayPayload) {
  const payload = data.d as DiscordGuildMemberAdd;
  const guild = await cacheHandlers.get("guilds", payload.guild_id);
  if (!guild) return;

  guild.memberCount++;
  const discordenoMember = await structures.createDiscordenoMember(
    payload,
    payload.guild_id,
  );
  await cacheHandlers.set("members", discordenoMember.id, discordenoMember);

  eventHandlers.guildMemberAdd?.(guild, discordenoMember);
}
