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
      await interaction.reply(
        "Error: Please use an interval of greater than zero minutes."
      );
      return;
    } else if (interval > 1440) {
      await interaction.reply(
        "Error: Please use an interval of less than 1440 minutes."
      );
      return;
    }

    const updatedRows = await UserConfigModel.update(
      { interval: interval * 60 },
      { where: { uid: uid } }
    );

    if (updatedRows[0] > 0) {
      await interaction.reply("Interval updated successfully.");
    } else {
      await interaction.reply(
        "Error: User profile not found. Please create one using the `/reminders on` command."
      );
    }
  },
};

export default setIntervalCommand;
