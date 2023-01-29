import { findByProps } from "@vendetta/metro";
import { before } from "@vendetta/patcher";
import { showToast } from "@vendetta/ui/toasts";
import { getAssetIDByName } from "@vendetta/ui/assets";

const ActionSheet = findByProps("hideActionSheet");
const unpatch = before("openLazy", ActionSheet, (args) => {
  if (args[1] !== "LongPressUrl") return;
  const [,, { header: { title: url }, options }] = args;

  options.push({
    label: "Install plugin",
    onPress: () =>
      vendetta.plugins.fetchPlugin(url).then(() => {
        const id = url;
        if (!id.endsWith("/")) id += "/";
        const plugin = vendetta.plugins.plugins[id];
        if (plugin)
          showToast(`Successfully installed ${plugin.manifest.name}`, getAssetIDByName("Check"));
      }).catch((e) => {
        showToast(e.message, getAssetIDByName("Small"));
      }),
  });

  return args;
});

export const onUnload = () => unpatch();
