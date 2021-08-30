import { DataTypes, Sequelize } from "sequelize";

export const db = new Sequelize("BlinkReminderBot", "user", "", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "BlinkReminderBot.sqlite",
});

export const UserConfigModel = db.define("UserConfig", {
  // Discord User ID
  uid: {
    primaryKey: true,
    type: DataTypes.STRING,
    unique: true,
  },
  // Blink Reminder Messages enabled
  enabled: {
    type: DataTypes.BOOLEAN,
  },
  // Interval between messages in seconds
  interval: {
    type: DataTypes.INTEGER,
  },
});
