import { cacheHandlers } from "../../cache.ts";
import { rest } from "../../rest/rest.ts";
import { structures } from "../../structures/mod.ts";
import { CreateGuildRole } from "../../types/guilds/create_guild_role.ts";
import { DiscordRole } from "../../types/permissions/role.ts";
import { endpoints } from "../../util/constants.ts";
import {
  calculateBits,
  requireBotGuildPermissions,
} from "../../util/permissions.ts";

/** Create a new role for the guild. Requires the MANAGE_ROLES permission. */
export async function createRole(
  guildId: string,
  options: CreateGuildRole,
  reason?: string,
) {
  await requireBotGuildPermissions(guildId, ["MANAGE_ROLES"]);

  const result: DiscordRole = await rest.runMethod(
    "post",
    endpoints.GUILD_ROLES(guildId),
    {
      ...options,
      permissions: calculateBits(options?.permissions || []),
      reason,
    },
  );

  const role = await structures.createDiscordenoRole({
    role: result,
    guild_id: guildId,
  });
  const guild = await cacheHandlers.get("guilds", guildId);
  guild?.roles.set(role.id, role);

  return role;
}
