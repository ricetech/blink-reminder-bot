import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { UserConfigModel } from "../db";

export const DEFAULT_INTERVAL_MINS = 20;

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
          await interaction.reply({
            content: `Your blink reminders were already ${state}. Nothing was changed.`,
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: `Your blink reminders are now turned ${state}.`,
            ephemeral: true,
          });
        }
      }
    } else {
      try {
        await UserConfigModel.create({
          uid: uid,
          enabled: enabled,
          interval: DEFAULT_INTERVAL_MINS * 60,
        });
        await interaction.reply({
          content: `Your blink reminders are now turned ${state} and your reminder interval has been set to 20 minutes. You can change the reminder interval using \`/setinterval\`.`,
          ephemeral: true,
        });
      } catch (e) {
        console.error(e);
        return interaction.reply({
          content: "Something went wrong with creating your profile.",
          ephemeral: true,
        });
      }
    }
  },
};

export default reminderStateChangeCommand;
