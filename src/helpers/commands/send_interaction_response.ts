import { applicationId, eventHandlers } from "../../bot.ts";
import { cache } from "../../cache.ts";
import { rest } from "../../rest/rest.ts";
import { DiscordenoInteractionResponse } from "../../types/discordeno/interaction_response.ts";
import { endpoints } from "../../util/constants.ts";

/**
 * Send a response to a users slash command. The command data will have the id and token necessary to respond.
 * Interaction `tokens` are valid for **15 minutes** and can be used to send followup messages.
 *
 * NOTE: By default we will suppress mentions. To enable mentions, just pass any mentions object.
 */
export async function sendInteractionResponse(
  id: string,
  token: string,
  options: DiscordenoInteractionResponse,
) {
  // If its already been executed, we need to send a followup response
  if (cache.executedSlashCommands.has(token)) {
    return rest.runMethod("post", endpoints.WEBHOOK(applicationId, token), {
      ...options,
    });
  }

  // Expire in 15 minutes
  cache.executedSlashCommands.set(token, id);
  setTimeout(
    () => {
      eventHandlers.debug?.(
        "loop",
        `Running setTimeout in send_interaction_response file.`,
      );
      cache.executedSlashCommands.delete(token);
    },
    900000,
  );

  // If the user wants this as a private message mark it ephemeral
  if (options.private) {
    options.data = { ...options.data, flags: 64 };
  }

  // If no mentions are provided, force disable mentions
  if (!options.data?.allowedMentions) {
    options.data = { ...options.data, allowedMentions: { parse: [] } };
  }

  const result = await rest.runMethod(
    "post",
    endpoints.INTERACTION_ID_TOKEN(id, token),
    options,
  );

  return result;
}
