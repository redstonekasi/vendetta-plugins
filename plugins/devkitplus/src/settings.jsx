import { ReactNative } from "@vendetta/metro/common";
import { FormDivider, FormIcon, FormSwitchRow } from "@vendetta/ui/components/Forms";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";

import globals from "./globals";

export default () => {
  useProxy(storage);

  return (
    <ReactNative.ScrollView>
      <FormSwitchRow
        label="Assign globals"
        subLabel="Assign modules, utils, patcher to window"
        leading={<FormIcon source={getAssetIDByName("ic_message_copy")} />}
        onValueChange={(v) => {
          storage.assignGlobals = v;
          globals(v);
        }}
        value={storage.assignGlobals}
      />
      <FormDivider />
      <FormSwitchRow
        label="Auto debugger"
        subLabel="Automatically connect to debugger on launch"
        leading={<FormIcon source={getAssetIDByName("copy")} />}
        onValueChange={(v) => (storage.autoDebugger = v)}
        value={storage.autoDebugger}
      />
      <FormDivider />
      {window.__vendetta_rdc && <FormSwitchRow
        label="Auto React DevTools"
        subLabel="Automatically connect to React DevTools"
        leading={<FormIcon source={getAssetIDByName("ic_badge_staff")} />}
        onValueChange={(v) => (storage.autoRDC = v)}
        value={storage.autoRDC}
      />}
    </ReactNative.ScrollView>
  );
};
