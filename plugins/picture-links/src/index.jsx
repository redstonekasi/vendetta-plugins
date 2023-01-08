const { findByProps, findByDisplayName } = vendetta.metro;
const { navigation, React } = vendetta.metro.common;
const { after } = vendetta.patcher;
const { getSize } = vendetta.metro.common.ReactNative.Image;

const { Pressable } = findByProps("Button", "Text", "View");
const ProfileBanner = findByDisplayName("ProfileBanner", false);
const HeaderAvatar = findByDisplayName("HeaderAvatar", false);
const { openMediaModal } = vendetta.metro.findByDisplayName("MediaModal", false);

function openModal(uri, event) {
  navigation.popAll(); // pop user sheet

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
      originLayout: { width: 0, height: 0, x: event.pageX, y: event.pageY, resizeMode: "center" },
    }),
  );
}

const unpatchAvatar = after("default", HeaderAvatar, ([{ user, style }], res) => {
  window.a=user
  const image = user?.getAvatarURL?.(false, 4096, true);
  if (!image) return res;

  const discrim = user.discriminator % 5;
  const url =
    typeof image === "number"
      ? `https://cdn.discordapp.com/embed/avatars/${discrim}.png`
      : image?.replace(".webp", ".png");

  delete res.props.style;

  return (
    <Pressable onPress={({ nativeEvent }) => openModal(url, nativeEvent)} style={style}>
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
