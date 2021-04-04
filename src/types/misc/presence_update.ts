import { User } from "../users/user.ts";
import { SnakeCaseProps } from "../util.ts";
import { Activity } from "./activity.ts";
import { ClientStatus } from "./client_status.ts";

export interface PresenceUpdate {
  /** The user presence is being updated for */
  user: User;
  /** id of the guild */
  guildId: string;
  /** Either "idle", "dnd", "online", or "offline" */
  status: "idle" | "dnd" | "online" | "offline";
  /** User's current activities */
  activities: Activity[];
  /** User's platform-dependent status */
  clientStatus: ClientStatus;
}

/** https://discord.com/developers/docs/topics/gateway#presence-update */
export type DiscordPresenceUpdate = SnakeCaseProps<PresenceUpdate>;
