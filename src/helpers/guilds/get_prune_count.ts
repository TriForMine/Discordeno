import { rest } from "../../rest/rest.ts";
import { GetGuildPruneCountQuery } from "../../types/guilds/get_guild_prune_count.ts";
import { Errors } from "../../types/misc/errors.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotGuildPermissions } from "../../util/permissions.ts";
import { camelKeysToSnakeCase } from "../../util/utils.ts";

/** Check how many members would be removed from the server in a prune operation. Requires the KICK_MEMBERS permission */
export async function getPruneCount(
  guildId: string,
  options?: GetGuildPruneCountQuery,
) {
  if (options?.days && options.days < 1) throw new Error(Errors.PRUNE_MIN_DAYS);
  if (options?.days && options.days > 30) {
    throw new Error(Errors.PRUNE_MAX_DAYS);
  }

  await requireBotGuildPermissions(guildId, ["KICK_MEMBERS"]);

  const result = await rest.runMethod(
    "get",
    endpoints.GUILD_PRUNE(guildId),
    camelKeysToSnakeCase(options ?? {}),
  );

  return result.pruned as number;
}
