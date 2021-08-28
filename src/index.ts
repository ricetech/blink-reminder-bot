// noinspection JSIgnoredPromiseFromCall

import dotenv from "dotenv";
import { Client, Intents } from "discord.js";

dotenv.config();

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
});

client.once("ready", () => {
  console.log("Ready!");
});

client.on("presenceUpdate", (oldPresence, newPresence) => {
  console.log(
    "Presence update for " + newPresence.user?.tag + ": " + newPresence.status
  );
});

client.login(process.env.DISCORD_TOKEN);
