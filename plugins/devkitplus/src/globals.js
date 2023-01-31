import { patcher, metro, utils, debug } from "@vendetta";
import { common } from "@vendetta/metro";

const patch = () => {
  const apply = {
    ...patcher,
    ...metro,
    ...common,
    ...utils,
    ...debug,
  };

  delete apply["React"];

  Object.assign(window, apply);

  return () => Object.keys(apply).forEach((k) => delete window[k]);
}

let unpatch;

export default (on = true) => {
  unpatch?.();
  if (on) unpatch = patch();
}
