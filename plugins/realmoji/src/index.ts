import { ReactNative } from "@vendetta/metro/common";
import { before } from "@vendetta/patcher";
import { PartialLinkNode, PartialMessage } from "./def";

const regex = /https:\/\/cdn.discordapp.com\/emojis\/(\d+).webp\?size=\d+/;

/* i10 logTag, z10 unused */
const unpatch = before("updateRows", ReactNative.NativeModules.DCDChatManager, ([i10, rowsJSON, z10]: [number, string, boolean]) => {
  const parsed = JSON.parse(rowsJSON) as Array<any>;

  for (const row of parsed) {
    console.log(row);
    if (row.message && (row.changeType !== 3)) {
      const { content, embeds } = row.message as PartialMessage;
      if (!content) continue;

      const lastTextNode = content.findLastIndex((n) => n.type === "text" && n.content !== "\n");

      // There are no shelter/vendetta appended freemojis in this message
      if (lastTextNode === - 1 || lastTextNode === content.length - 1)
        continue;

      const emojiNodes = content
        .splice(lastTextNode + 1)
        .filter((n) => n.type !== "text" || n.content !== "\n") as PartialLinkNode[];
      if (emojiNodes.some((n) => n.type !== "link")) continue;

      const emojis = emojiNodes
        .map((n) => regex.exec(n.target))
        .filter(Boolean)
        .map(([, id]) => [id, `https://cdn.discordapp.com/emojis/${id}.webp?size=160`]);

      const normalUrlNodes = emojiNodes
        .filter((n) => regex.test(n.target));

      content.push(...normalUrlNodes);

      const embedUrls = emojiNodes.map((n) => n.target);

      // Freemoji leaves "holes" in it's messages, "  ". We fill these in using
      // the available emojis.
      for (let i = 0; i < content.length; i++) {
        const el = content[i];
        if (el.type !== "text") continue;

        const emoji = emojis.shift();
        if (!emoji) break;

        let idx = el.content.indexOf("  ");
        if (idx === -1) idx = el.content.lastIndexOf("\n");;
        if (idx === -1) continue;

        const [id, url] = emoji;

        const a = el.content.slice(0, idx);
        const b = el.content.slice(idx);

        el.content = (i !== 0 ? " " : "") + a.trim() + " ";
        content.splice(i + 1, 0, {
          type: "customEmoji",
          id,
          alt: "<realmoji>",
          src: url,
          frozenSrc: url,
          // jumboable: true,
        }, {
          type: "text",
          content: " " + b.trim(),
        });
      }

      for (let i = 0; i < embeds.length; i++) {
        const embed = embeds[i];
        if (embed.type === "image" && embedUrls.includes(embed.url))
          embeds.splice(i--, 1);
      }
    }
  }

  return [i10, JSON.stringify(parsed), z10];
});

export const onUnload = () => unpatch();
