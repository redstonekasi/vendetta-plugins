const { ReactNative } = vendetta.metro.common;
const { FormDivider, FormIcon, FormSwitchRow } = vendetta.ui.components.Forms;
const { getAssetIDByName } = vendetta.ui.assets;
const { storage } = vendetta.plugin;

import globals from "./globals";

export default () => {
  const [assignGlobals, setAssignGlobals] = React.useState(storage.assignGlobals);
  const [autoDebugger, setAutoDebugger] = React.useState(storage.autoDebugger);
  const [autoRDC, setAutoRDC] = React.useState(storage.autoRDC);

  return (
    <ReactNative.ScrollView>
      <FormSwitchRow
        label="Assign globals"
        subLabel="Assign modules, utils, patcher to window"
        leading={<FormIcon source={getAssetIDByName("ic_message_copy")} />}
        onValueChange={(v) => {
          setAssignGlobals(v)
          globals(v);
        }}
        value={assignGlobals}
      />
      <FormDivider />
      <FormSwitchRow
        label="Auto debugger"
        subLabel="Automatically connect to debugger on launch"
        leading={<FormIcon source={getAssetIDByName("copy")} />}
        onValueChange={setAutoDebugger}
        value={autoDebugger}
      />
      <FormDivider />
      <FormSwitchRow
        label="Auto React DevTools"
        subLabel="Automatically connect to React DevTools"
        leading={<FormIcon source={getAssetIDByName("ic_badge_staff")} />}
        onValueChange={setAutoRDC}
        value={autoRDC}
      />
    </ReactNative.ScrollView>
  );
};
