export interface Resume {
  /** Session token */
  token: string;
  /** Session id */
  sessionId: string;
  /** Last sequence number received */
  seq: number;
}

/** https://discord.com/developers/docs/topics/gateway#resume */
export type DiscordResume = Resume;
