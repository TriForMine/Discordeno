import { SnakeCasedPropertiesDeep } from "../util.ts";
import { TeamMember } from "./team_member.ts";

export interface Team {
  /** A hash of the image of the team's icon */
  icon: string | null;
  /** The unique id of the team */
  id: string;
  /** The members of the team */
  members: TeamMember[];
  /** The user id of the current team owner */
  ownerUserId: string;
}

/** https://discord.com/developers/docs/topics/teams#data-models-team-object */
export type DiscordTeam = SnakeCasedPropertiesDeep<Team>;
