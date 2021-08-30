import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

export interface CommandDef {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => Promise<void>;
}
