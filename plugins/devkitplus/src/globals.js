const patch = () => {
  const apply = {
    ...vendetta.patcher,
    ...vendetta.metro,
    ...vendetta.metro.common,
    ...vendetta.utils,
    ...vendetta.debug,
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
