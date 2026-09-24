import React, { useEffect, useState } from "react";

import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    AlertMode,
    defaultSettings,
    FlashSpeed,
    LuminaSettings,
} from "../types/settings";

import { getSettings, saveSettings } from "../storage/settings";

interface SettingRowProps {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

interface SettingsScreenProps {
  onBack?: () => void;
}

const SettingRow: React.FC<SettingRowProps> = ({
  title,
  description,
  value,
  onValueChange,
}) => {
  return (
    <View style={styles.row}>
      <View style={styles.textContainer}>
        <Text style={styles.rowTitle}>{title}</Text>

        <Text style={styles.description}>{description}</Text>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: "#333333",
          true: "#FFD600",
        }}
        thumbColor={value ? "#111111" : "#888888"}
      />
    </View>
  );
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const [settings, setSettings] = useState<LuminaSettings>(defaultSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async (): Promise<void> => {
    const savedSettings = await getSettings();

    setSettings(savedSettings);
  };

  const updateSetting = async <K extends keyof LuminaSettings>(
    key: K,
    value: LuminaSettings[K],
  ): Promise<void> => {
    const newSettings: LuminaSettings = {
      ...settings,
      [key]: value,
    };

    setSettings(newSettings);

    await saveSettings(newSettings);
  };

  const selectAlertMode = async (mode: AlertMode): Promise<void> => {
    await updateSetting("alertMode", mode);
  };

  const selectFlashSpeed = async (speed: FlashSpeed): Promise<void> => {
    await updateSetting("flashSpeed", speed);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HEADER */}

        <View style={styles.header}>
          {onBack && (
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Text style={styles.backText}>‹</Text>
            </TouchableOpacity>
          )}

          <View>
            <Text style={styles.title}>Settings</Text>

            <Text style={styles.subtitle}>CUSTOMIZE LUMINA</Text>
          </View>
        </View>

        {/* ALERTS */}

        <Text style={styles.sectionTitle}>ALERTS</Text>

        <SettingRow
          title="Flash on Incoming Call"
          description="Flash the camera light when your phone rings"
          value={settings.flashOnCall}
          onValueChange={(value) => updateSetting("flashOnCall", value)}
        />

        <SettingRow
          title="Flash on SMS"
          description="Flash when an SMS message arrives"
          value={settings.flashOnSms}
          onValueChange={(value) => updateSetting("flashOnSms", value)}
        />

        <SettingRow
          title="Flash on Notifications"
          description="Flash for supported notifications"
          value={settings.flashOnNotification}
          onValueChange={(value) => updateSetting("flashOnNotification", value)}
        />

        {/* ALERT MODE */}

        <Text style={styles.sectionTitle}>ALERT MODE</Text>

        <View style={styles.optionContainer}>
          {(["strobe", "sos", "solid"] as AlertMode[]).map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.optionButton,
                settings.alertMode === mode && styles.optionButtonActive,
              ]}
              onPress={() => selectAlertMode(mode)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.optionText,
                  settings.alertMode === mode && styles.optionTextActive,
                ]}
              >
                {mode.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* FLASH SPEED */}

        <Text style={styles.sectionTitle}>FLASH SPEED</Text>

        <View style={styles.optionContainer}>
          {(["slow", "normal", "fast"] as FlashSpeed[]).map((speed) => (
            <TouchableOpacity
              key={speed}
              style={[
                styles.optionButton,
                settings.flashSpeed === speed && styles.optionButtonActive,
              ]}
              onPress={() => selectFlashSpeed(speed)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.optionText,
                  settings.flashSpeed === speed && styles.optionTextActive,
                ]}
              >
                {speed.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* SOS */}

        <Text style={styles.sectionTitle}>SOS</Text>

        <SettingRow
          title="Enable SOS"
          description="Allow SOS mode to be used for alerts"
          value={settings.sosEnabled}
          onValueChange={(value) => updateSetting("sosEnabled", value)}
        />

        {/* INFORMATION */}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>LUMINA ALERTS</Text>

          <Text style={styles.infoText}>
            When enabled, Lumina can use the camera flashlight to provide visual
            alerts.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
  },

  content: {
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 20,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "#333333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 35,
    lineHeight: 38,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
  },

  subtitle: {
    color: "#777777",
    fontSize: 9,
    letterSpacing: 3,
    marginTop: 3,
  },

  sectionTitle: {
    color: "#777777",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    marginTop: 20,
    marginBottom: 5,
    paddingHorizontal: 22,
  },

  row: {
    minHeight: 82,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    borderBottomWidth: 1,
    borderBottomColor: "#181818",
  },

  textContainer: {
    flex: 1,
    paddingRight: 15,
  },

  rowTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  description: {
    color: "#777777",
    fontSize: 11,
    marginTop: 5,
    lineHeight: 16,
  },

  optionContainer: {
    flexDirection: "row",
    paddingHorizontal: 22,
    gap: 8,
  },

  optionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "#333333",
    alignItems: "center",
  },

  optionButtonActive: {
    backgroundColor: "#FFD600",
    borderColor: "#FFE873",
  },

  optionText: {
    color: "#888888",
    fontSize: 10,
    fontWeight: "800",
  },

  optionTextActive: {
    color: "#111111",
  },

  infoBox: {
    marginHorizontal: 22,
    marginTop: 30,
    padding: 18,
    borderRadius: 15,
    backgroundColor: "#101010",
    borderWidth: 1,
    borderColor: "#252525",
  },

  infoTitle: {
    color: "#FFD600",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  infoText: {
    color: "#777777",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },
});
