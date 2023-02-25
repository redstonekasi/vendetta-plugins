console.log("VENDETTA FRENDETTA MAJORINCETTA");

const basicFind = (prop) => Object.values(window.modules).find(m => m?.publicModule.exports?.[prop])?.publicModule?.exports;
const color = basicFind("SemanticColor");

const provider = {
    xoshiro(key) {
        let h1 = 1779033703,
            h2 = 3144134277,
            h3 = 1013904242,
            h4 = 2773480762;
        for (let i = 0, k; i < key.length; i++) {
            k = key.charCodeAt(i);
            h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
            h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
            h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
            h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
        }
        h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
        h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
        h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
        h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
        let [a, b, c, d] = [(h1 ^ h2 ^ h3 ^ h4) >>> 0, (h2 ^ h1) >>> 0, (h3 ^ h1) >>> 0, (h4 ^ h1) >>> 0];
        return function murder() {
            let t = b << 9,
                r = a * 5;
            r = ((r << 7) | (r >>> 25)) * 9;
            c ^= a;
            d ^= b;
            b ^= c;
            a ^= d;
            c ^= t;
            d = (d << 11) | (d >>> 21);
            return (r >>> 0) / 4294967296;
        }
    },
    math: () => Math.random,
};

function computeColor(key) {
    const murder = provider["__RAND_PROVIDER__"](key);
    let g = "#";
    var h = "0123456789abcdef";
    for (var i = 0; i < 6; i++) {
        g += h[Math.floor(murder() * 16)];
    }
    return g;
}

const keys = Object.keys(color.default.colors);
const refs = Object.values(color.default.colors);
const computedColors = {};

const oldRaw = color.default.unsafe_rawColors;
color.default.unsafe_rawColors = new Proxy(oldRaw, {
    get: (_, prop) => (computedColors[prop] ??= computeColor(prop)),
});

color.default.meta.resolveSemanticColor = (theme, ref) => {
    let name = keys[refs.indexOf(ref)];
    if (theme !== "dark") name = theme.toUpperCase() + "_" + name;
    return (computedColors[name] ??= computeColor(name));
};
