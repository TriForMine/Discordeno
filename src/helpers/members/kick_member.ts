import { botId } from "../../bot.ts";
import { rest } from "../../rest/rest.ts";
import { Errors } from "../../types/misc/errors.ts";
import { endpoints } from "../../util/constants.ts";
import {
  highestRole,
  requireBotGuildPermissions,
} from "../../util/permissions.ts";

/** Kick a member from the server */
export async function kick(guildId: string, memberId: string, reason?: string) {
  const botsHighestRole = await highestRole(guildId, botId);
  const membersHighestRole = await highestRole(guildId, memberId);
  if (
    botsHighestRole && membersHighestRole &&
    botsHighestRole.position <= membersHighestRole.position
  ) {
    throw new Error(Errors.BOTS_HIGHEST_ROLE_TOO_LOW);
  }

  await requireBotGuildPermissions(guildId, ["KICK_MEMBERS"]);

  const result = await rest.runMethod(
    "delete",
    endpoints.GUILD_MEMBER(guildId, memberId),
    { reason },
  );

  return result;
}

// aliases
export { kick as kickMember };
