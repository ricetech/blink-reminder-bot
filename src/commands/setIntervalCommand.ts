import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { UserConfigModel } from "../db";

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
  async execute(interaction: CommandInteraction) {
    const uid = interaction.user.id;
    const interval = interaction.options.getInteger("interval", true);

    if (interval < 1) {
      await interaction.reply({
        content: "Error: Please use an interval of greater than zero minutes.",
        ephemeral: true,
      });
      return;
    } else if (interval > 1440) {
      await interaction.reply({
        content: "Error: Please use an interval of less than 1440 minutes.",
        ephemeral: true,
      });
      return;
    }

    const updatedRows = await UserConfigModel.update(
      { interval: interval * 60 },
      { where: { uid: uid } }
    );

    if (updatedRows[0] > 0) {
      await interaction.reply({
        content: "Interval updated successfully.",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content:
          "Error: User profile not found. Please create one using the `/reminders on` command.",
        ephemeral: true,
      });
    }
  },
};

export default setIntervalCommand;
