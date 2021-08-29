import { SlashCommandBuilder } from "@discordjs/builders";
import { BaseCommandInteraction } from "discord.js";

const setIntervalCommand = {
  data: new SlashCommandBuilder()
    .setName("setinterval")
    .setDescription(
      "Set how often the bot will remind you to blink in minutes."
    )
    .addIntegerOption((option) =>
      option
        .setName("interval")
        .setDescription("Time between blink reminders in minutes")
        .setRequired(true)
    ),
  async execute(interaction: BaseCommandInteraction) {
    await interaction.reply("Command 'setinterval' not implemented yet!");
  },
};

export default setIntervalCommand;
