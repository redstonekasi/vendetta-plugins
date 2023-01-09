// gonna make this configurable later

// react-devtools-core auto reconnects every 2 seconds by default
if (window.__vendetta_rdc) {
  const { showToast } = vendetta.ui.toasts;
  const { getAssetIDByName } = vendetta.ui.assets;
  const { StyleSheet } = vendetta.metro.common.ReactNative;

  const ws = new WebSocket("ws://10.0.0.12:8097");

  ws.addEventListener("open", () => void showToast("Connected to React DevTools", getAssetIDByName("Check")));
  ws.addEventListener("close", () => void showToast("Disconnect from React DevTools", getAssetIDByName("Small")));

  window.__vendetta_rdc.connectToDevTools({
    websocket: ws,
    resolveRNStyle: StyleSheet.flatten,
  });
}

// this is only run once since you'd permanently have the annoying toasts if it didn't
vendetta.debug.connectToDebugger("10.0.0.12:9090");
