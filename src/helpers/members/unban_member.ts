import { rest } from "../../rest/rest.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotGuildPermissions } from "../../util/permissions.ts";

/** Remove the ban for a user. Requires BAN_MEMBERS permission */
export async function unban(guildId: string, id: string) {
  await requireBotGuildPermissions(guildId, ["BAN_MEMBERS"]);

  const result = await rest.runMethod(
    "delete",
    endpoints.GUILD_BAN(guildId, id),
  );

  return result;
}

// aliases
export { unban as unbanMember };
