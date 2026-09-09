import { Camera, CameraView } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [torchOn, setTorchOn] = useState(false);
  const [mode, setMode] = useState("off"); // 'off', 'solid', 'strobe', 'sos'

  const strobeSpeed = 300; // Speed in milliseconds
  const intervalRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const stopBlinking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    stopBlinking();

    if (mode === "off") {
      setTorchOn(false);
    } else if (mode === "solid") {
      setTorchOn(true);
    } else if (mode === "strobe") {
      intervalRef.current = setInterval(() => {
        setTorchOn((prev) => !prev);
      }, strobeSpeed);
    } else if (mode === "sos") {
      let step = 0;
      const pattern = [
        150, 150, 150, 150, 150, 450, 450, 150, 450, 150, 450, 450, 150, 150,
        150, 150, 150, 1000,
      ];

      const runSOS = () => {
        setTorchOn((prev) => !prev);
        const duration = pattern[step % pattern.length];
        step++;
        intervalRef.current = setTimeout(runSOS, duration);
      };
      runSOS();
    }

    return () => stopBlinking();
  }, [mode]);

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting permission...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera/flashlight.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* CameraView handles the torch connection on iOS and Android */}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        enableTorch={torchOn}
        facing="back"
      />

      <View style={styles.controls}>
        <Text style={styles.title}>Lumina Flashlight</Text>

        <TouchableOpacity
          style={[styles.button, mode === "solid" && styles.active]}
          onPress={() => setMode(mode === "solid" ? "off" : "solid")}
        >
          <Text style={styles.btnText}>Solid Light</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, mode === "strobe" && styles.active]}
          onPress={() => setMode(mode === "strobe" ? "off" : "strobe")}
        >
          <Text style={styles.btnText}>Strobe Light</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, mode === "sos" && styles.active]}
          onPress={() => setMode(mode === "sos" ? "off" : "sos")}
        >
          <Text style={styles.btnText}>SOS Mode</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  controls: { zIndex: 1, width: "85%", alignItems: "center" },
  title: { color: "#FFF", fontSize: 26, fontWeight: "bold", marginBottom: 40 },
  button: {
    backgroundColor: "#222",
    padding: 18,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginVertical: 8,
  },
  active: { backgroundColor: "#FFD700" },
  btnText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  text: { color: "#FFF" },
});
