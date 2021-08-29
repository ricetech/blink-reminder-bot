import { SlashCommandBuilder } from "@discordjs/builders";
import { BaseCommandInteraction } from "discord.js";

export interface CommandDef {
  data: SlashCommandBuilder;
  execute: (interaction: BaseCommandInteraction) => Promise<void>;
}
