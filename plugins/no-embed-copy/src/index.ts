import { findByName } from "@vendetta/metro";
import { after, instead } from "@vendetta/patcher";

const Chat = findByName("Chat");

export const onUnload = after("render", Chat.prototype, (_, ret) => {
  instead("onTapCopyText", ret.props, () => {});
});
