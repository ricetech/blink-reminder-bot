import { CommandDef } from "./types/CommandDef";
import { readdirSync } from "fs";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

const commands: CommandDef[] = [];
const commandFiles = readdirSync("./src/commands").filter((file) =>
  file.endsWith("Command.ts")
);

for (const file of commandFiles) {
  const command = require(`./commands/${file}`).default;
  console.log(command);
  commands.push(command.data.toJSON());
}

let { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;
if (!DISCORD_TOKEN) {
  DISCORD_TOKEN = "";
}
if (!CLIENT_ID) {
  CLIENT_ID = "";
}
if (!GUILD_ID) {
  GUILD_ID = "";
}

const rest = new REST({ version: "9" }).setToken(DISCORD_TOKEN);

(async () => {
  try {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });
    console.log("Successfully registered application commands.");
  } catch (error) {
    console.error(error);
  }
})();
