import { Camera, CameraView } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [torchOn, setTorchOn] = useState(false);
  const [mode, setMode] = useState("off");

  const timerRef = useRef(null);

  // ---------------------------------------
  // CAMERA PERMISSION
  // ---------------------------------------
  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();

      setHasPermission(status === "granted");
    };

    requestPermission();
  }, []);

  // ---------------------------------------
  // STOP TIMER
  // ---------------------------------------
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // ---------------------------------------
  // FLASHLIGHT MODES
  // ---------------------------------------
  useEffect(() => {
    stopTimer();

    // OFF
    if (mode === "off") {
      setTorchOn(false);
      return;
    }

    // SOLID
    if (mode === "solid") {
      setTorchOn(true);
      return;
    }

    // STROBE
    if (mode === "strobe") {
      setTorchOn(true);

      timerRef.current = setInterval(() => {
        setTorchOn((previous) => !previous);
      }, 300);

      return;
    }

    // SOS
    if (mode === "sos") {
      let step = 0;

      const pattern = [
        150, 150, 150, 150, 150, 450, 450, 150, 450, 150, 450, 450, 150, 150,
        150, 150, 150, 1000,
      ];

      const runSOS = () => {
        setTorchOn((previous) => !previous);

        const duration = pattern[step % pattern.length];

        step++;

        timerRef.current = setTimeout(runSOS, duration);
      };

      runSOS();
    }

    return () => {
      stopTimer();
    };
  }, [mode]);

  // ---------------------------------------
  // CENTER POWER BUTTON
  // ---------------------------------------
  const togglePower = () => {
    if (torchOn) {
      setMode("off");
    } else {
      setMode("solid");
    }
  };

  // ---------------------------------------
  // MODE BUTTON
  // ---------------------------------------
  const selectMode = (selectedMode) => {
    if (mode === selectedMode) {
      setMode("off");
    } else {
      setMode(selectedMode);
    }
  };

  // ---------------------------------------
  // PERMISSION LOADING
  // ---------------------------------------
  if (hasPermission === null) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    );
  }

  // ---------------------------------------
  // PERMISSION DENIED
  // ---------------------------------------
  if (hasPermission === false) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>
          Camera permission is required for the flashlight.
        </Text>
      </View>
    );
  }

  // ---------------------------------------
  // MAIN UI
  // ---------------------------------------
  return (
    <View style={styles.container}>
      {/* CAMERA / FLASHLIGHT */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        enableTorch={torchOn}
        pointerEvents="none"
      />

      {/* DARK UI BACKGROUND */}
      <View style={styles.background} pointerEvents="none" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>LUMINA</Text>

        <Text style={styles.subtitle}>FLASHLIGHT</Text>
      </View>

      {/* MAIN TORCH AREA */}
      <View style={styles.torchArea}>
        {/* SOS */}
        <TouchableOpacity
          style={[
            styles.circleButton,
            styles.sosButton,
            mode === "sos" && styles.activeButton,
          ]}
          onPress={() => selectMode("sos")}
          activeOpacity={0.7}
        >
          <Text style={[styles.iconText, mode === "sos" && styles.activeText]}>
            SOS
          </Text>

          <Text style={[styles.label, mode === "sos" && styles.activeText]}>
            SOS
          </Text>
        </TouchableOpacity>

        {/* STROBE */}
        <TouchableOpacity
          style={[
            styles.circleButton,
            styles.strobeButton,
            mode === "strobe" && styles.activeButton,
          ]}
          onPress={() => selectMode("strobe")}
          activeOpacity={0.7}
        >
          <Text
            style={[styles.iconText, mode === "strobe" && styles.activeText]}
          >
            ⚡
          </Text>

          <Text style={[styles.label, mode === "strobe" && styles.activeText]}>
            Strobe
          </Text>
        </TouchableOpacity>

        {/* SOLID */}
        <TouchableOpacity
          style={[
            styles.circleButton,
            styles.solidButton,
            mode === "solid" && styles.activeButton,
          ]}
          onPress={() => selectMode("solid")}
          activeOpacity={0.7}
        >
          <Text
            style={[styles.iconText, mode === "solid" && styles.activeText]}
          >
            ☀
          </Text>

          <Text style={[styles.label, mode === "solid" && styles.activeText]}>
            Solid
          </Text>
        </TouchableOpacity>

        {/* OFF */}
        <TouchableOpacity
          style={[
            styles.circleButton,
            styles.offButton,
            mode === "off" && styles.activeButton,
          ]}
          onPress={() => setMode("off")}
          activeOpacity={0.7}
        >
          <Text style={[styles.iconText, mode === "off" && styles.activeText]}>
            ○
          </Text>

          <Text style={[styles.label, mode === "off" && styles.activeText]}>
            OFF
          </Text>
        </TouchableOpacity>

        {/* TORCH IMAGE */}

        <Image
          source={require("../../assets/torch.png")}
          style={[styles.torchImage, torchOn && styles.torchImageOn]}
          resizeMode="contain"
          pointerEvents="none"
        />

        {/* CENTER POWER BUTTON */}
        <TouchableOpacity
          style={[styles.powerButton, torchOn && styles.powerButtonActive]}
          onPress={togglePower}
          activeOpacity={0.8}
        >
          <Text style={[styles.powerIcon, torchOn && styles.powerIconActive]}>
            ⏻
          </Text>

          <Text style={[styles.powerText, torchOn && styles.powerTextActive]}>
            {torchOn ? "ON" : "OFF"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* STATUS */}
      <View style={styles.statusBox}>
        <View style={[styles.statusDot, torchOn && styles.statusDotActive]} />

        <Text style={styles.statusText}>
          {mode === "off" && "Flashlight Off"}
          {mode === "solid" && "Solid Light"}
          {mode === "strobe" && "Strobe Mode"}
          {mode === "sos" && "SOS Mode"}
        </Text>
      </View>
    </View>
  );
}

