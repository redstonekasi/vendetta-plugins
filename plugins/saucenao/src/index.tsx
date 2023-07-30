import { React, ReactNative as RN } from "@vendetta/metro/common";
import { Forms } from "@vendetta/ui/components";
import { findByProps } from "@vendetta/metro";
import { after, before } from "@vendetta/patcher";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";

const { FormRow } = Forms;
const Icon = findByProps("Sizes", "compare") as unknown as React.ElementType;

const ActionSheet = findByProps("openLazy", "hideActionSheet");
const { openURL } = findByProps("openURL", "openDeeplink");

const SearchIcon = <Icon source={getAssetIDByName("search")} />

interface Service {
  name: string; // service's name
  url: string; // service url with %s template
  default?: boolean; // on by default?
}

const services: Record<string, Service> = {
  saucenao: {
    name: "SauceNAO",
    url: `https://saucenao.com/search.php?url=%s`,
    default: true,
  },
  tracemoe: {
    name: "trace.moe",
    url: `https://trace.moe/?url=%s`,
    default: true,
  },
  iqdb: {
    name: "IQDB",
    url: `https://iqdb.org/?url=%s`,
  },
  imgops: {
    name: "ImgOps",
    url: `https://imgops.com/%s`,
  },
  tineye: {
    name: "TinEye",
    url: `https://tineye.com/search?url=%s`,
  },
  google: {
    name: "Google Images",
    url: `https://www.google.com/searchbyimage?image_url=%s&safe=off&sbisrc=cr_1_5_2`,
  },
  yandex: {
    name: "Yandex Images",
    url: `https://yandex.com/images/search?rpt=imageview&url=%s`,
  },
};


// Just for a bit of separation
export const onLoad = () => {
  storage.services ??= {};
  for (const [id, service] of Object.entries(services))
    storage.services[id] ??= service.default ?? false;
};

export const onUnload = before("openLazy", ActionSheet, ([component, key]) => {
  if (key !== "MediaShareActionSheet") return;
  component.then((instance) => {
    const unpatchInstance = after("default", instance, ([{ syncer }], res) => {
      React.useEffect(() => void unpatchInstance(), []);

      let source = syncer.sources[syncer.index.value];
      if (Array.isArray(source)) source = source[0];
      const url = source.sourceURI ?? source.uri;

      const rows = res.props.children.props.children; // findInReactTree?

      rows.push(...Object.keys(services).filter((id) => storage.services[id]).map((id) =>
        <FormRow
          leading={SearchIcon}
          label={services[id].name}
          onPress={() => openURL(services[id].url.replace("%s", url))}
        />
      ));
    });
  });
});

const { FormSection, FormDivider, FormRadioRow } = Forms;

export const settings = () => {
  useProxy(storage);

  return (
    <RN.ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 38 }}>
      <FormSection title="Services">
        <RN.FlatList
          data={Object.entries(storage.services)}
          ItemSeparatorComponent={FormDivider}
          renderItem={({ item: [id, enabled] }) =>
            <FormRadioRow
              label={services[id].name}
              selected={enabled}
              onPress={() => void (storage.services[id] = !storage.services[id])}
            />
          }
        />
      </FormSection>
    </RN.ScrollView>
  );
}
