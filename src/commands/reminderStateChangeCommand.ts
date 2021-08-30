import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { UserConfigModel } from "../db";

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
    const uid = interaction.user.id;
    const state = interaction.options.getString("state", true);
    const enabled: boolean = state == "on";

    const userConfig = await UserConfigModel.findOne({ where: { uid: uid } });

    if (userConfig) {
      const affectedRows = await UserConfigModel.update(
        { enabled: enabled },
        { where: { uid: uid } }
      );
      if (affectedRows[0] > 0) {
        if (enabled == userConfig.get("enabled")) {
          await interaction.reply(
            `Your blink reminders were already ${state}. Nothing was changed.`
          );
        } else {
          await interaction.reply(
            `Your blink reminders are now turned ${state}.`
          );
        }
      }
    } else {
      try {
        await UserConfigModel.create({
          uid: uid,
          enabled: enabled,
          interval: 20,
        });
        await interaction.reply(
          `Your blink reminders are now turned ${state}.`
        );
      } catch (e) {
        return interaction.reply(
          "Something went wrong with creating your profile."
        );
      }
    }
  },
};

export default reminderStateChangeCommand;
