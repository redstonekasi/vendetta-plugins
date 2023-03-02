import { ReactNative } from "@vendetta/metro/common";
import { findByProps } from "@vendetta/metro";
import { id, storage } from "@vendetta/plugin";
import { plugins, loader, version } from "@vendetta";

import payload from "./payload.js" assert {type: "raw"};

export const onLoad = async function() {
    // if (ReactNative.Platform.OS !== "android") {
    //     const Dialog = findByProps("show", "openLazy", "close");
    //     Dialog.show({
    //         title: "Explode",
    //         body: "This is not available on iOS for now.",
    //         confirmText: "Okay",
    //     });
    //     // Vendetta will explode if I don't setTimeout since removing the plugin while it's loading causes issues.
    //     setTimeout(() => plugins.removePlugin(id), 200);
    //     return;
    // }
    
    __vendetta_loader.features.loaderConfig = false;
    loader.config.customLoadUrl = {
        enabled: true,
        url: "http://0.0.0.0",
    };

    const ven = await fetch("https://raw.githubusercontent.com/vendetta-mod/builds/master/vendetta.js", { cache: "no-store" });
    if (!ven.ok) return;

    const vendettaJs = await ven.text();
    const wrappedPayload = `(()=>{${payload.replace("__RAND_PROVIDER__", storage.random ? "math" : "xoshiro")}})();`;
    const newVendetta = wrappedPayload + "\n" + vendettaJs;
    
    const path = ReactNative.Platform.select({
        default: "/data/user/0/com.discord/cache/vendetta.js",
        ios: `${nativeModuleProxy.DCDFileManager.getConstants().DocumentsDirPath}/vendetta.js`,
    });

    const target = ReactNative.Platform.select({
        default: "cache",
        ios: "documents",
    });

    const vjsPath = ReactNative.Platform.select({
        default: "vendetta.js",
        ios: "Documents/vendetta.js",
    });

    const oldVendetta = await nativeModuleProxy.DCDFileManager.readFile(path, "utf8");
    await nativeModuleProxy.DCDFileManager.writeFile(target, vjsPath, newVendetta, "utf8");
    if (oldVendetta !== newVendetta)
        ReactNative.NativeModules.BundleUpdaterManager.reload();
}

export const onUnload = () => {
    // I could make it save the old url but I don't want to right now.
    // Though if I do I might as well make it also influence which URL we download Vendetta from in here.
    loader.config.customLoadUrl = {
        enabled: false,
        url: "http://localhost:4040/vendetta.js",
    };

    // Give Vendetta time to do it's thing
    setTimeout(() => ReactNative.NativeModules.BundleUpdaterManager.reload(), 200);
};

export { default as settings } from "./settings.jsx";