import { ReactNative as RN } from "@vendetta/metro/common";
import { instead } from "@vendetta/patcher";

export const onUnload = instead("setCommunicationModeOn", RN.NativeModules.AudioManager, () => {});
