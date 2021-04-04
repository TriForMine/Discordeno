import { ws } from "./ws.ts";

/** Handler for processing all dispatch payloads that should be sent/forwarded to another server/vps/process. */
export async function handleDiscordPayload(
  data: DiscordPayload,
  shardId: number,
) {
  await fetch(ws.url, {
    headers: {
      authorization: ws.secretKey,
    },
    method: "post",
    body: JSON.stringify({
      shardId,
      data,
    }),
  }).catch(console.error);
}