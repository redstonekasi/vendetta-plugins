const { findByProps, findByDisplayName } = vendetta.metro;
const { React } = vendetta.metro.common;
const { after } = vendetta.patcher;
const { getSize } = vendetta.metro.common.ReactNative.Image;

const { Pressable } = findByProps("Button", "Text", "View");
const ProfileBanner = findByDisplayName("ProfileBanner", false);
const HeaderAvatar = findByDisplayName("HeaderAvatar", false);
const { openMediaModal } = vendetta.metro.findByDisplayName("MediaModal", false);
const { hideActionSheet } = findByProps("hideActionSheet");

function openModal(uri, event) {
  hideActionSheet(); // hide user sheet

  getSize(uri, (width, height) =>
    openMediaModal({
      initialSources: [
        {
          uri,
          width,
          height,
        },
      ],
      initialIndex: 0,
      originLayout: {
        width: 0, // this would ideally be the size of the small pfp but this proved very hard to implement
        height: 0,
        x: event.pageX,
        y: event.pageY,
        resizeMode: "center",
      },
    }),
  );
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

export function onUnload() {
  unpatchAvatar();
  unpatchBanner();
}
