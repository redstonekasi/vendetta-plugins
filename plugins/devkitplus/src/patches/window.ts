import { after } from "@vendetta/patcher";
import { find, findAll } from "@vendetta/metro";

const recons = [];

const snipe = (funcName, funcParent, oneTime = false) => {
  const unrecon = after(
    funcName,
    funcParent,
    (args, ret) => console.log(`RECON: ${funcName}`, args, ret),
    oneTime
  );
  recons.push(unrecon);
  return unrecon;
};

const shotgun = (funcParent, oneTime = false) => {
  const unrecons = Object.getOwnPropertyNames(funcParent)
    .filter((field) => typeof funcParent[field] === "function")
    .map((funcName) => snipe(funcName, funcParent, oneTime));
  
  recons.push(...unrecons);
  return () => unrecons.forEach((f) => f());
};

const keywordFilter = (ks) => (m) => ks.every((s) => Object.keys(m).some((k) => k.toLowerCase().includes(s.toLowerCase())));

export const findByKeyword = (...k) => find(keywordFilter(k));
export const findByKeywordAll = (...k) => findAll(keywordFilter(k));

window.dk = {
  snipe,
  shotgun,
  wipe: () => {
    recons.forEach((f) => f());
    recons.length = 0;
  },
  findByKeyword,
  findByKeywordAll
};

export default () => delete window.dk;
