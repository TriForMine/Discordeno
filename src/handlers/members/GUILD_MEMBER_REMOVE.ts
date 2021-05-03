import { eventHandlers } from "../../bot.ts";
import { cacheHandlers } from "../../cache.ts";
import { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";
import { GuildMemberRemove } from "../../types/members/guild_member_remove.ts";
import { snowflakeToBigint } from "../../util/bigint.ts";

export async function handleGuildMemberRemove(data: DiscordGatewayPayload) {
  const payload = data.d as GuildMemberRemove;
  const guild = await cacheHandlers.get(
    "guilds",
    snowflakeToBigint(payload.guildId),
  );
  if (!guild) return;

  guild.memberCount--;
  const member = await cacheHandlers.get(
    "members",
    snowflakeToBigint(payload.user.id),
  );
  eventHandlers.guildMemberRemove?.(guild, payload.user, member);

  member?.guilds.delete(guild.id);
  if (member && !member.guilds.size) {
    await cacheHandlers.delete("members", member.id);
  }
}
