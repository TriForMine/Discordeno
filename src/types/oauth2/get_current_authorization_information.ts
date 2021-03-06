import { User } from "../users/user.ts";
import { SnakeCasedPropertiesDeep } from "../util.ts";
import { Application } from "./application.ts";
import { DiscordOAuth2Scopes } from "./scopes.ts";

export interface GetCurrentAuthorizationInformation {
  /** The current application */
  application: Partial<Application>;
  /** The scopes the user has authorized the application for */
  scopes: DiscordOAuth2Scopes[];
  /** When the access token expires */
  expires: string;
  /** The user who has authorized, if the user has authorized with the `identify` scope */
  user?: User;
}

/** https://discord.com/developers/docs/topics/oauth2#get-current-authorization-information-response-structure */
export type DiscordGetCurrentAuthoriationInformation = SnakeCasedPropertiesDeep<
  GetCurrentAuthorizationInformation
>;
