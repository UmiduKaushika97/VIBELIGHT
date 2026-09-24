export type AlertMode = "strobe" | "sos" | "solid";

export type FlashSpeed = "slow" | "normal" | "fast";

export interface LuminaSettings {
  flashOnCall: boolean;
  flashOnSms: boolean;
  flashOnNotification: boolean;

  alertMode: AlertMode;

  flashSpeed: FlashSpeed;

  sosEnabled: boolean;
}

export const defaultSettings: LuminaSettings = {
  flashOnCall: false,
  flashOnSms: false,
  flashOnNotification: false,

  alertMode: "strobe",

  flashSpeed: "normal",

  sosEnabled: false,
};
