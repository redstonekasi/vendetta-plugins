import { instead } from "@vendetta/patcher";

export const onUnload = instead("setCommunicationModeOn", nativeModuleProxy.AudioManager, () => {});
