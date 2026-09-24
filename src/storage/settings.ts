import AsyncStorage from "@react-native-async-storage/async-storage";

import { defaultSettings, LuminaSettings } from "../types/settings";

const SETTINGS_KEY = "@lumina_settings";

export const getSettings = async (): Promise<LuminaSettings> => {
  try {
    const savedSettings = await AsyncStorage.getItem(SETTINGS_KEY);

    if (!savedSettings) {
      return defaultSettings;
    }

    const parsedSettings = JSON.parse(savedSettings);

    return {
      ...defaultSettings,
      ...parsedSettings,
    };
  } catch (error) {
    console.log("Failed to load settings:", error);

    return defaultSettings;
  }
};

export const saveSettings = async (settings: LuminaSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.log("Failed to save settings:", error);
  }
};
