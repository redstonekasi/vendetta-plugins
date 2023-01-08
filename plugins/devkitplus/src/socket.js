// gonna make this configurable later

// react-devtools-core auto reconnects every 2 seconds by default
if (window.__vendetta_rdc) window.__vendetta_rdc.connectToDevTools({ host: "10.0.0.12" });

// this is only run once since you'd permanently have the annoying toasts if it didn't
vendetta.debug.connectToDebugger("10.0.0.12:9090");
