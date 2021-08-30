import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

const reminderStateChangeCommand = {
  data: new SlashCommandBuilder()
    .setName("reminders")
    .setDescription("Enable or disable blink reminders.")
    .addStringOption((option) =>
      option
        .setName("state")
        .setDescription("Whether to turn blink reminders on or off")
        .setRequired(true)
        .addChoice("on", "on")
        .addChoice("off", "off")
    ),
  async execute(interaction: CommandInteraction) {
    await interaction.reply("Command 'reminders' not implemented yet!");
  },
};

export default reminderStateChangeCommand;
