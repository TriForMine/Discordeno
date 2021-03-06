import { User } from "../users/user.ts";
import { SnakeCasedPropertiesDeep } from "../util.ts";
import { DiscordInteractionTypes } from "./interaction_types.ts";

export interface MessageInteraction {
  /** Id of the interaction */
  id: string;
  /** The type of interaction */
  type: DiscordInteractionTypes;
  /** The name of the ApplicationCommand */
  name: string;
  /** The user who invoked the interaction */
  user: User;
}

/** https://discord.com/developers/docs/interactions/slash-commands#messageinteraction */
export type DiscordMessageInteraction = SnakeCasedPropertiesDeep<
  MessageInteraction
>;