// ---------------------------------------
// STYLES
// ---------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
    justifyContent: "center",
    alignItems: "center",
  },

  loading: {
    flex: 1,
    width: "100%",
    backgroundColor: "#050505",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#ffffff",
    fontSize: 16,
  },

  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(5,5,5,0.92)",
  },

  // ---------------------------------------
  // HEADER
  // ---------------------------------------

  header: {
    position: "absolute",
    top: 55,
    alignItems: "center",
  },

  title: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 5,
  },

  subtitle: {
    color: "#777777",
    fontSize: 10,
    letterSpacing: 4,
    marginTop: 5,
  },

  // ---------------------------------------
  // TORCH AREA
  // ---------------------------------------

  torchArea: {
    width: 340,
    height: 420,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  // ---------------------------------------
  // TORCH IMAGE
  // ---------------------------------------

  torchImage: {
    position: "absolute",
    width: 210,
    height: 300,
    opacity: 0.85,
  },

  torchImageOn: {
    opacity: 1,
  },

  // ---------------------------------------
  // CENTER POWER
  // ---------------------------------------

  powerButton: {
    width: 95,
    height: 95,
    borderRadius: 48,
    backgroundColor: "#181818",
    borderWidth: 2,
    borderColor: "#444444",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,

    elevation: 10,
  },

  powerButtonActive: {
    backgroundColor: "#FFD600",
    borderColor: "#FFE873",
  },

  powerIcon: {
    color: "#ffffff",
    fontSize: 35,
    fontWeight: "bold",
  },

  powerIconActive: {
    color: "#111111",
  },

  powerText: {
    color: "#aaaaaa",
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 2,
  },

  powerTextActive: {
    color: "#111111",
  },

  // ---------------------------------------
  // CIRCULAR BUTTONS
  // ---------------------------------------

  circleButton: {
    position: "absolute",
    width: 72,
    height: 72,
    borderRadius: 36,

    backgroundColor: "#171717",

    borderWidth: 1,
    borderColor: "#383838",

    justifyContent: "center",
    alignItems: "center",

    zIndex: 30,
  },

  activeButton: {
    backgroundColor: "#FFD600",
    borderColor: "#FFE873",
  },

  activeText: {
    color: "#111111",
  },

  iconText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "bold",
  },

  label: {
    color: "#888888",
    fontSize: 9,
    marginTop: 3,
    fontWeight: "600",
  },

  // TOP
  sosButton: {
    top: 5,
  },

  // LEFT
  strobeButton: {
    left: 0,
    top: 175,
  },

  // RIGHT
  solidButton: {
    right: 0,
    top: 175,
  },

  // BOTTOM
  offButton: {
    bottom: 5,
  },

  // ---------------------------------------
  // STATUS
  // ---------------------------------------

  statusBox: {
    position: "absolute",
    bottom: 65,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#151515",

    paddingHorizontal: 18,
    paddingVertical: 10,

    borderRadius: 25,

    borderWidth: 1,
    borderColor: "#292929",
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,

    backgroundColor: "#555555",

    marginRight: 9,
  },

  statusDotActive: {
    backgroundColor: "#FFD600",
  },

  statusText: {
    color: "#999999",
    fontSize: 12,
    fontWeight: "600",
  },
});

<h1>completed</h1>