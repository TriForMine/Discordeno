import { Collection } from "../util/collection.ts";
import { cleanupLoadingShards } from "./cleanup_loading_shards.ts";
import { createShard } from "./create_shard.ts";
import { log } from "./events.ts";
import { handleDiscordPayload } from "./handle_discord_payload.ts";
import { handleOnMessage } from "./handle_on_message.ts";
import { heartbeat } from "./heartbeat.ts";
import { identify } from "./identify.ts";
import { processQueue } from "./process_queue.ts";
import { resharder } from "./resharder.ts";
import { spawnShards } from "./spawn_shards.ts";
import { startGateway } from "./start_gateway.ts";
import { tellClusterToIdentify } from "./tell_cluster_to_identify.ts";
import { DiscordGatewayOpcodes } from "../types/codes/gateway_opcodes.ts";
import { DiscordVoiceOpcodes } from "../types/codes/voice_opcodes.ts";
import { createVoiceConnection } from "./voice/create_voice_connection.ts";
import { handleOnMessageVoice } from "./voice/handle_on_message_voice.ts";
import { setupVoiceConnection } from "./voice/setup_voice_connection.ts";
import { voiceHeartbeat } from "./voice/voice_heartbeat.ts";
import { voiceIdentify } from "./voice/voice_identify.ts";
import { createUdpConnection } from "./voice/create_udp_connection.ts";
import { sendVoice } from "./voice/send_voice.ts";

// CONTROLLER LIKE INTERFACE FOR WS HANDLING
export const ws = {
  /** The secret key authorization header the bot will expect when sending payloads */
  secretKey: "",
  /** The url that all discord payloads for the dispatch type should be sent to. */
  url: "",
  /** Whether or not to automatically reshard. */
  reshard: true,
  /** The percentage at which resharding should occur. */
  reshardPercentage: 80,
  /** The maximum shard Id number. Useful for zero-downtime updates or resharding. */
  maxShards: 0,
  /** Whether or not the resharder should automatically switch to LARGE BOT SHARDING when you are above 100K servers. */
  useOptimalLargeBotSharding: true,
  /** The amount of shards to load per cluster */
  shardsPerCluster: 25,
  /** The maximum amount of clusters to use for your bot. */
  maxClusters: 4,
  /** The first shard Id to start spawning. */
  firstShardId: 0,
  /** The last shard Id for this cluster. */
  lastShardId: 1,
  /** The identify payload holds the necessary data to connect and stay connected with Discords WSS. */
  identifyPayload: {
    token: "",
    compress: false,
    properties: {
      $os: "linux",
      $browser: "Discordeno",
      $device: "Discordeno",
    },
    intents: 0,
    shard: [0, 0],
  },
  botGatewayData: {
    /** The WSS URL that can be used for connecting to the gateway. */
    url: "wss://gateway.discord.gg/?v=8&encoding=json",
    /** The recommended number of shards to use when connecting. */
    shards: 1,
    /** Info on the current start limit. */
    sessionStartLimit: {
      /** The total number of session starts the current user is allowed. */
      total: 1000,
      /** The remaining number of session starts the current user is allowed. */
      remaining: 1000,
      /** Milliseconds left until limit is reset. */
      resetAfter: 0,
      /** The number of identify requests allowed per 5 seconds.
       * So, if you had a max concurrency of 16, and 16 shards for example, you could start them all up at the same time.
       * Whereas if you had 32 shards, if you tried to start up shard 0 and 16 at the same time for example, it would not work. You can start shards 0-15 concurrently, then 16-31...
       */
      maxConcurrency: 1,
    },
  },
  shards: new Collection<number, DiscordenoShard>(),
  /** guildId,  */
  voiceShards: new Collection<string, DiscordenoVoiceShard>(),
  loadingShards: new Collection<
    number,
    {
      shardId: number;
      resolve: (value: unknown) => void;
      reject: (reason?: unknown) => void;
      startedAt: number;
    }
  >(),
  /** Stored as bucketId: { clusters: [clusterId, [ShardIds]], createNextShard: boolean } */
  buckets: new Collection<
    number,
    { clusters: number[][]; createNextShard: boolean }
  >(),
  utf8decoder: new TextDecoder(),

  // METHODS

  /** The handler function that starts the gateway. */
  startGateway,
  /** The handler for spawning ALL the shards. */
  spawnShards,
  /** Create the websocket and adds the proper handlers to the websocket. */
  createShard,
  /** Begins identification of the shard to discord */
  identify,
  /** Begins heartbeating of the shard to keep it alive */
  heartbeat,
  /** Sends the discord payload to another server. */
  handleDiscordPayload,
  /** Tell the cluster/worker to begin identifying this shard  */
  tellClusterToIdentify,
  /** Handle the different logs. Used for debugging. */
  log,
  /** Handles resharding the bot when necessary. */
  resharder,
  /** Cleanups loading shards that were unable to load. */
  cleanupLoadingShards,
  /** Handles the message events from websocket */
  handleOnMessage,
  /** Handles processing queue of requests send to this shard */
  processQueue,

  // VOICE RELATED
  createVoiceConnection,
  createUdpConnection,
  handleOnMessageVoice,
  setupVoiceConnection,
  sendVoice,
  voiceHeartbeat,
  voiceIdentify,
};

