import { SnakeCasedPropertiesDeep } from "../util.ts";
import { ApplicationCommandOption } from "./application_command_option.ts";

export interface CreateGlobalApplicationCommand {
  /** 1-31 character name matching `^[\w-]{1,32}$` */
  name: string;
  /** 1-100 character description */
  description: string;
  /** The parameters for the command */
  options?: ApplicationCommandOption[];
}

/** https://discord.com/developers/docs/interactions/slash-commands#create-global-application-command-json-params */
export type DiscordCreateGlobalApplicationCommand = SnakeCasedPropertiesDeep<
  CreateGlobalApplicationCommand
>;
