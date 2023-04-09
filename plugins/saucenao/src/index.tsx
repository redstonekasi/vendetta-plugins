import { React } from "@vendetta/metro/common";
import { Forms } from "@vendetta/ui/components";
import { findByName, findByProps } from "@vendetta/metro";
import { after, before } from "@vendetta/patcher";
import { getAssetIDByName } from "@vendetta/ui/assets";

const { FormRow } = Forms;
const Icon = findByName("Icon");

const ActionSheet = findByProps("openLazy", "hideActionSheet");
const { openURL } = findByProps("openURL", "openDeeplink");

const SearchIcon = <Icon source={getAssetIDByName("search")} />

export const onUnload = before("openLazy", ActionSheet, ([component, key]) => {
  if (key !== "MediaShareActionSheet") return;
  component.then((instance) => {
    const unpatchInstance = after("default", instance, ([{ syncer }], res) => {
      React.useEffect(() => void unpatchInstance(), []);

      let source = syncer.sources[syncer.index.value];
      if (Array.isArray(source)) source = source[0];
      const url = source.sourceURI ?? source.uri;

      const rows = res.props.children.props.children; // findInReactTree?

      rows.push(
        <FormRow
          leading={SearchIcon}
          label="SauceNAO"
          onPress={() => openURL(`https://saucenao.com/search.php?url=${encodeURIComponent(url)}`)}
        />,
        <FormRow
          leading={SearchIcon}
          label="trace.moe"
          onPress={() => openURL(`https://trace.moe/?url=${encodeURIComponent(url)}`)}
        />
      );
    });
  });
});
