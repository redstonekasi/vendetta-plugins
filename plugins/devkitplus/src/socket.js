// gonna make this configurable later

if (window.__vendetta_rdc) {
  const { StyleSheet } = vendetta.metro.common.ReactNative;
  
  window.__vendetta_rdc.connectToDevTools({
    host: "10.0.0.12",
    resolveRNStyle: StyleSheet.flatten,
  });
}

// this is only run once since you'd permanently have the annoying toasts if it didn't
vendetta.debug.connectToDebugger("10.0.0.12:9090");
