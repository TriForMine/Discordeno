import { cacheHandlers } from "../../cache.ts";
import { rest } from "../../rest/rest.ts";
import { structures } from "../../structures/mod.ts";
import { DiscordGuildMember } from "../../types/guilds/guild_member.ts";
import { Errors } from "../../types/misc/errors.ts";
import { ModifyGuildMember } from "../../types/mod.ts";
import { PermissionStrings } from "../../types/permissions/permission_strings.ts";
import { endpoints } from "../../util/constants.ts";
import {
  requireBotChannelPermissions,
  requireBotGuildPermissions,
} from "../../util/permissions.ts";
import {
  camelKeysToSnakeCase,
  snakeKeysToCamelCase,
} from "../../util/utils.ts";

/** Edit the member */
export async function editMember(
  guildId: string,
  memberId: string,
  options: ModifyGuildMember,
) {
  const requiredPerms: Set<PermissionStrings> = new Set();

  if (options.nick) {
    if (options.nick.length > 32) {
      throw new Error(Errors.NICKNAMES_MAX_LENGTH);
    }
    requiredPerms.add("MANAGE_NICKNAMES");
  }

  if (options.roles) requiredPerms.add("MANAGE_ROLES");

  if (
    typeof options.mute !== "undefined" ||
    typeof options.deaf !== "undefined" ||
    (typeof options.channelId !== "undefined" || "null")
  ) {
    const memberVoiceState = (await cacheHandlers.get("guilds", guildId))
      ?.voiceStates.get(memberId);

    if (!memberVoiceState?.channelId) {
      throw new Error(Errors.MEMBER_NOT_IN_VOICE_CHANNEL);
    }

    if (typeof options.mute !== "undefined") {
      requiredPerms.add("MUTE_MEMBERS");
    }

    if (typeof options.deaf !== "undefined") {
      requiredPerms.add("DEAFEN_MEMBERS");
    }

    if (options.channelId) {
      const requiredVoicePerms: Set<PermissionStrings> = new Set([
        "CONNECT",
        "MOVE_MEMBERS",
      ]);
      if (memberVoiceState) {
        await requireBotChannelPermissions(
          memberVoiceState?.channelId,
          [...requiredVoicePerms],
        );
      }
      await requireBotChannelPermissions(
        options.channelId,
        [...requiredVoicePerms],
      );
    }
  }

  await requireBotGuildPermissions(guildId, [...requiredPerms]);

  const result = await rest.runMethod(
    "patch",
    endpoints.GUILD_MEMBER(guildId, memberId),
    camelKeysToSnakeCase(options),
  ) as DiscordGuildMember;
  const member = await structures.createDiscordenoMember(
    snakeKeysToCamelCase(result),
    guildId,
  );

  return member;
}
