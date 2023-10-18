import { findByProps } from "@vendetta/metro";
import { after, instead } from "@vendetta/patcher";

const MessagesHandlersModule = findByProps("MessagesHandlers");

export const onUnload = after("MessagesHandlers", MessagesHandlersModule, (_, ret) => {
  if (ret?.handleCopyText) instead("handleCopyText", ret, () => {});
});
