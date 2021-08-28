// noinspection JSIgnoredPromiseFromCall

import dotenv from "dotenv";
import { Client, Intents } from "discord.js";

import { DataTypes, Sequelize } from "sequelize";

dotenv.config();

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
});

const db = new Sequelize("BlinkReminderBot", "user", "", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "BlinkReminderBot.sqlite",
});

const UserConfig = db.define("UserConfig", {
  // Discord User ID
  uid: {
    type: DataTypes.STRING,
    unique: true,
  },
  // Blink Reminder Messages enabled
  enabled: {
    type: DataTypes.BOOLEAN,
  },
  // Interval between messages in seconds
  interval: {
    type: DataTypes.INTEGER,
  },
});

client.once("ready", () => {
  UserConfig.sync();
  console.log("Ready!");
});

client.on("presenceUpdate", (oldPresence, newPresence) => {
  console.log(
    "Presence update for " + newPresence.user?.tag + ": " + newPresence.status
  );
});

client.login(process.env.DISCORD_TOKEN);
