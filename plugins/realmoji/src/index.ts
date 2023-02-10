import { ReactNative } from "@vendetta/metro/common";
import { before } from "@vendetta/patcher";
import { PartialLinkNode, PartialMessage } from "./def";

const regex = /https:\/\/cdn.discordapp.com\/emojis\/(\d+).(webp|gif|png)/;

const trimSpaces = (s: string) => s.replace(/^[ \t]+/, "").replace(/[ \t]+$/, "");

/* i10 logTag, z10 unused */
const unpatch = before("updateRows", ReactNative.NativeModules.DCDChatManager, ([i10, rowsJSON, z10]: [number, string, boolean]) => {
  const parsed = JSON.parse(rowsJSON) as Array<any>;

  for (const row of parsed) {
    if (row.message && (row.changeType !== 3)) {
      const { content, embeds } = row.message as PartialMessage;
      if (!Array.isArray(content)) continue;

      const firstEmojiNode = content.findIndex((n) => n.type === "link" && regex.test(n.target));

      // There are no shelter/vendetta appended freemojis in this message
      if (firstEmojiNode === -1)
        continue;

      const originalContent = [...content];

      // Parse block of emoji urls
      const emojiNodes = content
        .splice(firstEmojiNode)
        .filter((n) => n.type !== "text" || n.content !== "\n") as PartialLinkNode[];

      const emojis: [string, string, boolean][] = emojiNodes
        .map((n) => regex.exec(n.target))
        .filter(Boolean)
        .map(([, id, type]) => [id, `https://cdn.discordapp.com/emojis/${id}.webp?size=160`, type === "gif"]);

      const embedUrls = emojiNodes.map((n) => n.target);

      if (!content.length) {
        row.message.content = originalContent;
        continue;
      }

      // Freemoji leaves "holes" in it's messages, "  ". We fill these in using
      // the available emojis.
      for (let i = 0; i < content.length; i++) {
        const el = content[i];
        if (el.type !== "text") continue;

        let idx = el.content.indexOf("  ");
        if (idx === -1) idx = el.content.lastIndexOf("\n");;
        if (idx === -1) continue;

        const emoji = emojis.shift();
        if (!emoji) break;

        const [id, url, animated] = emoji;

        const a = el.content.slice(0, idx);
        const b = el.content.slice(idx);

        el.content = (i !== 0 ? " " : "") + trimSpaces(a) + " ";
        content.splice(i + 1, 0, {
          type: "customEmoji",
          id,
          alt: "<realmoji>",
          src: url,
          frozenSrc: animated ? url.replace("webp", "gif") : url,
        }, {
          type: "text",
          content: " " + trimSpaces(b),
        });
      }

      const lastTextNode = content[content.length - 1];
      if (lastTextNode?.type === "text")
        lastTextNode.content === "\n"
          ? content.length = content.length - 1
          : lastTextNode.content = lastTextNode.content.trimEnd();

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
