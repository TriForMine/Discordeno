import { SnakeCasedPropertiesDeep } from "../util.ts";

export interface CreateGroupDM {
  /** Access tokens of users that have granted your app the `gdm.join` scope */
  accessTokens: string[];
  /** A dictionary of user ids to their respective nicknames */
  nicks: Record<string, string>;
}

/** https://discord.com/developers/docs/resources/user#create-group-dm */
export type DiscordCreateGroupDM = SnakeCasedPropertiesDeep<CreateGroupDM>;
