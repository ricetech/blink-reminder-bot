// noinspection JSIgnoredPromiseFromCall

import dotenv from "dotenv";
import { Client, Intents } from "discord.js";

dotenv.config();

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS],
});

client.once("ready", () => {
  console.log("Ready!");
});

client.login(process.env.DISCORD_TOKEN);
