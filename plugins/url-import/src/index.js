const ActionSheet = vendetta.metro.findByProps("hideActionSheet");
const { before } = vendetta.patcher;
const { showToast } = vendetta.ui.toasts;
const { getAssetIDByName } = vendetta.ui.assets;

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