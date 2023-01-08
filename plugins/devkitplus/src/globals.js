const apply = {
  ...vendetta.patcher,
  ...vendetta.metro,
  ...vendetta.metro.common,
  ...vendetta.utils,
  ...vendetta.debug,
};

Object.assign(window, apply);

export default () => Object.keys(apply).forEach((k) => delete window[k]);
