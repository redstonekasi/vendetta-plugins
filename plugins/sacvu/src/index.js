import { ReactNative } from "@vendetta/metro/common";
import { storage } from "@vendetta/plugin";
import { loader } from "@vendetta";

import payload from "./payload.js" assert {type: "raw"};

export const onLoad = async function() {
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

    const [readPath, writeTarget, writeVjs] = ReactNative.Platform.select({
        default: ["/data/user/0/com.discord/cache/vendetta.js", "cache", "vendetta.js"],
        ios: [
            `${nativeModuleProxy.DCDFileManager.getConstants().DocumentsDirPath}/vendetta.js`,
            "documents",
            "Documents/vendetta.js",
        ],
    });

    const oldVendetta = await nativeModuleProxy.DCDFileManager.readFile(readPath, "utf8");
    await nativeModuleProxy.DCDFileManager.writeFile(writeTarget, writeVjs, newVendetta, "utf8");
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