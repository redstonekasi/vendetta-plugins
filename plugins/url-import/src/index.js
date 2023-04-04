import { id } from "@vendetta/plugin";
import { removePlugin } from "@vendetta/plugins";
import { getAssetIDByName } from "@vendetta/ui/assets";
import { showToast } from "@vendetta/ui/toasts";

removePlugin(id);
showToast("URL import has been integrated into Vendetta and thus removed.", getAssetIDByName("ic_information_filled_24px"));

export const onUnload = () => {};
