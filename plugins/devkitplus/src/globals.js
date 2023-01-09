const apply = {
  ...vendetta.patcher,
  ...vendetta.metro,
  ...vendetta.metro.common,
  ...vendetta.utils,
  ...vendetta.debug,
};

delete apply["React"];

Object.assign(window, apply);

export default () => Object.keys(apply).forEach((k) => delete window[k]);
