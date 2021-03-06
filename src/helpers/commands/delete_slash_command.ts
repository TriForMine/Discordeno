import { applicationId } from "../../bot.ts";
import { rest } from "../../rest/rest.ts";
import { endpoints } from "../../util/constants.ts";

/** Deletes a slash command. */
export async function deleteSlashCommand(
  id: string,
  guildId?: string,
): Promise<undefined> {
  const result = await rest.runMethod(
    "delete",
    guildId
      ? endpoints.COMMANDS_GUILD_ID(applicationId, guildId, id)
      : endpoints.COMMANDS_ID(applicationId, id),
  );

  return result;
}
