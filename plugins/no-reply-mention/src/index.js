const { before } = vendetta.patcher;
const Reply = vendetta.metro.findByProps("startTyping");

const unpatch = before("createPendingReply", Reply, (args) => {
  args[0].shouldMention = false;
  return args;
});

export const onUnload = () => unpatch();
