import { findByProps, findByName, findByStoreName } from "@vendetta/metro";
import { after } from "@vendetta/patcher";
import { ReactNative } from "@vendetta/metro/common";

const { Pressable } = findByProps("Button", "Text", "View");
const ProfileBanner = findByName("ProfileBanner", false);
const HeaderAvatar = findByName("HeaderAvatar", false);
const GuildIcon = findByName("GuildIcon");
const { openMediaModal } = findByName("MediaModal", false);
const { hideActionSheet } = findByProps("hideActionSheet");
const { getChannelId } = findByStoreName("SelectedChannelStore");
const { getGuildId } = findByStoreName("SelectedGuildStore");

function openModal(uri, event) {
  ReactNative.Image.getSize(uri, (width, height) => {
    hideActionSheet(); // hide user sheet
    openMediaModal({
      initialSources: [
        {
          uri,
          sourceURI: uri,
          width,
          height,
          guildId: getGuildId(),
          channelId: getChannelId(),
        },
      ],
      initialIndex: 0,
      originLayout: {
        width: 0, // this would ideally be the size of the small pfp but this proved very hard to implement
        height: 0,
        x: event.pageX,
        y: event.pageY,
        resizeMode: "fill",
      },
    });
  });
}

const unpatchAvatar = after("default", HeaderAvatar, ([{ user, style, guildId }], res) => {
  const guildSpecific = user.guildMemberAvatars?.[guildId] && `https://cdn.discordapp.com/guilds/${guildId}/users/${user.id}/avatars/${user.guildMemberAvatars[guildId]}.png`;
  const image = user?.getAvatarURL?.(false, 4096, true);
  if (!image) return res;

  const url =
    typeof image === "number"
      ? `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`
      : image?.replace(".webp", ".png");

  delete res.props.style;

  return (
    <Pressable
      onPress={({ nativeEvent }) => openModal(url, nativeEvent)}
      onLongPress={({ nativeEvent }) => guildSpecific && openModal(guildSpecific, nativeEvent)}
      style={style}>
      {res}
    </Pressable>
  );
});

const unpatchBanner = after("default", ProfileBanner, ([{ bannerSource }], res) => {
  if (typeof bannerSource?.uri !== "string" || !res) return res;

  const url = bannerSource.uri
    .replace(/(?:\?size=\d{3,4})?$/, "?size=4096")
    .replace(".webp", ".png");

  return <Pressable onPress={({ nativeEvent }) => openModal(url, nativeEvent)}>{res}</Pressable>;
});

const unpatchGuildIcon = after("render", GuildIcon.prototype, function (_, res) {
  if (this.props?.size !== "XLARGE") return;
  const url = this.props?.guild?.getIconURL?.(4096);
  if (!url) return res;

  return (
    <Pressable onPress={({ nativeEvent }) => openModal(url, nativeEvent)}>
      {res}
    </Pressable>
  );
});

export function onUnload() {
  unpatchAvatar();
  unpatchBanner();
  unpatchGuildIcon();
}
