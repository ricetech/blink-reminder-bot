import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { UserConfigModel } from "../db";

const reminderStatusCommand = {
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("Check the status of your Blink Reminders."),
  async execute(interaction: CommandInteraction) {
    const uid = interaction.user.id;
    const userConfig = await UserConfigModel.findOne({ where: { uid: uid } });
    if (userConfig) {
      const enabledStr = userConfig.get("enabled") ? "on" : "off";
      const intervalMins = Math.round(<number>userConfig.get("interval") / 60);
      const intervalStr = intervalMins === 1 ? "" : "s";
      await interaction.reply({
        content: `Your blink reminders are currently **${enabledStr}**.\nYour reminder interval is set to ${intervalMins} minute${intervalStr}.`,
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content:
          "Looks like you don't have a profile set up yet. Use `/reminders on` to set up Blink Reminders.",
        ephemeral: true,
      });
    }
  },
};

export default reminderStatusCommand;
