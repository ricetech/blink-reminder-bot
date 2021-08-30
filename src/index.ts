// noinspection JSIgnoredPromiseFromCall

import { config as dotenvConfig } from "dotenv";
import { Client, Collection, Intents } from "discord.js";

import { readdirSync } from "fs";

import { UserConfigModel } from "./db";

import { CommandClient } from "./types/CommandClient";
import { CommandDef } from "./types/CommandDef";

dotenvConfig();

const client: CommandClient = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
});

// Register commands
client.commands = new Collection();
const commandFiles = readdirSync("./src/commands").filter((file) =>
  file.endsWith("Command.ts")
);
for (const file of commandFiles) {
  const command: CommandDef = require(`./commands/${file}`).default;
  client.commands.set(command.data.name, command);
}

// Startup code
client.once("ready", () => {
  UserConfigModel.sync();
  console.log("Ready!");
});

// Presence Update handler
client.on("presenceUpdate", (oldPresence, newPresence) => {
  console.log(
    "Presence update for " + newPresence.user?.tag + ": " + newPresence.status
  );
});

// Slash command handler
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  if (!client.commands) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
