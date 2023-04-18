import { findByName } from "@vendetta/metro";
import { after, instead } from "@vendetta/patcher";

const Chat = findByName("Chat");

export const onUnload = after("render", Chat.prototype, (_, ret) => {
  if (ret?.props?.onTapCopyText) instead("onTapCopyText", ret.props, () => {});
});
