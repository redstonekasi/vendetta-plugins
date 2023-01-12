const { instead } = vendetta.patcher;
const Typing = vendetta.metro.findByProps("startTyping");

const patches = ["startTyping", "stopTyping"].map((k) => instead(k, Typing, () => {}));

export const onUnload = () => patches.forEach((unpatch) => unpatch());
