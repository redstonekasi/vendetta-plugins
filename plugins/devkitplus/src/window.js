import { after } from "@vendetta/patcher";

const bullets = [];

const snipe = (funcName, funcParent, oneTime = false) => {
  const unrecon = after(
    funcName,
    funcParent,
    (args, ret) => console.log(`RECON: ${funcName}`, args, ret),
    oneTime
  );
  bullets.push(unrecon);
  return unrecon;
};

const shotgun = (funcParent, oneTime = false) => {
  const unrecons = Object.getOwnPropertyNames(funcParent)
    .filter((field) => typeof funcParent[field] === "function")
    .map((funcName) => snipe(funcName, funcParent, oneTime));
  
  bullets.push(...unrecons);
  return () => unrecons.forEach((f) => f());
};

window.dk = {
  snipe,
  shotgun,
  wipe: () => {
    bullets.forEach((f) => f());
    bullets = [];
  },
};

export default () => delete window.dk;
