const ActionSheet = vendetta.metro.findByProps("hideActionSheet");
const { before } = vendetta.patcher;
const { showToast } = vendetta.ui.toasts;
const { getAssetIDByName } = vendetta.ui.assets;

const unpatch = before("openLazy", ActionSheet, (args) => {
  const [, name, { header: { title: url }, options }] = args;
  if (name !== "LongPressUrl") return;

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
