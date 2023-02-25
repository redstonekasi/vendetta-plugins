import { ReactNative } from "@vendetta/metro/common";
import { FormIcon, FormSwitchRow } from "@vendetta/ui/components/Forms";
import { useProxy } from "@vendetta/storage";
import { storage } from "@vendetta/plugin";

export default () => {
    useProxy(storage);

    return (
        <ReactNative.ScrollView>
            <FormSwitchRow
                label="True random"
                subLabel="Use Math.random instead of a seeded random."
                leading={<FormIcon source={vendetta.ui.assets.getAssetIDByName("ic_add_24px")} />}
                onValueChange={(v) => {
                    vendetta.plugin.storage.random = v;
                }}
                value={vendetta.plugin.storage.random}
            />
        </ReactNative.ScrollView>
    );
};