export interface DiscordenoShard {
  /** The shard id number */
  id: number;
  /** The websocket for this shard */
  ws: WebSocket;
  /** The amount of milliseconds to wait between heartbeats */
  resumeInterval: number;
  /** The session id important for resuming connections. */
  sessionId: string;
  /** The previous sequence number, important for resuming connections. */
  previousSequenceNumber: number | null;
  /** Whether the shard is currently resuming. */
  resuming: boolean;
  /** Whether the shard has received the ready event */
  ready: boolean;
  /** The list of guild ids that are currently unavailable due to an outage. */
  unavailableGuildIds: Set<string>;
  heartbeat: Heartbeat;
  /** The items/requestst that are in queue to be sent to this shard websocket. */
  queue: WebSocketRequest[];
  /** Whether or not the queue for this shard is being processed. */
  processingQueue: boolean;
  /** When the first request for this minute has been sent. */
  queueStartedAt: number;
  /** The request counter of the queue */
  queueCounter: number;
}

export interface WebSocketRequest {
  op: DiscordGatewayOpcodes | DiscordVoiceOpcodes;
  d: unknown;
}

export interface DiscordenoVoiceShard {
  /** The websocket for this shard */
  ws: WebSocket;
  /** The token for this connection, received from VOICE_SERVER_UPDATE event when joining a voice channel */
  token?: string;
  /** The url for this connection, received from VOICE_SERVER_UPDATE event when joining a voice channel */
  url?: string;
  /** The sessionId for this connection, received from VOICE_STATE_UPDATE event when joining a voice channel */
  sessionId?: string;
  /** The channelId for this connection, received from VOICE_STATE_UPDATE event when joining a voice channel */
  channelId?: string;
  /** The shards ssrc received from discords hello event */
  ssrc?: number;
  /** The shards ip which we need to connect to received from discords hello event */
  ip?: string;
  /** The shards port which we need to connect to received from discords hello event */
  port?: number;
  /** The shards available modes we can use when connecting received from discords hello event */
  modes?: string;
  heartbeat: Heartbeat;
  // deno-lint-ignore no-explicit-any
  udp: any;
  sequence: number;
  timestamp: number;
  nonce: Uint8Array;
  view?: DataView;
  frame?: Uint8Array;
  address?: {
    port: number;
    hostname: string;
    transport: "udp";
  };
  secretKey: number[];
}

export interface Heartbeat {
  /** The exact timestamp the last heartbeat was sent */
  lastSentAt: number;
  /** The timestamp the last heartbeat ACK was received from discord. */
  lastReceivedAt: number;
  /** Whether or not the heartbeat was acknowledged  by discord in time. */
  acknowledged: boolean;
  /** Whether or not to keep heartbeating. Useful for when needing to stop heartbeating. */
  keepAlive: boolean;
  /** The interval between heartbeats requested by discord. */
  interval: number;
  /** The id of the interval, useful for stopping the interval if ws closed. */
  intervalId: number;
}
