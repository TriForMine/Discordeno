import { SnakeCasedPropertiesDeep } from "../util.ts";
import { RoleTags } from "./role_tags.ts";

export interface Role {
  /** Role id */
  id: string;
  /** Role name */
  name: string;
  /** Integer representation of hexadecimal color code */
  color: number;
  /** If this role is showed seperately in the user listing */
  hoist: boolean;
  /** Position of this role */
  position: number;
  /** Permission bit set */
  permissions: string;
  /** Whether this role is managed by an integration */
  managed: boolean;
  /** Whether this role is mentionable */
  mentionable: boolean;
  /** The tags this role has */
  tags?: RoleTags;
}

/** https://discord.com/developers/docs/topics/permissions#role-object-role-structure */
export type DiscordRole = SnakeCasedPropertiesDeep<Role>;
