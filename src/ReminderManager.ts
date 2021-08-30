import { Client } from "discord.js";
import { UserConfigModel } from "./db";

export class ReminderManager {
  private static instance: ReminderManager;
  public static getInstance(): ReminderManager {
    if (!ReminderManager.instance) {
      ReminderManager.instance = new ReminderManager();
    }
    return this.instance;
  }

  private client: Client | undefined;
  private reminders: Record<string, NodeJS.Timer | null> = {};
  public constructor() {}
  public init(client: Client) {
    this.client = client;
  }
  // Interval units in seconds
  public createReminder(uid: string, interval: number) {
    this.reminders[uid] = setInterval(async () => {
      if (!this.client) {
        console.error("Client is not defined");
        return;
      }
      const user = await this.client.users.fetch(uid);
      const dm = await user.createDM();
      await dm.send({
        content: `Don't forget to blink! It's been ${Math.round(
          interval / 60
        )} minutes.`,
      });
      // Recheck that reminders should be continued
    }, interval * 1000);
  }
  public async updateReminder(uid: string, interval: number) {
    /**
     * Prerequisites:
     * - User is not idle or offline
     * Conditions for overwriting or creating a new reminder:
     * - User profile exists in the database
     * - Reminders are enabled
     */
    const userConfig = await UserConfigModel.findOne({ where: { uid: uid } });
    if (userConfig && userConfig.get("enabled")) {
      if (!this.reminders[uid]) {
        this.createReminder(uid, interval);
      }
    }
  }
  public deleteReminder(uid: string) {
    if (this.reminders[uid] && this.reminders[uid] != null) {
      // @ts-ignore
      clearInterval(this.reminders[uid]);
      this.reminders[uid] = null;
    }
  }
}
