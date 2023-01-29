import { instead } from "@vendetta/patcher";
import { findByProps } from "@vendetta/metro";

const Typing = findByProps("startTyping");
const patches = ["startTyping", "stopTyping"].map((k) => instead(k, Typing, () => {}));

export const onUnload = () => patches.forEach((unpatch) => unpatch());
