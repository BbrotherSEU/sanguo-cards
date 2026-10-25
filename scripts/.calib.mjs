// src/data/moreHeroes.ts
var MORE_HEROES = [
  { id: "weiyan", name: "\u9B4F\u5EF6", title: "\u72C2\u9AA8\u6C49\u5347", faction: "shu", role: "warrior", rarity: "SSR", atk: 132, hp: 900, def: 46, skill: "\u53CD\u9AA8\u51B2\u9635", skillDesc: "\u4E0D\u8BA1\u751F\u6B7B\uFF0C\u91CD\u521B\u654C\u65B9\u5355\u4F53", color: "#6d1b1b" },
  { id: "fazheng", name: "\u6CD5\u6B63", title: "\u5947\u8C0B\u5B5D\u76F4", faction: "shu", role: "mage", rarity: "SSR", atk: 128, hp: 760, def: 34, skill: "\u5B9A\u519B\u5947\u7B56", skillDesc: "\u732E\u8BA1\u65A9\u5C06\uFF0C\u6CD5\u672F\u4F24\u5BB3\u654C\u65B9\u5168\u4F53", color: "#5e35b1" },
  { id: "madai", name: "\u9A6C\u5CB1", title: "\u897F\u51C9\u9A81\u9A91", faction: "shu", role: "dps", rarity: "SSR", atk: 136, hp: 820, def: 40, skill: "\u88AD\u8425\u53D6\u9996", skillDesc: "\u7ED5\u540E\u7A81\u88AD\uFF0C\u4F18\u5148\u65A9\u6740\u6B8B\u654C", color: "#8d6e63" },
  { id: "xiahouyuan", name: "\u590F\u4FAF\u6E0A", title: "\u864E\u6B65\u795E\u5C04", faction: "wei", role: "dps", rarity: "SSR", atk: 138, hp: 800, def: 36, skill: "\u5343\u91CC\u5954\u88AD", skillDesc: "\u4E09\u65E5\u4E94\u767E\u91CC\uFF0C\u72D9\u51FB\u751F\u547D\u6700\u4F4E\u8005", color: "#1565c0" },
  { id: "xunyu", name: "\u8340\u5F67", title: "\u738B\u4F50\u4E4B\u624D", faction: "wei", role: "mage", rarity: "SSR", atk: 124, hp: 780, def: 38, skill: "\u9A71\u864E\u541E\u72FC", skillDesc: "\u4E24\u5C01\u4E66\u4FE1\uFF0C\u6CD5\u672F\u52A8\u6447\u654C\u65B9\u5168\u4F53", color: "#3949ab" },
  { id: "caoren", name: "\u66F9\u4EC1", title: "\u5B88\u57CE\u94C1\u58C1", faction: "wei", role: "tank", rarity: "SSR", atk: 102, hp: 1240, def: 72, skill: "\u6A0A\u57CE\u636E\u5B88", skillDesc: "\u77E2\u77F3\u5982\u96E8\uFF0C\u91CD\u51FB\u6765\u72AF\u4E4B\u654C", color: "#455a64" },
  { id: "zhoutai", name: "\u5468\u6CF0", title: "\u5B64\u80C6\u62A4\u4E3B", faction: "wu", role: "tank", rarity: "SSR", atk: 108, hp: 1220, def: 70, skill: "\u8840\u8863\u536B\u4E3B", skillDesc: "\u521B\u53E3\u65E0\u6570\u4ECD\u4E0D\u9000\uFF0C\u91CD\u51FB\u5355\u4F53", color: "#b71c1c" },
  { id: "lusu", name: "\u9C81\u8083", title: "\u72EC\u65AD\u8054\u5218", faction: "wu", role: "mage", rarity: "SSR", atk: 122, hp: 800, def: 40, skill: "\u69BB\u4E0A\u7B56", skillDesc: "\u5408\u7EB5\u4E4B\u8BAE\u5316\u4E3A\u6CD5\u672F\uFF0C\u4F24\u5BB3\u5168\u4F53", color: "#00838f" },
  { id: "lingtong", name: "\u51CC\u7EDF", title: "\u6C5F\u8868\u864E\u81E3", faction: "wu", role: "warrior", rarity: "SSR", atk: 130, hp: 880, def: 48, skill: "\u5408\u6DDD\u7A81\u9635", skillDesc: "\u767D\u9A6C\u7A81\u5165\uFF0C\u91CD\u521B\u654C\u65B9\u5355\u4F53", color: "#e65100" },
  { id: "lukang", name: "\u9646\u6297", title: "\u5E7C\u8282\u5B88\u56FD", faction: "wu", role: "mage", rarity: "SSR", atk: 126, hp: 840, def: 44, skill: "\u897F\u9675\u7834\u56F4", skillDesc: "\u4ECE\u5BB9\u8C03\u5EA6\uFF0C\u6CD5\u672F\u8986\u76D6\u654C\u65B9\u5168\u4F53", color: "#2e7d32" },
  { id: "sunshangxiang", name: "\u5B59\u5C1A\u9999", title: "\u5F13\u8170\u59EC", faction: "wu", role: "dps", rarity: "SSR", atk: 134, hp: 800, def: 36, skill: "\u8FDE\u73E0\u7BAD", skillDesc: "\u5F13\u5F00\u6EE1\u6708\uFF0C\u4F18\u5148\u5C04\u6740\u6B8B\u654C", color: "#c2185b" },
  { id: "dongzhuo", name: "\u8463\u5353", title: "\u897F\u51C9\u592A\u5E08", faction: "qun", role: "tank", rarity: "SSR", atk: 110, hp: 1280, def: 68, skill: "\u66B4\u8650\u6A2A\u884C", skillDesc: "\u897F\u51C9\u94C1\u9A91\u8E0F\u9635\uFF0C\u91CD\u51FB\u5355\u4F53", color: "#4e342e" },
  { id: "jiaxu", name: "\u8D3E\u8BE9", title: "\u6BD2\u58EB\u4E71\u6B66", faction: "qun", role: "mage", rarity: "SSR", atk: 130, hp: 740, def: 34, skill: "\u79BB\u95F4\u4E09\u8BA1", skillDesc: "\u4E00\u8A00\u4E71\u519B\uFF0C\u6CD5\u672F\u4FB5\u8680\u654C\u65B9\u5168\u4F53", color: "#6a1b9a" },
  { id: "huaxiong", name: "\u534E\u96C4", title: "\u6C5C\u6C34\u5148\u950B", faction: "qun", role: "warrior", rarity: "SSR", atk: 128, hp: 900, def: 46, skill: "\u6E29\u9152\u672A\u51C9", skillDesc: "\u5173\u524D\u6426\u6218\uFF0C\u91CD\u521B\u654C\u65B9\u5355\u4F53", color: "#bf360c" },
  { id: "yanliang", name: "\u989C\u826F", title: "\u6CB3\u5317\u4E0A\u5C06", faction: "qun", role: "dps", rarity: "SSR", atk: 136, hp: 860, def: 42, skill: "\u767D\u9A6C\u7A81\u9A91", skillDesc: "\u4E07\u519B\u53D6\u9996\uFF0C\u65A9\u6740\u751F\u547D\u6700\u4F4E\u8005", color: "#ad1457" },
  { id: "caiwenji", name: "\u8521\u6587\u59EC", title: "\u80E1\u7B33\u5341\u516B\u62CD", faction: "qun", role: "heal", rarity: "SSR", atk: 96, hp: 920, def: 40, skill: "\u60B2\u6124\u629A\u7434", skillDesc: "\u7434\u97F3\u56DE\u8425\uFF0C\u6CBB\u7597\u6211\u65B9\u4F24\u52BF\u6700\u91CD\u8005", color: "#8e24aa" }
];

// src/data/heroes.ts
var HEROES = [
  {
    id: "liubei",
    name: "\u5218\u5907",
    title: "\u4EC1\u5FB7\u5C11\u4E3B",
    faction: "shu",
    role: "heal",
    rarity: "SSR",
    atk: 72,
    hp: 920,
    def: 48,
    skill: "\u4EC1\u5FB7\u53F7\u4EE4",
    skillDesc: "\u4E3A\u6211\u65B9\u5168\u4F53\u56DE\u590D\u751F\u547D\uFF0C\u5E76\u5C0F\u5E45\u63D0\u5347\u653B\u51FB",
    color: "#3d8b5a"
  },
  {
    id: "guanyu",
    name: "\u5173\u7FBD",
    title: "\u9752\u9F99\u5043\u6708",
    faction: "shu",
    role: "warrior",
    rarity: "SSR",
    atk: 128,
    hp: 860,
    def: 42,
    skill: "\u6E29\u9152\u65A9\u5C06",
    skillDesc: "\u5BF9\u654C\u65B9\u5355\u4F53\u9020\u6210\u9AD8\u989D\u7269\u7406\u4F24\u5BB3",
    color: "#c0392b"
  },
  {
    id: "zhangfei",
    name: "\u5F20\u98DE",
    title: "\u4E07\u592B\u83AB\u5F00",
    faction: "shu",
    role: "tank",
    rarity: "SSR",
    atk: 88,
    hp: 1180,
    def: 70,
    skill: "\u5486\u54EE\u7834\u9635",
    skillDesc: "\u5632\u8BBD\u5E76\u91CD\u521B\u654C\u65B9\u524D\u6392\uFF0C\u81EA\u8EAB\u51CF\u4F24",
    color: "#2c3e6b"
  },
  {
    id: "zhaoyun",
    name: "\u8D75\u4E91",
    title: "\u5E38\u5C71\u98DE\u5C06",
    faction: "shu",
    role: "dps",
    rarity: "SSR",
    atk: 120,
    hp: 900,
    def: 50,
    skill: "\u4E03\u8FDB\u4E03\u51FA",
    skillDesc: "\u8FDE\u7EED\u7A81\u88AD\u654C\u65B9\u8840\u91CF\u6700\u4F4E\u5355\u4F4D",
    color: "#ecf0f1"
  },
  {
    id: "zhugeliang",
    name: "\u8BF8\u845B\u4EAE",
    title: "\u5367\u9F99\u5148\u751F",
    faction: "shu",
    role: "mage",
    rarity: "SSR",
    atk: 135,
    hp: 780,
    def: 38,
    skill: "\u501F\u4E1C\u98CE",
    skillDesc: "\u5BF9\u654C\u65B9\u5168\u4F53\u9020\u6210\u6CD5\u672F\u4F24\u5BB3\uFF0C\u5E76\u964D\u9632",
    color: "#8e44ad"
  },
  {
    id: "huangyueying",
    name: "\u9EC4\u6708\u82F1",
    title: "\u5DE7\u601D\u624D\u5973",
    faction: "shu",
    role: "mage",
    rarity: "R",
    atk: 60,
    hp: 820,
    def: 40,
    skill: "\u6728\u725B\u6D41\u9A6C",
    skillDesc: "\u4E3A\u6211\u65B9\u56DE\u590D\u6012\u6C14\u5E76\u6CBB\u7597",
    color: "#27ae60"
  },
  {
    id: "caocao",
    name: "\u66F9\u64CD",
    title: "\u4E71\u4E16\u5978\u96C4",
    faction: "wei",
    role: "mage",
    rarity: "SSR",
    atk: 118,
    hp: 880,
    def: 52,
    skill: "\u631F\u5929\u5B50\u4EE4",
    skillDesc: "\u63D0\u5347\u6211\u65B9\u5168\u4F53\u653B\u51FB\uFF0C\u538B\u5236\u654C\u65B9",
    color: "#1a1a2e"
  },
  {
    id: "xiahoudun",
    name: "\u590F\u4FAF\u60C7",
    title: "\u72EC\u773C\u82CD\u72FC",
    faction: "wei",
    role: "tank",
    rarity: "SSR",
    atk: 85,
    hp: 1120,
    def: 68,
    skill: "\u521A\u70C8\u53CD\u51FB",
    skillDesc: "\u627F\u53D7\u4F24\u5BB3\u5E76\u53CD\u51FB\u654C\u65B9",
    color: "#34495e"
  },
  {
    id: "dianwei",
    name: "\u5178\u97E6",
    title: "\u53E4\u4E4B\u6076\u6765",
    faction: "wei",
    role: "tank",
    rarity: "SSR",
    atk: 78,
    hp: 1050,
    def: 62,
    skill: "\u53CC\u621F\u62A4\u4E3B",
    skillDesc: "\u5927\u5E45\u63D0\u5347\u81EA\u8EAB\u9632\u5FA1\u5E76\u5632\u8BBD",
    color: "#7f8c8d"
  },
  {
    id: "guojia",
    name: "\u90ED\u5609",
    title: "\u7B97\u65E0\u9057\u7B56",
    faction: "wei",
    role: "mage",
    rarity: "SSR",
    atk: 110,
    hp: 740,
    def: 36,
    skill: "\u5341\u80DC\u5341\u8D25",
    skillDesc: "\u5BF9\u654C\u65B9\u6CD5\u653B\u6700\u9AD8\u8005\u9020\u6210\u6CD5\u4F24\u5E76\u6C89\u9ED8",
    color: "#9b59b6"
  },
  {
    id: "simayi",
    name: "\u53F8\u9A6C\u61FF",
    title: "\u51A2\u864E\u9690\u8C0B",
    faction: "wei",
    role: "mage",
    rarity: "SSR",
    atk: 130,
    hp: 800,
    def: 44,
    skill: "\u72FC\u987E\u4E4B\u76F8",
    skillDesc: "\u5BF9\u5168\u4F53\u9020\u6210\u6CD5\u4F24\uFF0C\u5E76\u5077\u53D6\u653B\u51FB",
    color: "#2c1654"
  },
  {
    id: "sunquan",
    name: "\u5B59\u6743",
    title: "\u6C5F\u4E1C\u5C11\u4E3B",
    faction: "wu",
    role: "heal",
    rarity: "SSR",
    atk: 70,
    hp: 900,
    def: 50,
    skill: "\u5236\u8861\u4E4B\u7B56",
    skillDesc: "\u4E3A\u6211\u65B9\u63D0\u5347\u66B4\u51FB\u4E0E\u95EA\u907F",
    color: "#16a085"
  },
  {
    id: "zhouyu",
    name: "\u5468\u745C",
    title: "\u7F8E\u5468\u90CE",
    faction: "wu",
    role: "mage",
    rarity: "SSR",
    atk: 132,
    hp: 760,
    def: 40,
    skill: "\u706B\u70E7\u8D64\u58C1",
    skillDesc: "\u5BF9\u654C\u65B9\u5168\u4F53\u9020\u6210\u706B\u7130\u6CD5\u4F24",
    color: "#e74c3c"
  },
  {
    id: "luxun",
    name: "\u9646\u900A",
    title: "\u5112\u5C06\u706B\u653B",
    faction: "wu",
    role: "mage",
    rarity: "SSR",
    atk: 108,
    hp: 780,
    def: 38,
    skill: "\u706B\u70E7\u8FDE\u8425",
    skillDesc: "\u5BF9\u654C\u65B9\u9020\u6210\u6301\u7EED\u71C3\u70E7\u4F24\u5BB3",
    color: "#d35400"
  },
  {
    id: "taishici",
    name: "\u592A\u53F2\u6148",
    title: "\u4E49\u80C6\u5F13\u795E",
    faction: "wu",
    role: "warrior",
    rarity: "SSR",
    atk: 95,
    hp: 840,
    def: 40,
    skill: "\u7A7F\u6768\u795E\u5C04",
    skillDesc: "\u5BF9\u654C\u65B9\u540E\u6392\u9020\u6210\u7A7F\u900F\u4F24\u5BB3",
    color: "#2980b9"
  },
  {
    id: "xiaoqiao",
    name: "\u5C0F\u4E54",
    title: "\u56FD\u8272\u5929\u9999",
    faction: "wu",
    role: "heal",
    rarity: "R",
    atk: 55,
    hp: 800,
    def: 35,
    skill: "\u7434\u745F\u548C\u9E23",
    skillDesc: "\u6CBB\u7597\u6211\u65B9\u5E76\u9A71\u6563\u8D1F\u9762",
    color: "#f39c12"
  },
  {
    id: "lvbu",
    name: "\u5415\u5E03",
    title: "\u5929\u4E0B\u65E0\u53CC",
    faction: "qun",
    role: "warrior",
    rarity: "SSR",
    atk: 145,
    hp: 920,
    def: 48,
    skill: "\u65E0\u53CC\u4E71\u821E",
    skillDesc: "\u5BF9\u654C\u65B9\u5168\u4F53\u9020\u6210\u6BC1\u706D\u6253\u51FB",
    color: "#8b0000"
  },
  {
    id: "diaochan",
    name: "\u8C82\u8749",
    title: "\u95ED\u6708\u503E\u57CE",
    faction: "qun",
    role: "heal",
    rarity: "SSR",
    atk: 68,
    hp: 760,
    def: 32,
    skill: "\u9B45\u60D1\u79BB\u95F4",
    skillDesc: "\u9B45\u60D1\u654C\u65B9\u5355\u4F53\u653B\u51FB\u5176\u961F\u53CB",
    color: "#c71585"
  },
  {
    id: "huatuo",
    name: "\u534E\u4F57",
    title: "\u795E\u533B\u6D4E\u4E16",
    faction: "qun",
    role: "heal",
    rarity: "SR",
    atk: 50,
    hp: 860,
    def: 36,
    skill: "\u9752\u56CA\u5999\u672F",
    skillDesc: "\u5927\u5E45\u6CBB\u7597\u6211\u65B9\u8840\u91CF\u6700\u4F4E\u8005",
    color: "#1abc9c"
  },
  {
    id: "huangzhong",
    name: "\u9EC4\u5FE0",
    title: "\u8001\u5F53\u76CA\u58EE",
    faction: "shu",
    role: "dps",
    rarity: "SSR",
    atk: 100,
    hp: 820,
    def: 42,
    skill: "\u767E\u6B65\u7A7F\u6768",
    skillDesc: "\u5BF9\u654C\u65B9\u540E\u6392\u9020\u6210\u66B4\u51FB\u4F24\u5BB3",
    color: "#b7950b"
  },
  {
    id: "machao",
    name: "\u9A6C\u8D85",
    title: "\u9526\u9A6C\u8D85",
    faction: "shu",
    role: "dps",
    rarity: "SSR",
    atk: 115,
    hp: 860,
    def: 44,
    skill: "\u897F\u51C9\u94C1\u9A91",
    skillDesc: "\u51B2\u950B\u654C\u65B9\u524D\u6392\u5E76\u7729\u6655",
    color: "#27ae60"
  },
  {
    id: "ganning",
    name: "\u7518\u5B81",
    title: "\u9526\u5E06\u6E38\u4FA0",
    faction: "wu",
    role: "dps",
    rarity: "SSR",
    atk: 98,
    hp: 800,
    def: 38,
    skill: "\u767E\u9A91\u52AB\u8425",
    skillDesc: "\u5077\u88AD\u654C\u65B9\u5E76\u63D0\u5347\u81EA\u8EAB\u66B4\u51FB",
    color: "#1e8449"
  },
  {
    id: "zhangliao",
    name: "\u5F20\u8FBD",
    title: "\u5A01\u9707\u900D\u9065",
    faction: "wei",
    role: "warrior",
    rarity: "SSR",
    atk: 126,
    hp: 880,
    def: 48,
    skill: "\u5A01\u9707\u900D\u9065",
    skillDesc: "\u7A81\u88AD\u654C\u65B9\u540E\u6392\uFF0C\u4EE4\u5176\u80C6\u5BD2",
    color: "#1565c0"
  },
  {
    id: "sunce",
    name: "\u5B59\u7B56",
    title: "\u5C0F\u9738\u738B",
    faction: "wu",
    role: "warrior",
    rarity: "SSR",
    atk: 130,
    hp: 900,
    def: 46,
    skill: "\u9738\u738B\u51FB",
    skillDesc: "\u6C5F\u4E1C\u731B\u8FDB\uFF0C\u91CD\u521B\u654C\u65B9\u5355\u4F53",
    color: "#e53935"
  },
  {
    id: "zhenji",
    name: "\u7504\u59EC",
    title: "\u6D1B\u6C34\u4ED9\u59FF",
    faction: "wei",
    role: "heal",
    rarity: "SSR",
    atk: 78,
    hp: 840,
    def: 40,
    skill: "\u6D1B\u795E\u8D4B",
    skillDesc: "\u4EE5\u6D1B\u6C34\u4E4B\u59FF\u6CBB\u7597\u5E76\u5E87\u62A4\u6211\u65B9",
    color: "#5c6bc0"
  },
  {
    id: "jiangwei",
    name: "\u59DC\u7EF4",
    title: "\u5E7C\u9E92\u7EE7\u5FD7",
    faction: "shu",
    role: "mage",
    rarity: "SSR",
    atk: 124,
    hp: 820,
    def: 44,
    skill: "\u7EE7\u5FD7\u5317\u4F10",
    skillDesc: "\u627F\u8BF8\u845B\u4E4B\u5FD7\uFF0C\u6CD5\u672F\u8F70\u51FB\u654C\u9635",
    color: "#2e7d32"
  },
  {
    id: "zhangjiao",
    name: "\u5F20\u89D2",
    title: "\u5929\u516C\u5C06\u519B",
    faction: "qun",
    role: "mage",
    rarity: "SSR",
    atk: 128,
    hp: 800,
    def: 36,
    skill: "\u9EC4\u5929\u5F53\u7ACB",
    skillDesc: "\u592A\u5E73\u9053\u6CD5\u5E2D\u5377\u654C\u65B9\u5168\u4F53",
    color: "#8e24aa"
  },
  {
    id: "pangtong",
    name: "\u5E9E\u7EDF",
    title: "\u51E4\u96CF\u5148\u751F",
    faction: "shu",
    role: "mage",
    rarity: "SSR",
    atk: 112,
    hp: 760,
    def: 36,
    skill: "\u8FDE\u73AF\u8BA1",
    skillDesc: "\u732E\u8FDE\u73AF\u4E4B\u7B56\uFF0C\u706B\u653B\u654C\u65B9\u5168\u4F53",
    color: "#43a047"
  },
  {
    id: "xuchu",
    name: "\u8BB8\u891A",
    title: "\u864E\u75F4\u62A4\u9A7E",
    faction: "wei",
    role: "tank",
    rarity: "SSR",
    atk: 90,
    hp: 1160,
    def: 72,
    skill: "\u88F8\u8863\u6597\u9A6C",
    skillDesc: "\u864E\u75F4\u51FA\u9635\uFF0C\u91CD\u51FB\u5E76\u56FA\u5B88",
    color: "#1e88e5"
  },
  {
    id: "daqiao",
    name: "\u5927\u4E54",
    title: "\u56FD\u8272\u6C5F\u4E1C",
    faction: "wu",
    role: "heal",
    rarity: "SR",
    atk: 64,
    hp: 860,
    def: 38,
    skill: "\u6D41\u79BB",
    skillDesc: "\u7434\u97F3\u62A4\u4E3B\uFF0C\u6CBB\u7597\u6211\u65B9\u4F24\u5458",
    color: "#ef5350"
  },
  {
    id: "lvmeng",
    name: "\u5415\u8499",
    title: "\u767D\u8863\u6E21\u6C5F",
    faction: "wu",
    role: "warrior",
    rarity: "SSR",
    atk: 114,
    hp: 860,
    def: 46,
    skill: "\u767D\u8863\u6E21\u6C5F",
    skillDesc: "\u5947\u88AD\u8346\u5DDE\uFF0C\u65A9\u6740\u865A\u5F31\u4E4B\u654C",
    color: "#c62828"
  },
  {
    id: "yuanshao",
    name: "\u8881\u7ECD",
    title: "\u56DB\u4E16\u4E09\u516C",
    faction: "qun",
    role: "mage",
    rarity: "SSR",
    atk: 100,
    hp: 920,
    def: 42,
    skill: "\u6CB3\u5317\u96C4\u5175",
    skillDesc: "\u53F7\u4EE4\u5927\u519B\uFF0C\u538B\u5411\u654C\u65B9\u5168\u4F53",
    color: "#6a1b9a"
  },
  {
    id: "huanggai",
    name: "\u9EC4\u76D6",
    title: "\u82E6\u8089\u8001\u5C06",
    faction: "wu",
    role: "tank",
    rarity: "SR",
    atk: 82,
    hp: 1080,
    def: 64,
    skill: "\u82E6\u8089\u8BC8\u964D",
    skillDesc: "\u4EE5\u4F24\u6362\u52BF\uFF0C\u91CD\u51FB\u654C\u65B9\u5355\u4F53",
    color: "#d32f2f"
  },
  {
    id: "guanping",
    name: "\u5173\u5E73",
    title: "\u5C06\u95E8\u864E\u5B50",
    faction: "shu",
    role: "warrior",
    rarity: "R",
    atk: 96,
    hp: 840,
    def: 42,
    skill: "\u5043\u6708\u4F20\u627F",
    skillDesc: "\u627F\u7236\u4EB2\u5200\u6CD5\uFF0C\u91CD\u521B\u5355\u4F53",
    color: "#388e3c"
  },
  ...MORE_HEROES
];
var HERO_MAP = Object.fromEntries(HEROES.map((h) => [h.id, h]));
var BONDS = [
  {
    id: "taoyuan",
    name: "\u6843\u56ED\u7ED3\u4E49",
    heroes: ["liubei", "guanyu", "zhangfei"],
    bonusAtk: 0.12,
    bonusHp: 0.1,
    desc: "\u5218\u5907\u3001\u5173\u7FBD\u3001\u5F20\u98DE\u540C\u65F6\u4E0A\u9635",
    combo: "\u6843\u56ED\u4E09\u82F1\u51FB",
    comboMult: 2.4
  },
  {
    id: "wushuang",
    name: "\u7765\u7768\u5929\u4E0B",
    heroes: ["lvbu", "diaochan"],
    bonusAtk: 0.15,
    bonusHp: 0.05,
    desc: "\u5415\u5E03\u3001\u8C82\u8749\u540C\u65F6\u4E0A\u9635",
    combo: "\u65E0\u53CC\u503E\u57CE",
    comboMult: 2.8
  },
  {
    id: "chibi",
    name: "\u8D64\u58C1\u98CE\u4E91",
    heroes: ["zhouyu", "zhugeliang"],
    bonusAtk: 0.1,
    bonusHp: 0.08,
    desc: "\u5468\u745C\u3001\u8BF8\u845B\u4EAE\u540C\u65F6\u4E0A\u9635",
    combo: "\u8D64\u58C1\u4E1A\u706B",
    comboMult: 2.2
  },
  {
    id: "weiwu",
    name: "\u9B4F\u6B66\u96C4\u72EE",
    heroes: ["caocao", "xiahoudun", "dianwei"],
    bonusAtk: 0.1,
    bonusHp: 0.12,
    desc: "\u66F9\u64CD\u3001\u590F\u4FAF\u60C7\u3001\u5178\u97E6\u540C\u65F6\u4E0A\u9635",
    combo: "\u864E\u8D32\u51B2\u9635",
    comboMult: 2.3
  },
  {
    id: "jiangdong",
    name: "\u6C5F\u4E1C\u5B50\u5F1F",
    heroes: ["sunquan", "zhouyu", "xiaoqiao"],
    bonusAtk: 0.08,
    bonusHp: 0.1,
    desc: "\u5B59\u6743\u3001\u5468\u745C\u3001\u5C0F\u4E54\u540C\u65F6\u4E0A\u9635",
    combo: "\u6C5F\u4E1C\u6C34\u5E08",
    comboMult: 2.1
  },
  {
    id: "longdan",
    name: "\u9F99\u80C6\u6551\u4E3B",
    heroes: ["zhaoyun", "liubei"],
    bonusAtk: 0.08,
    bonusHp: 0.06,
    desc: "\u8D75\u4E91\u3001\u5218\u5907\u540C\u65F6\u4E0A\u9635",
    combo: "\u957F\u5742\u7A81\u56F4",
    comboMult: 2.1
  },
  {
    id: "wuhu",
    name: "\u4E94\u864E\u4E0A\u5C06",
    heroes: ["guanyu", "zhangfei", "zhaoyun", "huangzhong", "machao"],
    bonusAtk: 0.1,
    bonusHp: 0.08,
    desc: "\u5173\u7FBD\u3001\u5F20\u98DE\u3001\u8D75\u4E91\u3001\u9EC4\u5FE0\u3001\u9A6C\u8D85\u540C\u65F6\u4E0A\u9635",
    combo: "\u4E94\u864E\u65AD\u9B42",
    comboMult: 2.6
  },
  {
    id: "wolong",
    name: "\u5367\u9F99\u51E4\u96CF",
    heroes: ["zhugeliang", "pangtong"],
    bonusAtk: 0.1,
    bonusHp: 0.05,
    desc: "\u8BF8\u845B\u4EAE\u3001\u5E9E\u7EDF\u540C\u65F6\u4E0A\u9635",
    combo: "\u53CC\u661F\u5B9A\u7B56",
    comboMult: 2.2
  },
  {
    id: "qinse",
    name: "\u7434\u745F\u548C\u9E23",
    heroes: ["zhugeliang", "huangyueying"],
    bonusAtk: 0.06,
    bonusHp: 0.08,
    desc: "\u8BF8\u845B\u4EAE\u3001\u9EC4\u6708\u82F1\u540C\u65F6\u4E0A\u9635",
    combo: "\u673A\u5173\u9F50\u53D1",
    comboMult: 2
  },
  {
    id: "jizhi",
    name: "\u59DC\u7EF4\u7EE7\u5FD7",
    heroes: ["zhugeliang", "jiangwei"],
    bonusAtk: 0.08,
    bonusHp: 0.06,
    desc: "\u8BF8\u845B\u4EAE\u3001\u59DC\u7EF4\u540C\u65F6\u4E0A\u9635",
    combo: "\u5317\u4F10\u9057\u7B56",
    comboMult: 2.1
  },
  {
    id: "fuzi",
    name: "\u5173\u6C0F\u7236\u5B50",
    heroes: ["guanyu", "guanping"],
    bonusAtk: 0.08,
    bonusHp: 0.06,
    desc: "\u5173\u7FBD\u3001\u5173\u5E73\u540C\u65F6\u4E0A\u9635",
    combo: "\u5043\u6708\u53CC\u5200",
    comboMult: 2
  },
  {
    id: "luoshen",
    name: "\u6D1B\u795E\u8D4B",
    heroes: ["caocao", "zhenji"],
    bonusAtk: 0.06,
    bonusHp: 0.08,
    desc: "\u66F9\u64CD\u3001\u7504\u59EC\u540C\u65F6\u4E0A\u9635",
    combo: "\u6D1B\u6C34\u6E05\u6B4C",
    comboMult: 2
  },
  {
    id: "erqiao",
    name: "\u6C5F\u4E1C\u4E8C\u4E54",
    heroes: ["daqiao", "xiaoqiao"],
    bonusAtk: 0.05,
    bonusHp: 0.1,
    desc: "\u5927\u4E54\u3001\u5C0F\u4E54\u540C\u65F6\u4E0A\u9635",
    combo: "\u53CC\u4E54\u629A\u7434",
    comboMult: 2
  },
  {
    id: "bawang",
    name: "\u5C0F\u9738\u738B",
    heroes: ["sunce", "zhouyu"],
    bonusAtk: 0.09,
    bonusHp: 0.05,
    desc: "\u5B59\u7B56\u3001\u5468\u745C\u540C\u65F6\u4E0A\u9635",
    combo: "\u9738\u738B\u7834\u9635",
    comboMult: 2.2
  },
  {
    id: "kurou",
    name: "\u82E6\u8089\u8BA1",
    heroes: ["huanggai", "zhouyu"],
    bonusAtk: 0.08,
    bonusHp: 0.06,
    desc: "\u9EC4\u76D6\u3001\u5468\u745C\u540C\u65F6\u4E0A\u9635",
    combo: "\u706B\u8239\u8FDE\u8425",
    comboMult: 2.1
  },
  {
    id: "wuxia",
    name: "\u5434\u4E0B\u963F\u8499",
    heroes: ["lvmeng", "luxun"],
    bonusAtk: 0.08,
    bonusHp: 0.06,
    desc: "\u5415\u8499\u3001\u9646\u900A\u540C\u65F6\u4E0A\u9635",
    combo: "\u767D\u8863\u6E21\u6C5F",
    comboMult: 2.1
  },
  {
    id: "shuangxiong",
    name: "\u6C5F\u4E1C\u53CC\u96C4",
    heroes: ["sunce", "taishici"],
    bonusAtk: 0.08,
    bonusHp: 0.05,
    desc: "\u5B59\u7B56\u3001\u592A\u53F2\u6148\u540C\u65F6\u4E0A\u9635",
    combo: "\u795E\u4EAD\u5BF9\u621F",
    comboMult: 2.1
  },
  {
    id: "hubao",
    name: "\u864E\u536B\u53CC\u96C4",
    heroes: ["xuchu", "dianwei"],
    bonusAtk: 0.06,
    bonusHp: 0.1,
    desc: "\u8BB8\u891A\u3001\u5178\u97E6\u540C\u65F6\u4E0A\u9635",
    combo: "\u864E\u536B\u51B2\u6740",
    comboMult: 2.1
  },
  {
    id: "moushi",
    name: "\u9B3C\u624D\u51A2\u864E",
    heroes: ["guojia", "simayi"],
    bonusAtk: 0.1,
    bonusHp: 0.04,
    desc: "\u90ED\u5609\u3001\u53F8\u9A6C\u61FF\u540C\u65F6\u4E0A\u9635",
    combo: "\u7B97\u65E0\u9057\u7B56",
    comboMult: 2.2
  },
  {
    id: "jinfan",
    name: "\u9526\u5E06\u8D3C",
    heroes: ["ganning", "sunquan"],
    bonusAtk: 0.08,
    bonusHp: 0.05,
    desc: "\u7518\u5B81\u3001\u5B59\u6743\u540C\u65F6\u4E0A\u9635",
    combo: "\u767E\u9A91\u52AB\u8425",
    comboMult: 2
  },
  {
    id: "bingzhou",
    name: "\u5E76\u5DDE\u65E7\u90E8",
    heroes: ["lvbu", "zhangliao"],
    bonusAtk: 0.09,
    bonusHp: 0.05,
    desc: "\u5415\u5E03\u3001\u5F20\u8FBD\u540C\u65F6\u4E0A\u9635",
    combo: "\u5E76\u5DDE\u94C1\u9A91",
    comboMult: 2.2
  },
  {
    id: "qingnang",
    name: "\u9752\u56CA\u6D4E\u4E16",
    heroes: ["huatuo", "zhenji"],
    bonusAtk: 0.04,
    bonusHp: 0.1,
    desc: "\u534E\u4F57\u3001\u7504\u59EC\u540C\u65F6\u4E0A\u9635",
    combo: "\u9752\u56CA\u56DE\u6625",
    comboMult: 1.8
  },
  {
    id: "yuanting",
    name: "\u8881\u95E8\u65E7\u4E8B",
    heroes: ["yuanshao", "zhenji"],
    bonusAtk: 0.06,
    bonusHp: 0.06,
    desc: "\u8881\u7ECD\u3001\u7504\u59EC\u540C\u65F6\u4E0A\u9635",
    combo: "\u6CB3\u5317\u4F59\u5A01",
    comboMult: 1.9
  },
  {
    id: "huangjin",
    name: "\u9EC4\u5929\u5F53\u7ACB",
    heroes: ["zhangjiao", "huatuo"],
    bonusAtk: 0.07,
    bonusHp: 0.07,
    desc: "\u5F20\u89D2\u3001\u534E\u4F57\u540C\u65F6\u4E0A\u9635",
    combo: "\u592A\u5E73\u8981\u672F",
    comboMult: 2
  },
  {
    id: "sangu",
    name: "\u4E09\u987E\u8305\u5E90",
    heroes: ["liubei", "zhugeliang"],
    bonusAtk: 0.08,
    bonusHp: 0.05,
    desc: "\u5218\u5907\u3001\u8BF8\u845B\u4EAE\u540C\u65F6\u4E0A\u9635",
    combo: "\u8349\u5E90\u5BF9",
    comboMult: 2
  },
  {
    id: "yanyun",
    name: "\u71D5\u4EBA\u9F99\u80C6",
    heroes: ["zhangfei", "zhaoyun"],
    bonusAtk: 0.07,
    bonusHp: 0.06,
    desc: "\u5F20\u98DE\u3001\u8D75\u4E91\u540C\u65F6\u4E0A\u9635",
    combo: "\u957F\u5742\u53CC\u9A91",
    comboMult: 2
  },
  {
    id: "dingjun",
    name: "\u5B9A\u519B\u5947\u8C0B",
    heroes: ["huangzhong", "fazheng"],
    bonusAtk: 0.06,
    bonusHp: 0.07,
    desc: "\u9EC4\u5FE0\u3001\u6CD5\u6B63\u540C\u65F6\u4E0A\u9635",
    combo: "\u5B9A\u519B\u65A9\u5C06",
    comboMult: 2
  },
  {
    id: "xiliangxiong",
    name: "\u897F\u51C9\u5144\u5F1F",
    heroes: ["machao", "madai"],
    bonusAtk: 0.08,
    bonusHp: 0.05,
    desc: "\u9A6C\u8D85\u3001\u9A6C\u5CB1\u540C\u65F6\u4E0A\u9635",
    combo: "\u897F\u51C9\u51B2\u9635",
    comboMult: 2
  },
  {
    id: "fangu",
    name: "\u6C49\u5347\u53CD\u9AA8",
    heroes: ["weiyan", "huangzhong"],
    bonusAtk: 0.07,
    bonusHp: 0.06,
    desc: "\u9B4F\u5EF6\u3001\u9EC4\u5FE0\u540C\u65F6\u4E0A\u9635",
    combo: "\u6C49\u4E2D\u5B88\u5173",
    comboMult: 2
  },
  {
    id: "shuangmou",
    name: "\u8700\u4E2D\u53CC\u8C0B",
    heroes: ["pangtong", "fazheng"],
    bonusAtk: 0.06,
    bonusHp: 0.07,
    desc: "\u5E9E\u7EDF\u3001\u6CD5\u6B63\u540C\u65F6\u4E0A\u9635",
    combo: "\u53CC\u8C0B\u5B9A\u8700",
    comboMult: 2
  },
  {
    id: "hushi",
    name: "\u6C49\u5BA4\u864E\u5B50",
    heroes: ["liubei", "guanping"],
    bonusAtk: 0.08,
    bonusHp: 0.05,
    desc: "\u5218\u5907\u3001\u5173\u5E73\u540C\u65F6\u4E0A\u9635",
    combo: "\u864E\u5B50\u968F\u9A7E",
    comboMult: 2
  },
  {
    id: "beifa",
    name: "\u5317\u4F10\u5148\u950B",
    heroes: ["zhaoyun", "jiangwei"],
    bonusAtk: 0.07,
    bonusHp: 0.06,
    desc: "\u8D75\u4E91\u3001\u59DC\u7EF4\u540C\u65F6\u4E0A\u9635",
    combo: "\u7941\u5C71\u5148\u950B",
    comboMult: 2
  },
  {
    id: "longfeng",
    name: "\u9F99\u51E4\u5448\u7965",
    heroes: ["liubei", "sunshangxiang"],
    bonusAtk: 0.06,
    bonusHp: 0.07,
    desc: "\u5218\u5907\u3001\u5B59\u5C1A\u9999\u540C\u65F6\u4E0A\u9635",
    combo: "\u9F99\u51E4\u8FDE\u7406",
    comboMult: 2
  },
  {
    id: "jiameng",
    name: "\u846D\u840C\u5173",
    heroes: ["machao", "zhangfei"],
    bonusAtk: 0.08,
    bonusHp: 0.05,
    desc: "\u9A6C\u8D85\u3001\u5F20\u98DE\u540C\u65F6\u4E0A\u9635",
    combo: "\u591C\u6218\u846D\u840C",
    comboMult: 2
  },
  {
    id: "jiaxue",
    name: "\u6B66\u4FAF\u5BB6\u5B66",
    heroes: ["huangyueying", "jiangwei"],
    bonusAtk: 0.07,
    bonusHp: 0.06,
    desc: "\u9EC4\u6708\u82F1\u3001\u59DC\u7EF4\u540C\u65F6\u4E0A\u9635",
    combo: "\u673A\u5173\u76F8\u4F20",
    comboMult: 2
  },
  {
    id: "qishan",
    name: "\u7941\u5C71\u53CC\u5C06",
    heroes: ["jiangwei", "weiyan"],
    bonusAtk: 0.06,
    bonusHp: 0.07,
    desc: "\u59DC\u7EF4\u3001\u9B4F\u5EF6\u540C\u65F6\u4E0A\u9635",
    combo: "\u7941\u5C71\u7A81\u8FDB",
    comboMult: 2
  },
  {
    id: "hanzhongqi",
    name: "\u6C49\u4E2D\u9A81\u9A91",
    heroes: ["madai", "weiyan"],
    bonusAtk: 0.08,
    bonusHp: 0.05,
    desc: "\u9A6C\u5CB1\u3001\u9B4F\u5EF6\u540C\u65F6\u4E0A\u9635",
    combo: "\u6C49\u4E2D\u591C\u88AD",
    comboMult: 2
  },
  {
    id: "daogong",
    name: "\u5200\u5F13\u53CC\u7EDD",
    heroes: ["guanyu", "huangzhong"],
    bonusAtk: 0.07,
    bonusHp: 0.06,
    desc: "\u5173\u7FBD\u3001\u9EC4\u5FE0\u540C\u65F6\u4E0A\u9635",
    combo: "\u5200\u5F13\u9F50\u51FA",
    comboMult: 2
  },
  {
    id: "jingxiang",
    name: "\u8346\u8944\u624D\u4FCA",
    heroes: ["huangyueying", "pangtong"],
    bonusAtk: 0.06,
    bonusHp: 0.07,
    desc: "\u9EC4\u6708\u82F1\u3001\u5E9E\u7EDF\u540C\u65F6\u4E0A\u9635",
    combo: "\u8346\u8944\u5BF9\u8C08",
    comboMult: 2
  },
  {
    id: "yiji",
    name: "\u5B9A\u519B\u9057\u8BA1",
    heroes: ["fazheng", "jiangwei"],
    bonusAtk: 0.08,
    bonusHp: 0.05,
    desc: "\u6CD5\u6B63\u3001\u59DC\u7EF4\u540C\u65F6\u4E0A\u9635",
    combo: "\u9057\u8BA1\u5317\u4F10",
    comboMult: 2
  },
  {
    id: "dingjunyu",
    name: "\u5B9A\u519B\u4F59\u52C7",
    heroes: ["madai", "huangzhong"],
    bonusAtk: 0.07,
    bonusHp: 0.06,
    desc: "\u9A6C\u5CB1\u3001\u9EC4\u5FE0\u540C\u65F6\u4E0A\u9635",
    combo: "\u5B9A\u519B\u4F59\u7BAD",
    comboMult: 2
  },
  {
    id: "baipao",
    name: "\u767D\u888D\u94F6\u67AA",
    heroes: ["machao", "zhaoyun"],
    bonusAtk: 0.06,
    bonusHp: 0.07,
    desc: "\u9A6C\u8D85\u3001\u8D75\u4E91\u540C\u65F6\u4E0A\u9635",
    combo: "\u767D\u888D\u5E76\u9A91",
    comboMult: 2
  },
  {
    id: "mouyong",
    name: "\u6C49\u4E2D\u8C0B\u52C7",
    heroes: ["fazheng", "weiyan"],
    bonusAtk: 0.08,
    bonusHp: 0.05,
    desc: "\u6CD5\u6B63\u3001\u9B4F\u5EF6\u540C\u65F6\u4E0A\u9635",
    combo: "\u5947\u8C0B\u53CD\u9AA8",
    comboMult: 2
  },
  {
    id: "shaozhuang",
    name: "\u8700\u4E2D\u5C11\u58EE",
    heroes: ["guanping", "madai"],
    bonusAtk: 0.07,
    bonusHp: 0.06,
    desc: "\u5173\u5E73\u3001\u9A6C\u5CB1\u540C\u65F6\u4E0A\u9635",
    combo: "\u5C11\u58EE\u7A81\u9635",
    comboMult: 2
  },
  {
    id: "huziqi",
    name: "\u864E\u5B50\u5947\u8C0B",
    heroes: ["guanping", "fazheng"],
    bonusAtk: 0.06,
    bonusHp: 0.07,
    desc: "\u5173\u5E73\u3001\u6CD5\u6B63\u540C\u65F6\u4E0A\u9635",
    combo: "\u968F\u519B\u732E\u8BA1",
    comboMult: 2
  },
  {
    id: "qingyin",
    name: "\u4E71\u4E16\u6E05\u97F3",
    heroes: ["huangyueying", "caiwenji"],
    bonusAtk: 0.08,
    bonusHp: 0.05,
    desc: "\u9EC4\u6708\u82F1\u3001\u8521\u6587\u59EC\u540C\u65F6\u4E0A\u9635",
    combo: "\u6E05\u97F3\u629A\u519B",
    comboMult: 2
  },
  {
    id: "jingzhou",
    name: "\u8346\u5DDE\u98CE\u4E91",
    heroes: ["pangtong", "lvmeng"],
    bonusAtk: 0.07,
    bonusHp: 0.06,
    desc: "\u5E9E\u7EDF\u3001\u5415\u8499\u540C\u65F6\u4E0A\u9635",
    combo: "\u8346\u8944\u6613\u624B",
    comboMult: 2
  },
  {
    id: "xiahou",
    name: "\u590F\u4FAF\u5144\u5F1F",
    heroes: ["xiahoudun", "xiahouyuan"],
    bonusAtk: 0.06,
    bonusHp: 0.07,
    desc: "\u590F\u4FAF\u60C7\u3001\u590F\u4FAF\u6E0A\u540C\u65F6\u4E0A\u9635",
    combo: "\u590F\u4FAF\u5E76\u9A70",
    comboMult: 2
  },
  {
    id: "xunguo",
    name: "\u8340\u90ED\u9F50\u540D",
    heroes: ["xunyu", "guojia"],
    bonusAtk: 0.08,
    bonusHp: 0.05,
    desc: "\u8340\u5F67\u3001\u90ED\u5609\u540C\u65F6\u4E0A\u9635",
    combo: "\u53CC\u8C0B\u4F50\u9B4F",
    comboMult: 2
  },
  {
    id: "wangzuo",
    name: "\u738B\u4F50\u4E4B\u624D",
    heroes: ["xunyu", "caocao"],
    bonusAtk: 0.07,
    bonusHp: 0.06,
    desc: "\u8340\u5F67\u3001\u66F9\u64CD\u540C\u65F6\u4E0A\u9635",
    combo: "\u738B\u4F50\u9A71\u864E",
    comboMult: 2
  },
  {
    id: "langgu",
    name: "\u72FC\u987E\u4E4B\u76F8",
    heroes: ["simayi", "caocao"],
    bonusAtk: 0.06,
    bonusHp: 0.07,
    desc: "\u53F8\u9A6C\u61FF\u3001\u66F9\u64CD\u540C\u65F6\u4E0A\u9635",
    combo: "\u72FC\u987E\u85CF\u950B",
    comboMult: 2
  },
  {
    id: "elai",
    name: "\u6076\u6765\u62A4\u4E3B",
    heroes: ["dianwei", "caocao"],
    bonusAtk: 0.08,
    bonusHp: 0.05,
    desc: "\u5178\u97E6\u3001\u66F9\u64CD\u540C\u65F6\u4E0A\u9635",
    combo: "\u6076\u6765\u62A4\u9A7E",
    comboMult: 2
  },
  {
    id: "dongliang",
    name: "\u9B4F\u4E4B\u680B\u6881",
    heroes: ["xiahoudun", "caoren"],
    bonusAtk: 0.07,
    bonusHp: 0.06,
    desc: "\u590F\u4FAF\u60C7\u3001\u66F9\u4EC1\u540C\u65F6\u4E0A\u9635",
    combo: "\u680B\u6881\u62D2\u654C",
    comboMult: 2
  },
  {
    id: "bashi",
    name: "\u62D4\u77E2\u864E\u75F4",
    heroes: ["xiahoudun", "xuchu"],
    bonusAtk: 0.06,
    bonusHp: 0.07,
    desc: "\u590F\u4FAF\u60C7\u3001\u8BB8\u891A\u540C\u65F6\u4E0A\u9635",
    combo: "\u62D4\u77E2\u864E\u543C",
    comboMult: 2
  },
  {
    id: "mouzhu",
    name: "\u4E24\u671D\u8C0B\u4E3B",
    heroes: ["simayi", "xunyu"],
    bonusAtk: 0.08,
    bonusHp: 0.05,
    desc: "\u53F8\u9A6C\u61FF\u3001\u8340\u5F67\u540C\u65F6\u4E0A\u9635",
    combo: "\u8C0B\u4E3B\u4EA4\u66FF",
    comboMult: 2
  },
  {
    id: "hubu",
    name: "\u864E\u6B65\u94C1\u58C1",
    heroes: ["xiahouyuan", "caoren"],
    bonusAtk: 0.07,
    bonusHp: 0.06,
    desc: "\u590F\u4FAF\u6E0A\u3001\u66F9\u4EC1\u540C\u65F6\u4E0A\u9635",
    combo: "\u5954\u88AD\u636E\u5B88",
    comboMult: 2
  },
  {
    id: "hufeng",
    name: "\u864E\u536B\u5949\u5B5D",
    heroes: ["xuchu", "guojia"],
    bonusAtk: 0.06,
    bonusHp: 0.07,
    desc: "\u8BB8\u891A\u3001\u90ED\u5609\u540C\u65F6\u4E0A\u9635",
    combo: "\u62A4\u8C0B\u7A81\u8FDB",
    comboMult: 2
  },
  {
    id: "shoutu",
    name: "\u5B88\u571F\u4E4B\u4E66",
    heroes: ["caoren", "xunyu"],
    bonusAtk: 0.08,
    bonusHp: 0.05,
    desc: "\u66F9\u4EC1\u3001\u8340\u5F67\u540C\u65F6\u4E0A\u9635",
    combo: "\u6A0A\u57CE\u4E66\u4FE1",
    comboMult: 2
  },
  {
    id: "hubuchi",
    name: "\u5954\u88AD\u864E\u75F4",
    heroes: ["xiahouyuan", "xuchu"],
    bonusAtk: 0.07,
    bonusHp: 0.06,
    desc: "\u590F\u4FAF\u6E0A\u3001\u8BB8\u891A\u540C\u65F6\u4E0A\u9635",
    combo: "\u864E\u6B65\u864E\u75F4",
    comboMult: 2
  },
  {
    id: "luoshenzuo",
    name: "\u6D1B\u795E\u738B\u4F50",
    heroes: ["zhenji", "xunyu"],
    bonusAtk: 0.06,
    bonusHp: 0.07,
    desc: "\u7504\u59EC\u3001\u8340\u5F67\u540C\u65F6\u4E0A\u9635",
    combo: "\u6587\u82E5\u6D1B\u795E",
    comboMult: 2
  },
  {
    id: "yijiben",
    name: "\u9057\u8BA1\u5954\u88AD",
    heroes: ["guojia", "xiahouyuan"],
    bonusAtk: 0.08,
    bonusHp: 0.05,
    desc: "\u90ED\u5609\u3001\u590F\u4FAF\u6E0A\u540C\u65F6\u4E0A\u9635",
    combo: "\u9057\u8BA1\u5343\u91CC",
    comboMult: 2
  },
  {
    id: "xiangfan",
    name: "\u8944\u6A0A\u8C0B\u5B88",
    heroes: ["simayi", "caoren"],
    bonusAtk: 0.07,
    bonusHp: 0.06,
    desc: "\u53F8\u9A6C\u61FF\u3001\u66F9\u4EC1\u540C\u65F6\u4E0A\u9635",
    combo: "\u8944\u6A0A\u5BF9\u5CD9",
    comboMult: 2
  },
  {
    id: "huwei",
    name: "\u864E\u536B\u94C1\u58C1",
    heroes: ["dianwei", "caoren"],
    bonusAtk: 0.06,
    bonusHp: 0.07,
    desc: "\u5178\u97E6\u3001\u66F9\u4EC1\u540C\u65F6\u4E0A\u9635",
    combo: "\u864E\u536B\u5B88\u57CE",
    comboMult: 2
  },
  {
    id: "xueyi",
    name: "\u8840\u8863\u62A4\u4E3B",
    heroes: ["sunquan", "zhoutai"],
    bonusAtk: 0.08,
    bonusHp: 0.05,
    desc: "\u5B59\u6743\u3001\u5468\u6CF0\u540C\u65F6\u4E0A\u9635",
    combo: "\u8840\u8863\u536B\u4E3B",
    comboMult: 2
  },
  {
    id: "tashang",
    name: "\u69BB\u4E0A\u7B56",
    heroes: ["sunquan", "lusu"],
    bonusAtk: 0.07,
    bonusHp: 0.06,
    desc: "\u5B59\u6743\u3001\u9C81\u8083\u540C\u65F6\u4E0A\u9635",
    combo: "\u69BB\u4E0A\u5B9A\u8BA1",
    comboMult: 2
  },
  {
    id: "zhangzi",
    name: "\u6C5F\u4E1C\u957F\u59CA",
    heroes: ["sunquan", "daqiao"],
    bonusAtk: 0.06,
    bonusHp: 0.07,
    desc: "\u5B59\u6743\u3001\u5927\u4E54\u540C\u65F6\u4E0A\u9635",
    combo: "\u957F\u59CA\u5B89\u5434",
    comboMult: 2
  },
  {
    id: "jiaogi",
    name: "\u9738\u738B\u5A07\u59BB",
    heroes: ["sunce", "daqiao"],
    bonusAtk: 0.08,
    bonusHp: 0.05,
    desc: "\u5B59\u7B56\u3001\u5927\u4E54\u540C\u65F6\u4E0A\u9635",
    combo: "\u9738\u738B\u8FCE\u4E54",
    comboMult: 2
  },
  {
    id: "xiongmei",
    name: "\u5B59\u6C0F\u5144\u59B9",
    heroes: ["sunce", "sunshangxiang"],
    bonusAtk: 0.07,
    bonusHp: 0.06,
    desc: "\u5B59\u7B56\u3001\u5B59\u5C1A\u9999\u540C\u65F6\u4E0A\u9635",
    combo: "\u5144\u59B9\u8FDE\u7BAD",
    comboMult: 2
  },
  {
    id: "hubiao",
    name: "\u6C5F\u8868\u864E\u81E3",
    heroes: ["sunce", "lingtong"],
    bonusAtk: 0.06,
    bonusHp: 0.07,
    desc: "\u5B59\u7B56\u3001\u51CC\u7EDF\u540C\u65F6\u4E0A\u9635",
    combo: "\u795E\u4EAD\u4F59\u52C7",
    comboMult: 2
  },
  {
    id: "zijin",
    name: "\u516C\u747E\u5B50\u656C",
    heroes: ["zhouyu", "lusu"],
    bonusAtk: 0.08,
    bonusHp: 0.05,
    desc: "\u5468\u745C\u3001\u9C81\u8083\u540C\u65F6\u4E0A\u9635",
    combo: "\u8054\u5218\u5B9A\u7B56",
    comboMult: 2
  },
  {
    id: "lushi",
    name: "\u9646\u6C0F\u7236\u5B50",
    heroes: ["luxun", "lukang"],
    bonusAtk: 0.07,
    bonusHp: 0.06,
    desc: "\u9646\u900A\u3001\u9646\u6297\u540C\u65F6\u4E0A\u9635",
    combo: "\u7236\u5B50\u5B88\u56FD",
    comboMult: 2
  },
  {
    id: "ruji",
    name: "\u5112\u5C06\u76F8\u7EE7",
    heroes: ["luxun", "lusu"],
    bonusAtk: 0.06,
    bonusHp: 0.07,
    desc: "\u9646\u900A\u3001\u9C81\u8083\u540C\u65F6\u4E0A\u9635",
    combo: "\u5112\u5C06\u4F20\u706B",
    comboMult: 2
  },
  {
    id: "ruxu",
    name: "\u6FE1\u987B\u5B88\u6C5F",
    heroes: ["luxun", "zhoutai"],
    bonusAtk: 0.08,
    bonusHp: 0.05,
    desc: "\u9646\u900A\u3001\u5468\u6CF0\u540C\u65F6\u4E0A\u9635",
    combo: "\u6FE1\u987B\u5E76\u5B88",
    comboMult: 2
  },
  {
    id: "shuanghu",
    name: "\u6C5F\u8868\u53CC\u864E",
    heroes: ["taishici", "lingtong"],
    bonusAtk: 0.07,
    bonusHp: 0.06,
    desc: "\u592A\u53F2\u6148\u3001\u51CC\u7EDF\u540C\u65F6\u4E0A\u9635",
    combo: "\u53CC\u864E\u7A81\u9635",
    comboMult: 2
  },
  {
    id: "yongguan",
    name: "\u52C7\u51A0\u6C5F\u4E1C",
    heroes: ["taishici", "ganning"],
    bonusAtk: 0.06,
    bonusHp: 0.07,
    desc: "\u592A\u53F2\u6148\u3001\u7518\u5B81\u540C\u65F6\u4E0A\u9635",
    combo: "\u52C7\u51A0\u7834\u9635",
    comboMult: 2
  },
  {
    id: "ganling",
    name: "\u7518\u51CC\u5408\u6DDD",
    heroes: ["ganning", "lingtong"],
    bonusAtk: 0.08,
    bonusHp: 0.05,
    desc: "\u7518\u5B81\u3001\u51CC\u7EDF\u540C\u65F6\u4E0A\u9635",
    combo: "\u5408\u6DDD\u91CA\u5ACC",
    comboMult: 2
  },
  {
    id: "xijing",
    name: "\u88AD\u53D6\u8346\u5DDE",
    heroes: ["ganning", "lvmeng"],
    bonusAtk: 0.07,
    bonusHp: 0.06,
    desc: "\u7518\u5B81\u3001\u5415\u8499\u540C\u65F6\u4E0A\u9635",
    combo: "\u767D\u8863\u9526\u5E06",
    comboMult: 2
  },
  {
    id: "laozhuang",
    name: "\u8001\u5C06\u58EE\u58EB",
    heroes: ["huanggai", "taishici"],
    bonusAtk: 0.06,
    bonusHp: 0.07,
    desc: "\u9EC4\u76D6\u3001\u592A\u53F2\u6148\u540C\u65F6\u4E0A\u9635",
    combo: "\u8001\u58EE\u7834\u9635",
    comboMult: 2
  },
  {
    id: "shuangbi",
    name: "\u62A4\u4E3B\u53CC\u58C1",
    heroes: ["lingtong", "zhoutai"],
    bonusAtk: 0.08,
    bonusHp: 0.05,
    desc: "\u51CC\u7EDF\u3001\u5468\u6CF0\u540C\u65F6\u4E0A\u9635",
    combo: "\u53CC\u58C1\u62A4\u4E3B",
    comboMult: 2
  },
  {
    id: "liangdu",
    name: "\u4E24\u4EE3\u90FD\u7763",
    heroes: ["lusu", "lukang"],
    bonusAtk: 0.07,
    bonusHp: 0.06,
    desc: "\u9C81\u8083\u3001\u9646\u6297\u540C\u65F6\u4E0A\u9635",
    combo: "\u90FD\u7763\u76F8\u4F20",
    comboMult: 2
  },
  {
    id: "shanghen",
    name: "\u4F24\u75D5\u7D2F\u7D2F",
    heroes: ["huanggai", "zhoutai"],
    bonusAtk: 0.06,
    bonusHp: 0.07,
    desc: "\u9EC4\u76D6\u3001\u5468\u6CF0\u540C\u65F6\u4E0A\u9635",
    combo: "\u4F24\u75D5\u62D2\u654C",
    comboMult: 2
  },
  {
    id: "yaji",
    name: "\u6C5F\u4E1C\u96C5\u96C6",
    heroes: ["xiaoqiao", "lusu"],
    bonusAtk: 0.08,
    bonusHp: 0.05,
    desc: "\u5C0F\u4E54\u3001\u9C81\u8083\u540C\u65F6\u4E0A\u9635",
    combo: "\u96C5\u96C6\u629A\u519B",
    comboMult: 2
  },
  {
    id: "zhanghu",
    name: "\u957F\u59CA\u62A4\u536B",
    heroes: ["daqiao", "zhoutai"],
    bonusAtk: 0.07,
    bonusHp: 0.06,
    desc: "\u5927\u4E54\u3001\u5468\u6CF0\u540C\u65F6\u4E0A\u9635",
    combo: "\u957F\u59CA\u5B89\u5371",
    comboMult: 2
  },
  {
    id: "chibiyu",
    name: "\u8D64\u58C1\u4F59\u8109",
    heroes: ["lukang", "huanggai"],
    bonusAtk: 0.06,
    bonusHp: 0.07,
    desc: "\u9646\u6297\u3001\u9EC4\u76D6\u540C\u65F6\u4E0A\u9635",
    combo: "\u706B\u8239\u4F59\u5A01",
    comboMult: 2
  },
  {
    id: "jingdu",
    name: "\u8346\u5DDE\u90FD\u7763",
    heroes: ["lvmeng", "lukang"],
    bonusAtk: 0.08,
    bonusHp: 0.05,
    desc: "\u5415\u8499\u3001\u9646\u6297\u540C\u65F6\u4E0A\u9635",
    combo: "\u8346\u5DDE\u4EA4\u63A5",
    comboMult: 2
  },
  {
    id: "hongzhuang",
    name: "\u6C5F\u4E1C\u7EA2\u5986",
    heroes: ["xiaoqiao", "sunshangxiang"],
    bonusAtk: 0.07,
    bonusHp: 0.06,
    desc: "\u5C0F\u4E54\u3001\u5B59\u5C1A\u9999\u540C\u65F6\u4E0A\u9635",
    combo: "\u7EA2\u5986\u8FDE\u7BAD",
    comboMult: 2
  },
  {
    id: "gusao",
    name: "\u59D1\u5AC2\u540C\u8425",
    heroes: ["daqiao", "sunshangxiang"],
    bonusAtk: 0.06,
    bonusHp: 0.07,
    desc: "\u5927\u4E54\u3001\u5B59\u5C1A\u9999\u540C\u65F6\u4E0A\u9635",
    combo: "\u59D1\u5AC2\u540C\u8425",
    comboMult: 2
  },
  {
    id: "fanmu",
    name: "\u7236\u5B50\u53CD\u76EE",
    heroes: ["dongzhuo", "lvbu"],
    bonusAtk: 0.08,
    bonusHp: 0.05,
    desc: "\u8463\u5353\u3001\u5415\u5E03\u540C\u65F6\u4E0A\u9635",
    combo: "\u7236\u5B50\u53CD\u76EE",
    comboMult: 2
  },
  {
    id: "lianhuan",
    name: "\u8FDE\u73AF\u4E4B\u59CB",
    heroes: ["dongzhuo", "diaochan"],
    bonusAtk: 0.07,
    bonusHp: 0.06,
    desc: "\u8463\u5353\u3001\u8C82\u8749\u540C\u65F6\u4E0A\u9635",
    combo: "\u8FDE\u73AF\u521D\u8BA1",
    comboMult: 2
  },
  {
    id: "xiliangxian",
    name: "\u897F\u51C9\u5148\u950B",
    heroes: ["dongzhuo", "huaxiong"],
    bonusAtk: 0.06,
    bonusHp: 0.07,
    desc: "\u8463\u5353\u3001\u534E\u96C4\u540C\u65F6\u4E0A\u9635",
    combo: "\u6C5C\u6C34\u5148\u950B",
    comboMult: 2
  },
  {
    id: "taishi",
    name: "\u592A\u5E08\u5E55\u5BBE",
    heroes: ["dongzhuo", "jiaxu"],
    bonusAtk: 0.08,
    bonusHp: 0.05,
    desc: "\u8463\u5353\u3001\u8D3E\u8BE9\u540C\u65F6\u4E0A\u9635",
    combo: "\u5E55\u5BBE\u732E\u8BA1",
    comboMult: 2
  },
  {
    id: "sishui",
    name: "\u6C5C\u6C34\u5173\u524D",
    heroes: ["lvbu", "huaxiong"],
    bonusAtk: 0.07,
    bonusHp: 0.06,
    desc: "\u5415\u5E03\u3001\u534E\u96C4\u540C\u65F6\u4E0A\u9635",
    combo: "\u5173\u524D\u5E76\u9A91",
    comboMult: 2
  },
  {
    id: "lijiandu",
    name: "\u79BB\u95F4\u6BD2\u8BA1",
    heroes: ["diaochan", "jiaxu"],
    bonusAtk: 0.06,
    bonusHp: 0.07,
    desc: "\u8C82\u8749\u3001\u8D3E\u8BE9\u540C\u65F6\u4E0A\u9635",
    combo: "\u79BB\u95F4\u4E09\u8BA1",
    comboMult: 2
  },
  {
    id: "hongyan",
    name: "\u4E71\u4E16\u7EA2\u989C",
    heroes: ["diaochan", "caiwenji"],
    bonusAtk: 0.08,
    bonusHp: 0.05,
    desc: "\u8C82\u8749\u3001\u8521\u6587\u59EC\u540C\u65F6\u4E0A\u9635",
    combo: "\u7EA2\u989C\u629A\u7434",
    comboMult: 2
  },
  {
    id: "hebeijiang",
    name: "\u6CB3\u5317\u4E0A\u5C06",
    heroes: ["yuanshao", "yanliang"],
    bonusAtk: 0.07,
    bonusHp: 0.06,
    desc: "\u8881\u7ECD\u3001\u989C\u826F\u540C\u65F6\u4E0A\u9635",
    combo: "\u6CB3\u5317\u7A81\u9A91",
    comboMult: 2
  },
  {
    id: "luanshuang",
    name: "\u4E71\u4E16\u53CC\u51F6",
    heroes: ["zhangjiao", "dongzhuo"],
    bonusAtk: 0.06,
    bonusHp: 0.07,
    desc: "\u5F20\u89D2\u3001\u8463\u5353\u540C\u65F6\u4E0A\u9635",
    combo: "\u53CC\u51F6\u4E71\u4E16",
    comboMult: 2
  },
  {
    id: "xiaoyao",
    name: "\u900D\u9065\u6D25",
    heroes: ["zhangliao", "xiahouyuan"],
    bonusAtk: 0.08,
    bonusHp: 0.05,
    desc: "\u5F20\u8FBD\u3001\u590F\u4FAF\u6E0A\u540C\u65F6\u4E0A\u9635",
    combo: "\u900D\u9065\u6D25",
    comboMult: 2
  },
  {
    id: "guagu",
    name: "\u522E\u9AA8\u7597\u6BD2",
    heroes: ["huatuo", "guanyu"],
    bonusAtk: 0.07,
    bonusHp: 0.06,
    desc: "\u534E\u4F57\u3001\u5173\u7FBD\u540C\u65F6\u4E0A\u9635",
    combo: "\u522E\u9AA8\u7597\u6BD2",
    comboMult: 2
  },
  {
    id: "hujia",
    name: "\u9752\u56CA\u80E1\u7B33",
    heroes: ["huatuo", "caiwenji"],
    bonusAtk: 0.06,
    bonusHp: 0.07,
    desc: "\u534E\u4F57\u3001\u8521\u6587\u59EC\u540C\u65F6\u4E0A\u9635",
    combo: "\u9752\u56CA\u80E1\u7B33",
    comboMult: 2
  },
  {
    id: "baima",
    name: "\u767D\u9A6C\u4E4B\u6218",
    heroes: ["yanliang", "zhangliao"],
    bonusAtk: 0.08,
    bonusHp: 0.05,
    desc: "\u989C\u826F\u3001\u5F20\u8FBD\u540C\u65F6\u4E0A\u9635",
    combo: "\u767D\u9A6C\u4EA4\u950B",
    comboMult: 2
  },
  {
    id: "luanwu",
    name: "\u4E71\u6B66\u4F59\u6CE2",
    heroes: ["zhangjiao", "jiaxu"],
    bonusAtk: 0.07,
    bonusHp: 0.06,
    desc: "\u5F20\u89D2\u3001\u8D3E\u8BE9\u540C\u65F6\u4E0A\u9635",
    combo: "\u4E71\u6B66\u4F59\u6CE2",
    comboMult: 2
  },
  {
    id: "fanji",
    name: "\u53CD\u95F4\u79BB\u5415",
    heroes: ["lvbu", "jiaxu"],
    bonusAtk: 0.06,
    bonusHp: 0.07,
    desc: "\u5415\u5E03\u3001\u8D3E\u8BE9\u540C\u65F6\u4E0A\u9635",
    combo: "\u53CD\u95F4\u79BB\u5415",
    comboMult: 2
  },
  {
    id: "guandong",
    name: "\u5173\u4E1C\u5148\u950B",
    heroes: ["yuanshao", "huaxiong"],
    bonusAtk: 0.08,
    bonusHp: 0.05,
    desc: "\u8881\u7ECD\u3001\u534E\u96C4\u540C\u65F6\u4E0A\u9635",
    combo: "\u4E24\u8DEF\u5148\u950B",
    comboMult: 2
  },
  {
    id: "cainv",
    name: "\u624D\u5973\u76F8\u77E5",
    heroes: ["caiwenji", "zhenji"],
    bonusAtk: 0.07,
    bonusHp: 0.06,
    desc: "\u8521\u6587\u59EC\u3001\u7504\u59EC\u540C\u65F6\u4E0A\u9635",
    combo: "\u624D\u5973\u548C\u9E23",
    comboMult: 2
  },
  {
    id: "hebeihuang",
    name: "\u4E71\u4E16\u6CB3\u5317",
    heroes: ["zhangjiao", "yuanshao"],
    bonusAtk: 0.06,
    bonusHp: 0.07,
    desc: "\u5F20\u89D2\u3001\u8881\u7ECD\u540C\u65F6\u4E0A\u9635",
    combo: "\u6CB3\u5317\u9EC4\u5929",
    comboMult: 2
  },
  {
    id: "jiangcao",
    name: "\u964D\u66F9\u524D\u540E",
    heroes: ["zhangliao", "jiaxu"],
    bonusAtk: 0.08,
    bonusHp: 0.05,
    desc: "\u5F20\u8FBD\u3001\u8D3E\u8BE9\u540C\u65F6\u4E0A\u9635",
    combo: "\u9635\u524D\u6BD2\u8BA1",
    comboMult: 2
  },
  {
    id: "luanshi",
    name: "\u4E71\u4E16\u5148\u950B",
    heroes: ["yanliang", "zhangjiao"],
    bonusAtk: 0.07,
    bonusHp: 0.06,
    desc: "\u989C\u826F\u3001\u5F20\u89D2\u540C\u65F6\u4E0A\u9635",
    combo: "\u4E71\u4E16\u5148\u950B",
    comboMult: 2
  },
  {
    id: "guanqian",
    name: "\u5173\u524D\u53CC\u96C4",
    heroes: ["huaxiong", "yanliang"],
    bonusAtk: 0.06,
    bonusHp: 0.07,
    desc: "\u534E\u96C4\u3001\u989C\u826F\u540C\u65F6\u4E0A\u9635",
    combo: "\u6E29\u9152\u672A\u51C9",
    comboMult: 2
  }
];
var FACTION_LABEL = {
  shu: "\u8700",
  wei: "\u9B4F",
  wu: "\u5434",
  qun: "\u7FA4"
};
var FACTION_TIERS = [
  { count: 2, atk: 0.04, hp: 0.04, def: 0 },
  { count: 3, atk: 0.08, hp: 0.08, def: 0.04 },
  { count: 4, atk: 0.12, hp: 0.12, def: 0.06 },
  { count: 5, atk: 0.16, hp: 0.16, def: 0.08 },
  { count: 6, atk: 0.22, hp: 0.2, def: 0.1 }
];

// src/data/attackLine.ts
var ROW = /* @__PURE__ */ new Set([
  "guanyu",
  "zhangfei",
  "zhaoyun",
  "machao",
  "lvbu",
  "jiangwei",
  "huangzhong",
  "xiahouyuan",
  "sunshangxiang",
  "yanliang",
  "caoren",
  "madai",
  "taishici"
]);
var COL = /* @__PURE__ */ new Set([
  "dianwei",
  "xuchu",
  "ganning",
  "zhangliao",
  "sunce",
  "weiyan",
  "huaxiong",
  "lingtong",
  "huanggai",
  "xiahoudun",
  "dongzhuo",
  "guanping",
  "zhoutai",
  "luxun"
]);
function attackLine(heroId) {
  if (ROW.has(heroId)) return "row";
  if (COL.has(heroId)) return "col";
  return null;
}

// src/data/heroSkills.ts
function sk(name, kind, fx, power, unlockAt, desc, extra = {}) {
  return { name, kind, fx, power, unlockAt, desc, ...extra };
}
var HERO_SKILLS = {
  /* ── 蜀 ── */
  liubei: [
    sk("\u4EC1\u5FB7\u53F7\u4EE4", "active", "heal", 1.25, 1, "\u4EC1\u5FB7\u611F\u53EC\uFF0C\u6CBB\u7597\u6211\u65B9\u751F\u547D\u6700\u4F4E\u7684\u6B66\u5C06", { target: "ally-low" }),
    sk("\u643A\u6C11\u6E21\u6C5F", "passive", "regen", 0.1, 2, "\u6BCF\u56DE\u5408\u4E3A\u4F24\u52BF\u6700\u91CD\u7684\u53CB\u519B\u56DE\u590D\u751F\u547D", { cond: "ally-hurt" }),
    sk("\u6843\u56ED\u540C\u6CFD", "active", "heal-all", 0.62, 3, "\u540C\u6CFD\u76F8\u6064\uFF0C\u6CBB\u7597\u6211\u65B9\u5168\u4F53", { target: "ally-all" }),
    sk("\u6C49\u5BA4\u4F59\u836B", "passive", "passive-hp", 0.08, 4, "\u6C49\u5BA4\u5B97\u4EB2\uFF0C\u6C38\u4E45\u63D0\u9AD8\u751F\u547D", { value: 0.08 })
  ],
  guanyu: [
    sk("\u6E29\u9152\u65A9\u5C06", "active", "strike", 1.85, 1, "\u9752\u9F99\u5043\u6708\u4E00\u5200\uFF0C\u91CD\u521B\u654C\u65B9\u5355\u4F53", { target: "enemy-front" }),
    sk("\u6B66\u5723", "passive", "passive-atk", 0.1, 2, "\u4E07\u4EBA\u4E4B\u654C\uFF0C\u6C38\u4E45\u63D0\u9AD8\u653B\u51FB", { value: 0.1 }),
    sk("\u6C34\u6DF9\u4E03\u519B", "active", "aoe", 0.7, 3, "\u5043\u6708\u6A2A\u626B\uFF0C\u4F24\u5BB3\u654C\u65B9\u5168\u4F53", { target: "enemy-all" }),
    sk("\u4E49\u7EDD", "active", "pierce", 0.4, 4, "\u9752\u9F99\u950B\u9510\u7834\u7532\uFF0C\u5927\u5E45\u964D\u4F4E\u654C\u65B9\u9632\u5FA1", { target: "enemy-front", value: 3 })
  ],
  zhangfei: [
    sk("\u5486\u54EE\u7834\u9635", "active", "strike", 1.5, 1, "\u5F53\u9633\u6865\u4E00\u58F0\u543C\uFF0C\u91CD\u51FB\u654C\u65B9\u5355\u4F53", { target: "enemy-front" }),
    sk("\u4E07\u592B\u83AB\u5F00", "active", "taunt", 1, 2, "\u636E\u6865\u65AD\u540E\uFF0C\u6012\u559D\u654C\u65B9\u524D\u6392\u653B\u51FB\u81EA\u5DF1", { target: "enemy-front", value: 2 }),
    sk("\u86C7\u77DB\u6A2A\u626B", "active", "aoe", 0.62, 3, "\u4E08\u516B\u86C7\u77DB\u6A2A\u626B\u654C\u65B9\u5168\u4F53", { target: "enemy-all" }),
    sk("\u71D5\u4EBA\u5F20\u7FFC\u5FB7", "passive", "passive-hp", 0.12, 4, "\u718A\u864E\u4E4B\u8EAF\uFF0C\u6C38\u4E45\u63D0\u9AD8\u751F\u547D", { value: 0.12 })
  ],
  zhaoyun: [
    sk("\u4E03\u8FDB\u4E03\u51FA", "active", "execute", 1.75, 1, "\u67AA\u6311\u6B8B\u654C\uFF0C\u4F18\u5148\u653B\u51FB\u751F\u547D\u6700\u4F4E\u8005", { target: "enemy-low" }),
    sk("\u9F99\u80C6", "passive", "passive-atk", 0.09, 2, "\u4E00\u8EAB\u662F\u80C6\uFF0C\u6C38\u4E45\u63D0\u9AD8\u653B\u51FB", { value: 0.09 }),
    sk("\u5355\u9A91\u6551\u4E3B", "active", "absorb", 1.55, 3, "\u957F\u5742\u7A81\u56F4\uFF0C\u91CD\u521B\u5355\u4F53\u5E76\u5438\u53D6\u4F24\u5BB3\u56DE\u590D\u81EA\u8EAB", { target: "enemy-front" }),
    sk("\u5E38\u5C71\u4E49\u80C6", "passive", "drain", 0.18, 4, "\u767D\u888D\u4E0D\u67D3\uFF0C\u666E\u653B\u53EF\u5438\u53D6\u751F\u547D", { value: 0.18 })
  ],
  zhugeliang: [
    sk("\u501F\u4E1C\u98CE", "active", "burn", 0.82, 1, "\u4E1C\u98CE\u5F15\u706B\uFF0C\u707C\u70E7\u654C\u65B9\u5168\u4F53\uFF0C\u5E76\u6301\u7EED\u6389\u8840", { target: "enemy-all", value: 3 }),
    sk("\u89C2\u661F", "passive", "passive-atk", 0.1, 2, "\u591C\u89C2\u5929\u8C61\uFF0C\u6C38\u4E45\u63D0\u9AD8\u653B\u51FB", { value: 0.1 }),
    sk("\u516B\u9635\u56FE", "active", "control", 1.15, 3, "\u8FF7\u9635\u56F0\u4F4F\u654C\u65B9\u524D\u6392\uFF0C\u4F7F\u5176\u65E0\u6CD5\u884C\u52A8", { target: "enemy-front", value: 2 }),
    sk("\u7A7A\u57CE\u8BA1", "active", "weaken", 0.35, 4, "\u865A\u5F20\u58F0\u52BF\uFF0C\u5927\u5E45\u524A\u5F31\u654C\u65B9\u653B\u51FB", { target: "enemy-all", value: 3 })
  ],
  huangyueying: [
    sk("\u6728\u725B\u6D41\u9A6C", "active", "heal", 1.15, 1, "\u673A\u5173\u8FD0\u7CAE\uFF0C\u6CBB\u7597\u6211\u65B9\u751F\u547D\u6700\u4F4E\u8005", { target: "ally-low" }),
    sk("\u5DE7\u601D", "passive", "passive-def", 0.1, 2, "\u673A\u5173\u62A4\u4F53\uFF0C\u6C38\u4E45\u63D0\u9AD8\u9632\u5FA1", { value: 0.1 }),
    sk("\u8FDE\u5F29\u9F50\u53D1", "active", "chain", 0.72, 3, "\u8BF8\u845B\u8FDE\u5F29\u8FDE\u5C04\uFF0C\u8FDE\u51FB\u591A\u4E2A\u654C\u4EBA", { target: "enemy-all", value: 4 }),
    sk("\u5F52\u9690\u5357\u9633", "passive", "passive-hp", 0.08, 4, "\u4ECE\u5BB9\u4E0D\u8FEB\uFF0C\u6C38\u4E45\u63D0\u9AD8\u751F\u547D", { value: 0.08 })
  ],
  /* ── 魏 ── */
  caocao: [
    sk("\u631F\u5929\u5B50\u4EE4", "active", "control", 1.2, 1, "\u4EE5\u5929\u5B50\u4E4B\u540D\u538B\u5236\u654C\u65B9\u524D\u6392\uFF0C\u4F7F\u5176\u65E0\u6CD5\u884C\u52A8", { target: "enemy-front", value: 2 }),
    sk("\u4E71\u4E16\u5978\u96C4", "passive", "passive-atk", 0.1, 2, "\u5B81\u6559\u6211\u8D1F\u4EBA\uFF0C\u6C38\u4E45\u63D0\u9AD8\u653B\u51FB", { value: 0.1 }),
    sk("\u671B\u6885\u6B62\u6E34", "active", "heal", 1, 3, "\u4E00\u8A00\u5B89\u519B\uFF0C\u6CBB\u7597\u6211\u65B9\u4F24\u52BF\u6700\u91CD\u8005", { target: "ally-low" }),
    sk("\u9B4F\u6B66", "passive", "passive-hp", 0.08, 4, "\u96C4\u9738\u4E2D\u539F\uFF0C\u6C38\u4E45\u63D0\u9AD8\u751F\u547D", { value: 0.08 })
  ],
  xiahoudun: [
    sk("\u521A\u70C8\u53CD\u51FB", "active", "absorb", 1.4, 1, "\u62D4\u77E2\u5556\u775B\uFF0C\u91CD\u51FB\u773C\u524D\u4E4B\u654C\u5E76\u5438\u53D6\u4F24\u5BB3", { target: "enemy-front" }),
    sk("\u72EC\u773C\u82CD\u72FC", "passive", "passive-def", 0.12, 2, "\u4F24\u800C\u4E0D\u9000\uFF0C\u6C38\u4E45\u63D0\u9AD8\u9632\u5FA1", { value: 0.12 }),
    sk("\u864E\u8C79\u9A91", "active", "execute", 1.45, 3, "\u4EB2\u7387\u864E\u8C79\uFF0C\u65A9\u6740\u751F\u547D\u6700\u4F4E\u7684\u654C\u4EBA", { target: "enemy-low" }),
    sk("\u62D4\u77E2\u5556\u775B", "active", "haste", 1, 4, "\u62D4\u77E2\u996E\u775B\uFF0C\u53CB\u519B\u884C\u52A8\u52A0\u5FEB", { target: "ally-all", value: 3 })
  ],
  dianwei: [
    sk("\u53CC\u621F\u62A4\u4E3B", "active", "shield", 1.5, 1, "\u53CC\u94C1\u621F\u62A4\u9A7E\uFF0C\u4E3A\u81EA\u5DF1\u51DD\u805A\u62A4\u76FE", { target: "self" }),
    sk("\u6076\u6765", "passive", "passive-def", 0.14, 2, "\u53E4\u4E4B\u6076\u6765\uFF0C\u6C38\u4E45\u63D0\u9AD8\u9632\u5FA1", { value: 0.14 }),
    sk("\u5E10\u524D\u6B7B\u6218", "active", "aoe", 0.55, 3, "\u4EE5\u8EAB\u5835\u95E8\uFF0C\u6A2A\u626B\u654C\u65B9\u5168\u4F53", { target: "enemy-all" }),
    sk("\u88F8\u8863\u6597", "passive", "passive-hp", 0.12, 4, "\u529B\u80FD\u625B\u9F0E\uFF0C\u6C38\u4E45\u63D0\u9AD8\u751F\u547D", { value: 0.12 })
  ],
  guojia: [
    sk("\u5341\u80DC\u5341\u8D25", "active", "execute", 1.7, 1, "\u6599\u654C\u5148\u673A\uFF0C\u72D9\u6740\u6700\u5F31\u7684\u654C\u4EBA", { target: "enemy-low" }),
    sk("\u9057\u8BA1", "passive", "passive-atk", 0.09, 2, "\u7B97\u65E0\u9057\u7B56\uFF0C\u6C38\u4E45\u63D0\u9AD8\u653B\u51FB", { value: 0.09 }),
    sk("\u5947\u4F50\u732E\u8BA1", "active", "weaken", 0.38, 3, "\u4E00\u8BA1\u4E71\u5FC3\uFF0C\u5927\u5E45\u524A\u5F31\u654C\u65B9\u653B\u51FB", { target: "enemy-all", value: 3 }),
    sk("\u5949\u5B5D", "passive", "passive-hp", 0.06, 4, "\u75C5\u9AA8\u72B9\u8C0B\uFF0C\u6C38\u4E45\u63D0\u9AD8\u751F\u547D", { value: 0.06 })
  ],
  simayi: [
    sk("\u72FC\u987E\u4E4B\u76F8", "active", "control", 1.25, 1, "\u56DE\u9996\u9707\u6151\u654C\u65B9\u524D\u6392\uFF0C\u4F7F\u5176\u65E0\u6CD5\u884C\u52A8", { target: "enemy-front", value: 2 }),
    sk("\u9690\u5FCD", "passive", "passive-def", 0.1, 2, "\u88C5\u75C5\u907F\u7978\uFF0C\u6C38\u4E45\u63D0\u9AD8\u9632\u5FA1", { value: 0.1 }),
    sk("\u51A2\u864E\u4F0F\u6740", "active", "execute", 1.8, 3, "\u5F85\u5176\u75B2\u655D\uFF0C\u65A9\u6740\u751F\u547D\u6700\u4F4E\u8005", { target: "enemy-low" }),
    sk("\u53CD\u9988", "active", "pierce", 0.42, 4, "\u4EE5\u5F7C\u4E4B\u9053\u8FD8\u65BD\u5F7C\u8EAB\uFF0C\u51FB\u7834\u654C\u65B9\u9632\u5FA1", { target: "enemy-front", value: 3 })
  ],
  /* ── 吴 ── */
  sunquan: [
    sk("\u5236\u8861\u4E4B\u7B56", "active", "heal", 1.2, 1, "\u5750\u65AD\u4E1C\u5357\uFF0C\u6CBB\u7597\u6211\u65B9\u751F\u547D\u6700\u4F4E\u7684\u6B66\u5C06", { target: "ally-low" }),
    sk("\u6C5F\u4E1C\u57FA\u4E1A", "passive", "regen", 0.1, 2, "\u6BCF\u56DE\u5408\u4E3A\u4F24\u52BF\u6700\u91CD\u7684\u53CB\u519B\u56DE\u590D\u751F\u547D", { cond: "ally-hurt" }),
    sk("\u7D2B\u9AEF\u629A\u519B", "active", "heal-all", 0.58, 3, "\u4EB2\u4E34\u5B89\u629A\uFF0C\u6CBB\u7597\u6211\u65B9\u5168\u4F53", { target: "ally-all" }),
    sk("\u6C34\u5E08\u5E87\u62A4", "active", "shield", 1.1, 4, "\u6C5F\u4E1C\u6C34\u5E08\u7ED3\u9635\uFF0C\u4E3A\u6211\u65B9\u5168\u4F53\u51DD\u805A\u62A4\u76FE", { target: "ally-all" })
  ],
  zhouyu: [
    sk("\u706B\u70E7\u8D64\u58C1", "active", "burn", 0.9, 1, "\u4E1C\u98CE\u501F\u706B\uFF0C\u707C\u70E7\u654C\u65B9\u5168\u4F53\uFF0C\u5E76\u6301\u7EED\u6389\u8840", { target: "enemy-all", value: 3 }),
    sk("\u987E\u66F2", "passive", "passive-atk", 0.09, 2, "\u66F2\u6709\u8BEF\u5FC5\u987E\uFF0C\u6C38\u4E45\u63D0\u9AD8\u653B\u51FB", { value: 0.09 }),
    sk("\u82F1\u59FF", "active", "mark", 0.35, 3, "\u7FBD\u6247\u4E00\u70B9\uFF0C\u6807\u8BB0\u76EE\u6807\u4F7F\u5176\u53D7\u5230\u7684\u4F24\u5BB3\u63D0\u9AD8", { target: "enemy-front", value: 3 }),
    sk("\u7F8E\u5468\u90CE", "active", "haste", 1, 4, "\u66F2\u594F\u51EF\u6B4C\uFF0C\u53CB\u519B\u884C\u52A8\u52A0\u5FEB", { target: "ally-all", value: 3 })
  ],
  luxun: [
    sk("\u706B\u70E7\u8FDE\u8425", "active", "burn", 0.78, 1, "\u5937\u9675\u7EB5\u706B\uFF0C\u707C\u70E7\u654C\u65B9\u5168\u4F53\uFF0C\u5E76\u6301\u7EED\u6389\u8840", { target: "enemy-all", value: 3 }),
    sk("\u4E66\u751F", "passive", "passive-atk", 0.08, 2, "\u5112\u96C5\u6599\u654C\uFF0C\u6C38\u4E45\u63D0\u9AD8\u653B\u51FB", { value: 0.08 }),
    sk("\u77F3\u4EAD\u4F0F\u5175", "active", "execute", 1.55, 3, "\u8BF1\u654C\u6DF1\u5165\uFF0C\u65A9\u6740\u6700\u5F31\u5355\u4F4D", { target: "enemy-low" }),
    sk("\u8C26\u9000", "active", "shield", 1.2, 4, "\u8C26\u9000\u5F85\u65F6\uFF0C\u4E3A\u6211\u65B9\u5168\u4F53\u51DD\u805A\u62A4\u76FE", { target: "ally-all" })
  ],
  taishici: [
    sk("\u7A7F\u6768\u795E\u5C04", "active", "execute", 1.6, 1, "\u4E00\u7BAD\u7A7F\u6768\uFF0C\u5C04\u6740\u751F\u547D\u6700\u4F4E\u8005", { target: "enemy-low" }),
    sk("\u4FE1\u4E49", "passive", "passive-atk", 0.08, 2, "\u5C0F\u9738\u738B\u4EA6\u670D\u5176\u4E49\uFF0C\u6C38\u4E45\u63D0\u9AD8\u653B\u51FB", { value: 0.08 }),
    sk("\u795E\u4EAD\u9163\u6218", "active", "absorb", 1.45, 3, "\u795E\u4EAD\u5CAD\u5355\u6311\uFF0C\u91CD\u521B\u5355\u4F53\u5E76\u5438\u53D6\u4F24\u5BB3", { target: "enemy-front" }),
    sk("\u5F13\u9A6C\u5A34\u719F", "active", "chain", 0.68, 4, "\u8FDE\u73E0\u5C04\u6740\uFF0C\u8FDE\u51FB\u591A\u4E2A\u654C\u4EBA", { target: "enemy-all", value: 3 })
  ],
  xiaoqiao: [
    sk("\u7434\u745F\u548C\u9E23", "active", "heal", 1.3, 1, "\u7434\u97F3\u629A\u519B\uFF0C\u6CBB\u7597\u6211\u65B9\u751F\u547D\u6700\u4F4E\u7684\u6B66\u5C06", { target: "ally-low" }),
    sk("\u56FD\u8272", "passive", "regen", 0.08, 2, "\u6BCF\u56DE\u5408\u4E3A\u4F24\u52BF\u6700\u91CD\u7684\u53CB\u519B\u56DE\u590D\u751F\u547D", { cond: "ally-hurt" }),
    sk("\u94DC\u96C0\u6625\u6DF1", "active", "heal-all", 0.55, 3, "\u4F59\u97F3\u7ED5\u6881\uFF0C\u6CBB\u7597\u6211\u65B9\u5168\u4F53", { target: "ally-all" }),
    sk("\u6C5F\u4E1C\u4F73\u5076", "active", "cleanse", 1, 4, "\u7434\u97F3\u6DA4\u5C18\uFF0C\u9A71\u6563\u53CB\u519B\u8D1F\u9762\u72B6\u6001", { target: "ally-other" })
  ],
  /* ── 群 ── */
  lvbu: [
    sk("\u65E0\u53CC\u4E71\u821E", "active", "aoe", 0.82, 1, "\u65B9\u5929\u753B\u621F\u4E71\u821E\uFF0C\u6A2A\u626B\u654C\u65B9\u5168\u4F53", { target: "enemy-all" }),
    sk("\u98DE\u5C06", "passive", "passive-atk", 0.12, 2, "\u4EBA\u4E2D\u5415\u5E03\uFF0C\u6C38\u4E45\u63D0\u9AD8\u653B\u51FB", { value: 0.12 }),
    sk("\u8F95\u95E8\u5C04\u621F", "active", "execute", 2.05, 3, "\u4E00\u621F\u5B9A\u7EB7\uFF0C\u65A9\u6740\u751F\u547D\u6700\u4F4E\u8005", { target: "enemy-low" }),
    sk("\u8D64\u5154", "passive", "drain", 0.15, 4, "\u9A6C\u4E2D\u8D64\u5154\uFF0C\u666E\u653B\u53EF\u5438\u53D6\u751F\u547D", { value: 0.15 })
  ],
  diaochan: [
    sk("\u95ED\u6708\u56DE\u6625", "active", "heal", 1.25, 1, "\u95ED\u6708\u4E00\u66F2\uFF0C\u6CBB\u7597\u6211\u65B9\u751F\u547D\u6700\u4F4E\u7684\u6B66\u5C06", { target: "ally-low" }),
    sk("\u8FDE\u73AF", "passive", "regen", 0.08, 2, "\u6BCF\u56DE\u5408\u4E3A\u4F24\u52BF\u6700\u91CD\u7684\u53CB\u519B\u7EED\u4E0A\u751F\u673A", { cond: "ally-hurt" }),
    sk("\u62DC\u6708", "active", "heal-all", 0.6, 3, "\u6708\u4E0B\u7948\u798F\uFF0C\u6CBB\u7597\u6211\u65B9\u5168\u4F53", { target: "ally-all" }),
    sk("\u503E\u57CE", "active", "weaken", 0.32, 4, "\u503E\u56FD\u4E4B\u8272\uFF0C\u524A\u5F31\u654C\u65B9\u5168\u4F53\u653B\u51FB", { target: "enemy-all", value: 3 })
  ],
  huatuo: [
    sk("\u9752\u56CA\u5999\u672F", "active", "heal", 1.55, 1, "\u522E\u9AA8\u7597\u6BD2\uFF0C\u5927\u91CF\u6CBB\u7597\u4F24\u52BF\u6700\u91CD\u7684\u53CB\u519B", { target: "ally-low" }),
    sk("\u9EBB\u6CB8", "passive", "regen", 0.1, 2, "\u6BCF\u56DE\u5408\u4E3A\u4F24\u52BF\u6700\u91CD\u7684\u53CB\u519B\u56DE\u590D\u751F\u547D", { cond: "ally-hurt" }),
    sk("\u4E94\u79BD\u620F", "active", "heal-all", 0.7, 3, "\u5BFC\u5F15\u5410\u7EB3\uFF0C\u6CBB\u7597\u6211\u65B9\u5168\u4F53", { target: "ally-all" }),
    sk("\u6D4E\u4E16", "active", "cleanse", 1, 4, "\u9752\u56CA\u89E3\u5384\uFF0C\u9A71\u6563\u53CB\u519B\u4E2D\u6BD2\u707C\u70E7\u4E0E\u63A7\u5236", { target: "ally-other" })
  ],
  huangzhong: [
    sk("\u767E\u6B65\u7A7F\u6768", "active", "execute", 1.8, 1, "\u5B9A\u519B\u5C71\u4E00\u7BAD\uFF0C\u5C04\u6740\u751F\u547D\u6700\u4F4E\u8005", { target: "enemy-low" }),
    sk("\u8001\u5F53\u76CA\u58EE", "passive", "passive-atk", 0.09, 2, "\u5B9D\u5200\u672A\u8001\uFF0C\u6C38\u4E45\u63D0\u9AD8\u653B\u51FB", { value: 0.09 }),
    sk("\u62D6\u5200\u8BA1", "active", "pierce", 0.38, 3, "\u56DE\u9A6C\u4E00\u5200\uFF0C\u51FB\u7834\u654C\u65B9\u9632\u5FA1", { target: "enemy-front", value: 3 }),
    sk("\u4E94\u864E", "active", "mark", 0.32, 4, "\u5B9A\u519B\u65A9\u5C06\uFF0C\u6807\u8BB0\u76EE\u6807\u4F7F\u5176\u53D7\u5230\u7684\u4F24\u5BB3\u63D0\u9AD8", { target: "enemy-low", value: 3 })
  ],
  machao: [
    sk("\u897F\u51C9\u94C1\u9A91", "active", "strike", 1.7, 1, "\u94C1\u9A91\u51B2\u950B\uFF0C\u91CD\u521B\u654C\u65B9\u5355\u4F53", { target: "enemy-front" }),
    sk("\u9526\u9A6C\u8D85", "passive", "passive-atk", 0.09, 2, "\u767D\u888D\u94F6\u67AA\uFF0C\u6C38\u4E45\u63D0\u9AD8\u653B\u51FB", { value: 0.09 }),
    sk("\u6F7C\u5173\u591C\u88AD", "active", "aoe", 0.62, 3, "\u5272\u987B\u5F03\u888D\u4E4B\u6068\uFF0C\u4F24\u5BB3\u654C\u65B9\u5168\u4F53", { target: "enemy-all" }),
    sk("\u897F\u51C9\u8840\u8109", "active", "chain", 0.7, 4, "\u94F6\u67AA\u8FDE\u523A\uFF0C\u8FDE\u51FB\u591A\u4E2A\u654C\u4EBA", { target: "enemy-all", value: 4 })
  ],
  ganning: [
    sk("\u767E\u9A91\u52AB\u8425", "active", "execute", 1.65, 1, "\u9526\u5E06\u591C\u88AD\uFF0C\u65A9\u6740\u751F\u547D\u6700\u4F4E\u8005", { target: "enemy-low" }),
    sk("\u94C3\u94DB", "passive", "passive-atk", 0.08, 2, "\u95FB\u94C3\u77E5\u5B81\uFF0C\u6C38\u4E45\u63D0\u9AD8\u653B\u51FB", { value: 0.08 }),
    sk("\u65AD\u6865\u62D2\u654C", "active", "taunt", 1, 3, "\u5355\u5200\u65AD\u540E\uFF0C\u6012\u559D\u654C\u65B9\u524D\u6392\u653B\u51FB\u81EA\u5DF1", { target: "enemy-front", value: 2 }),
    sk("\u6E38\u4FA0", "active", "absorb", 1.35, 4, "\u9526\u5E06\u593A\u9B42\uFF0C\u593A\u53D6\u4F24\u5BB3\u56DE\u590D\u81EA\u8EAB", { target: "enemy-front" })
  ],
  zhangliao: [
    sk("\u5A01\u9707\u900D\u9065", "active", "execute", 1.8, 1, "\u516B\u767E\u7834\u5341\u4E07\uFF0C\u65A9\u6740\u751F\u547D\u6700\u4F4E\u8005", { target: "enemy-low" }),
    sk("\u5148\u767B", "passive", "passive-atk", 0.1, 2, "\u6B62\u557C\u4E4B\u540D\uFF0C\u6C38\u4E45\u63D0\u9AD8\u653B\u51FB", { value: 0.1 }),
    sk("\u9677\u9635", "active", "aoe", 0.7, 3, "\u7A81\u9A91\u8E0F\u8425\uFF0C\u4F24\u5BB3\u654C\u65B9\u5168\u4F53", { target: "enemy-all" }),
    sk("\u5408\u80A5\u5B88", "active", "shield", 1.4, 4, "\u636E\u57CE\u800C\u5B88\uFF0C\u4E3A\u6211\u65B9\u5168\u4F53\u51DD\u805A\u62A4\u76FE", { target: "ally-all" })
  ],
  sunce: [
    sk("\u9738\u738B\u51FB", "active", "strike", 1.9, 1, "\u5C0F\u9738\u738B\u51B2\u9635\uFF0C\u91CD\u521B\u654C\u65B9\u5355\u4F53", { target: "enemy-front" }),
    sk("\u6C5F\u4E1C\u731B\u864E", "passive", "passive-atk", 0.1, 2, "\u82F1\u6C14\u903C\u4EBA\uFF0C\u6C38\u4E45\u63D0\u9AD8\u653B\u51FB", { value: 0.1 }),
    sk("\u5E73\u5B9A\u6C5F\u4E1C", "active", "aoe", 0.68, 3, "\u5E2D\u5377\u6C5F\u4E1C\uFF0C\u4F24\u5BB3\u654C\u65B9\u5168\u4F53", { target: "enemy-all" }),
    sk("\u7389\u73BA\u4E4B\u5FD7", "active", "haste", 1, 4, "\u4F20\u56FD\u4E4B\u5FD7\uFF0C\u53CB\u519B\u884C\u52A8\u52A0\u5FEB", { target: "ally-all", value: 3 })
  ],
  zhenji: [
    sk("\u6D1B\u795E\u8D4B", "active", "heal", 1.35, 1, "\u51CC\u6CE2\u5FAE\u6B65\uFF0C\u6CBB\u7597\u6211\u65B9\u751F\u547D\u6700\u4F4E\u7684\u6B66\u5C06", { target: "ally-low" }),
    sk("\u503E\u56FD", "passive", "regen", 0.1, 2, "\u6BCF\u56DE\u5408\u4E3A\u4F24\u52BF\u6700\u91CD\u7684\u53CB\u519B\u56DE\u590D\u751F\u547D", { cond: "ally-hurt" }),
    sk("\u6D9F\u6F2A", "active", "heal-all", 0.62, 3, "\u6C34\u6CE2\u8361\u5F00\uFF0C\u6CBB\u7597\u6211\u65B9\u5168\u4F53", { target: "ally-all" }),
    sk("\u6D1B\u6C34\u6E05\u6B4C", "active", "cleanse", 1, 4, "\u6E05\u6B4C\u6DA4\u5C18\uFF0C\u9A71\u6563\u53CB\u519B\u8D1F\u9762\u72B6\u6001", { target: "ally-other" })
  ],
  jiangwei: [
    sk("\u7EE7\u5FD7\u5317\u4F10", "active", "aoe", 0.8, 1, "\u4E5D\u4F10\u4E2D\u539F\uFF0C\u6CD5\u672F\u8F70\u51FB\u654C\u65B9\u5168\u4F53", { target: "enemy-all" }),
    sk("\u5E7C\u9E92", "passive", "passive-atk", 0.09, 2, "\u80C6\u7565\u8FC7\u4EBA\uFF0C\u6C38\u4E45\u63D0\u9AD8\u653B\u51FB", { value: 0.09 }),
    sk("\u5929\u6C34\u5F52\u5FC3", "active", "execute", 1.7, 3, "\u8BC6\u7834\u7591\u5175\uFF0C\u65A9\u6740\u751F\u547D\u6700\u4F4E\u8005", { target: "enemy-low" }),
    sk("\u7EE7\u6B66\u4F20\u627F", "active", "weaken", 0.36, 4, "\u627F\u7EE7\u6B66\u4FAF\uFF0C\u524A\u5F31\u654C\u65B9\u5168\u4F53\u653B\u51FB", { target: "enemy-all", value: 3 })
  ],
  zhangjiao: [
    sk("\u9EC4\u5929\u5F53\u7ACB", "active", "poison", 0.82, 1, "\u7B26\u6C34\u6210\u75AB\uFF0C\u654C\u65B9\u5168\u4F53\u4E2D\u6BD2\uFF0C\u5E76\u6301\u7EED\u6389\u8840", { target: "enemy-all", value: 3 }),
    sk("\u592A\u5E73\u8981\u672F", "passive", "passive-atk", 0.1, 2, "\u7B26\u6C34\u5492\u6CD5\uFF0C\u6C38\u4E45\u63D0\u9AD8\u653B\u51FB", { value: 0.1 }),
    sk("\u96F7\u516C\u52A9\u9635", "active", "control", 1.2, 3, "\u5929\u96F7\u7729\u6655\u654C\u65B9\u524D\u6392\uFF0C\u4F7F\u5176\u65E0\u6CD5\u884C\u52A8", { target: "enemy-front", value: 2 }),
    sk("\u5927\u8D24\u826F\u5E08", "active", "sunder", 0.14, 4, "\u7B26\u6C34\u8680\u547D\uFF0C\u524A\u51CF\u654C\u65B9\u751F\u547D\u4E0A\u9650", { target: "enemy-low" })
  ],
  pangtong: [
    sk("\u8FDE\u73AF\u8BA1", "active", "burn", 0.8, 1, "\u8FDE\u73AF\u706B\u8BA1\uFF0C\u707C\u70E7\u654C\u65B9\u5168\u4F53\uFF0C\u5E76\u6301\u7EED\u6389\u8840", { target: "enemy-all", value: 3 }),
    sk("\u51E4\u96CF", "passive", "passive-atk", 0.09, 2, "\u4E0E\u5367\u9F99\u9F50\u540D\uFF0C\u6C38\u4E45\u63D0\u9AD8\u653B\u51FB", { value: 0.09 }),
    sk("\u843D\u51E4", "active", "execute", 1.6, 3, "\u4E00\u8BA1\u5B9A\u5C40\uFF0C\u65A9\u6740\u751F\u547D\u6700\u4F4E\u8005", { target: "enemy-low" }),
    sk("\u732E\u7B56", "active", "weaken", 0.34, 4, "\u732E\u7B56\u4E71\u654C\uFF0C\u524A\u5F31\u654C\u65B9\u5168\u4F53\u653B\u51FB", { target: "enemy-all", value: 3 })
  ],
  xuchu: [
    sk("\u88F8\u8863\u6597\u9A6C", "active", "strike", 1.6, 1, "\u864E\u75F4\u88F8\u8863\uFF0C\u91CD\u521B\u654C\u65B9\u5355\u4F53", { target: "enemy-front" }),
    sk("\u62A4\u9A7E", "passive", "passive-def", 0.14, 2, "\u5BF8\u6B65\u4E0D\u79BB\uFF0C\u6C38\u4E45\u63D0\u9AD8\u9632\u5FA1", { value: 0.14 }),
    sk("\u864E\u75F4\u9707\u8425", "active", "aoe", 0.58, 3, "\u4E00\u58F0\u864E\u543C\uFF0C\u9707\u4F24\u654C\u65B9\u5168\u4F53", { target: "enemy-all" }),
    sk("\u529B\u654C\u4E07\u592B", "passive", "drain", 0.16, 4, "\u864E\u80CC\u718A\u8170\uFF0C\u666E\u653B\u53EF\u5438\u53D6\u751F\u547D", { value: 0.16 })
  ],
  daqiao: [
    sk("\u6D41\u79BB", "active", "heal", 1.28, 1, "\u56FD\u8272\u629A\u519B\uFF0C\u6CBB\u7597\u6211\u65B9\u751F\u547D\u6700\u4F4E\u7684\u6B66\u5C06", { target: "ally-low" }),
    sk("\u6C5F\u4E1C\u957F\u59CA", "passive", "regen", 0.1, 2, "\u6BCF\u56DE\u5408\u4E3A\u4F24\u52BF\u6700\u91CD\u7684\u53CB\u519B\u56DE\u590D\u751F\u547D", { cond: "ally-hurt" }),
    sk("\u94DC\u96C0\u4F59\u97F5", "active", "heal-all", 0.58, 3, "\u4F59\u97F3\u62A4\u8425\uFF0C\u6CBB\u7597\u6211\u65B9\u5168\u4F53", { target: "ally-all" }),
    sk("\u53CC\u4E54", "active", "shield", 1.05, 4, "\u6C5F\u4E1C\u53CC\u74A7\uFF0C\u4E3A\u6211\u65B9\u5168\u4F53\u51DD\u805A\u62A4\u76FE", { target: "ally-all" })
  ],
  lvmeng: [
    sk("\u767D\u8863\u6E21\u6C5F", "active", "execute", 1.7, 1, "\u767D\u8863\u88AD\u8346\u5DDE\uFF0C\u65A9\u6740\u751F\u547D\u6700\u4F4E\u8005", { target: "enemy-low" }),
    sk("\u58EB\u522B\u4E09\u65E5", "passive", "passive-atk", 0.1, 2, "\u522E\u76EE\u76F8\u770B\uFF0C\u6C38\u4E45\u63D0\u9AD8\u653B\u51FB", { value: 0.1 }),
    sk("\u593A\u8346\u5DDE", "active", "strike", 1.65, 3, "\u5947\u5175\u7A81\u81F3\uFF0C\u91CD\u521B\u654C\u65B9\u5355\u4F53", { target: "enemy-front" }),
    sk("\u514B\u5DF1", "passive", "passive-def", 0.08, 4, "\u52E4\u5B66\u4E0D\u8F8D\uFF0C\u6C38\u4E45\u63D0\u9AD8\u9632\u5FA1", { value: 0.08 })
  ],
  yuanshao: [
    sk("\u6CB3\u5317\u96C4\u5175", "active", "aoe", 0.7, 1, "\u56DB\u4E16\u4E09\u516C\u53F7\u4EE4\uFF0C\u538B\u5411\u654C\u65B9\u5168\u4F53", { target: "enemy-all" }),
    sk("\u540D\u95E8", "passive", "passive-hp", 0.1, 2, "\u95E8\u751F\u6545\u540F\uFF0C\u6C38\u4E45\u63D0\u9AD8\u751F\u547D", { value: 0.1 }),
    sk("\u754C\u6865", "active", "strike", 1.5, 3, "\u5927\u519B\u538B\u5883\uFF0C\u91CD\u521B\u654C\u65B9\u5355\u4F53", { target: "enemy-front" }),
    sk("\u5B98\u6E21", "active", "shield", 1.3, 4, "\u8FDE\u8425\u7ED3\u5BE8\uFF0C\u4E3A\u6211\u65B9\u5168\u4F53\u51DD\u805A\u62A4\u76FE", { target: "ally-all" })
  ],
  huanggai: [
    sk("\u82E6\u8089\u8BC8\u964D", "active", "strike", 1.5, 1, "\u4EE5\u8EAB\u53D7\u6756\uFF0C\u91CD\u521B\u654C\u65B9\u5355\u4F53", { target: "enemy-front" }),
    sk("\u8001\u5C06", "passive", "passive-def", 0.12, 2, "\u4E09\u4E16\u8001\u81E3\uFF0C\u6C38\u4E45\u63D0\u9AD8\u9632\u5FA1", { value: 0.12 }),
    sk("\u706B\u8239", "active", "burn", 0.62, 3, "\u706B\u8239\u649E\u8425\uFF0C\u707C\u70E7\u654C\u65B9\u5168\u4F53\uFF0C\u5E76\u6301\u7EED\u6389\u8840", { target: "enemy-all", value: 3 }),
    sk("\u8D64\u58C1\u524D\u9A71", "active", "taunt", 1, 4, "\u8001\u5C06\u8BF7\u6218\uFF0C\u6012\u559D\u654C\u65B9\u524D\u6392\u653B\u51FB\u81EA\u5DF1", { target: "enemy-front", value: 2 })
  ],
  guanping: [
    sk("\u5043\u6708\u4F20\u627F", "active", "strike", 1.55, 1, "\u627F\u9752\u9F99\u5200\u6CD5\uFF0C\u91CD\u521B\u654C\u65B9\u5355\u4F53", { target: "enemy-front" }),
    sk("\u5C06\u95E8", "passive", "passive-atk", 0.08, 2, "\u864E\u7236\u65E0\u72AC\u5B50\uFF0C\u6C38\u4E45\u63D0\u9AD8\u653B\u51FB", { value: 0.08 }),
    sk("\u968F\u7236\u51FA\u5F81", "active", "execute", 1.45, 3, "\u7D27\u968F\u6B66\u5723\uFF0C\u65A9\u6740\u751F\u547D\u6700\u4F4E\u8005", { target: "enemy-low" }),
    sk("\u5FE0\u52C7", "passive", "passive-hp", 0.08, 4, "\u4E0D\u79BB\u4E0D\u5F03\uFF0C\u6C38\u4E45\u63D0\u9AD8\u751F\u547D", { value: 0.08 })
  ],
  /* ── 补齐武将 ── */
  weiyan: [
    sk("\u53CD\u9AA8\u51B2\u9635", "active", "strike", 1.7, 1, "\u4E0D\u987E\u9635\u811A\uFF0C\u4E00\u67AA\u91CD\u521B\u773C\u524D\u4E4B\u654C", { target: "enemy-front" }),
    sk("\u6027\u70C8", "passive", "passive-atk", 0.1, 2, "\u4E0D\u80AF\u5C45\u4EBA\u4E0B\uFF0C\u6C38\u4E45\u63D0\u9AD8\u653B\u51FB", { value: 0.1 }),
    sk("\u5B50\u5348\u5947\u88AD", "active", "execute", 1.6, 3, "\u7ED5\u9053\u88AD\u8425\uFF0C\u65A9\u6740\u751F\u547D\u6700\u4F4E\u8005", { target: "enemy-low" }),
    sk("\u5B64\u519B\u93D6\u6218", "passive", "drain", 0.14, 4, "\u8D8A\u6218\u8D8A\u52C7\uFF0C\u666E\u653B\u53EF\u5438\u53D6\u751F\u547D", { value: 0.14 })
  ],
  fazheng: [
    sk("\u5B9A\u519B\u5947\u7B56", "active", "aoe", 0.82, 1, "\u732E\u65A9\u5C06\u4E4B\u8BA1\uFF0C\u6CD5\u672F\u8986\u76D6\u654C\u65B9\u5168\u4F53", { target: "enemy-all" }),
    sk("\u5B5D\u76F4", "passive", "passive-atk", 0.1, 2, "\u8C0B\u4E3B\u5728\u4FA7\uFF0C\u6C38\u4E45\u63D0\u9AD8\u653B\u51FB", { value: 0.1 }),
    sk("\u4EE5\u6028\u62A5\u6028", "active", "execute", 1.65, 3, "\u775A\u7726\u5FC5\u62A5\uFF0C\u72D9\u6740\u6700\u5F31\u7684\u654C\u4EBA", { target: "enemy-low" }),
    sk("\u7FFC\u5FB7\u4EA6\u670D", "active", "weaken", 0.34, 4, "\u6069\u5A01\u5E76\u65BD\uFF0C\u524A\u5F31\u654C\u65B9\u5168\u4F53\u653B\u51FB", { target: "enemy-all", value: 3 })
  ],
  madai: [
    sk("\u88AD\u8425\u53D6\u9996", "active", "execute", 1.75, 1, "\u897F\u51C9\u8F7B\u9A91\u7ED5\u540E\uFF0C\u4F18\u5148\u65A9\u6740\u6B8B\u654C", { target: "enemy-low" }),
    sk("\u9A81\u9A91", "passive", "passive-atk", 0.09, 2, "\u9A6C\u6C0F\u5BB6\u98CE\uFF0C\u6C38\u4E45\u63D0\u9AD8\u653B\u51FB", { value: 0.09 }),
    sk("\u65AD\u540E\u4E00\u5200", "active", "strike", 1.7, 3, "\u8FFD\u4EA1\u9010\u5317\uFF0C\u5BF9\u5355\u4F53\u9020\u6210\u9AD8\u989D\u4F24\u5BB3", { target: "enemy-front" }),
    sk("\u6F5C\u884C", "active", "mark", 0.34, 4, "\u8854\u679A\u75BE\u884C\uFF0C\u6807\u8BB0\u76EE\u6807\u4F7F\u5176\u53D7\u5230\u7684\u4F24\u5BB3\u63D0\u9AD8", { target: "enemy-low", value: 3 })
  ],
  xiahouyuan: [
    sk("\u5343\u91CC\u5954\u88AD", "active", "execute", 1.8, 1, "\u4E09\u65E5\u4E94\u767E\u91CC\uFF0C\u72D9\u51FB\u751F\u547D\u6700\u4F4E\u8005", { target: "enemy-low" }),
    sk("\u864E\u6B65", "passive", "passive-atk", 0.1, 2, "\u5999\u624D\u5584\u8D70\uFF0C\u6C38\u4E45\u63D0\u9AD8\u653B\u51FB", { value: 0.1 }),
    sk("\u795E\u5C04", "active", "strike", 1.85, 3, "\u4E00\u7BAD\u7A7F\u6768\uFF0C\u91CD\u521B\u654C\u65B9\u5355\u4F53", { target: "enemy-front" }),
    sk("\u75BE\u5982\u98CE", "active", "haste", 1, 4, "\u6765\u53BB\u5982\u98CE\uFF0C\u53CB\u519B\u884C\u52A8\u52A0\u5FEB", { target: "ally-all", value: 3 })
  ],
  xunyu: [
    sk("\u9A71\u864E\u541E\u72FC", "active", "aoe", 0.78, 1, "\u4E24\u5C01\u4E66\u4FE1\uFF0C\u6CD5\u672F\u52A8\u6447\u654C\u65B9\u5168\u4F53", { target: "enemy-all" }),
    sk("\u738B\u4F50", "passive", "passive-atk", 0.1, 2, "\u4E3E\u8D24\u6388\u80FD\uFF0C\u6C38\u4E45\u63D0\u9AD8\u653B\u51FB", { value: 0.1 }),
    sk("\u6301\u91CD", "active", "heal", 1.05, 3, "\u529D\u4E3B\u7559\u9547\uFF0C\u6CBB\u7597\u6211\u65B9\u4F24\u52BF\u6700\u91CD\u8005", { target: "ally-low" }),
    sk("\u89E3\u70E6", "active", "cleanse", 1, 4, "\u541B\u5B50\u4E4B\u5FB7\uFF0C\u9A71\u6563\u53CB\u519B\u8D1F\u9762\u72B6\u6001", { target: "ally-other" })
  ],
  caoren: [
    sk("\u6A0A\u57CE\u636E\u5B88", "active", "shield", 1.6, 1, "\u77E2\u77F3\u9F50\u4E0B\uFF0C\u4E3A\u6211\u65B9\u51DD\u805A\u62A4\u76FE", { target: "ally-all" }),
    sk("\u94C1\u58C1", "passive", "passive-def", 0.14, 2, "\u57CE\u4E0D\u53EF\u7834\uFF0C\u6C38\u4E45\u63D0\u9AD8\u9632\u5FA1", { value: 0.14 }),
    sk("\u62D2\u6C34", "active", "aoe", 0.55, 3, "\u51B3\u6C34\u704C\u654C\uFF0C\u4F24\u5BB3\u654C\u65B9\u5168\u4F53", { target: "enemy-all" }),
    sk("\u5929\u4EBA\u5171\u4EF0", "active", "taunt", 1, 4, "\u57CE\u95E8\u72EC\u5B88\uFF0C\u6012\u559D\u654C\u65B9\u524D\u6392\u653B\u51FB\u81EA\u5DF1", { target: "enemy-front", value: 2 })
  ],
  zhoutai: [
    sk("\u8840\u8863\u536B\u4E3B", "active", "taunt", 1, 1, "\u521B\u53E3\u672A\u5408\u4ECD\u51B2\u51FA\uFF0C\u6012\u559D\u654C\u65B9\u524D\u6392", { target: "enemy-front", value: 2 }),
    sk("\u62A4\u4E3B", "passive", "passive-def", 0.14, 2, "\u4EE5\u8EAB\u4F5C\u76FE\uFF0C\u6C38\u4E45\u63D0\u9AD8\u9632\u5FA1", { value: 0.14 }),
    sk("\u5BA3\u57CE\u7A81\u56F4", "active", "aoe", 0.58, 3, "\u6740\u51FA\u91CD\u56F4\uFF0C\u6A2A\u626B\u654C\u65B9\u5168\u4F53", { target: "enemy-all" }),
    sk("\u4E0D\u5C48", "passive", "drain", 0.14, 4, "\u4F24\u75D5\u8D8A\u591A\u8D8A\u52C7\uFF0C\u666E\u653B\u53EF\u5438\u53D6\u751F\u547D", { value: 0.14 })
  ],
  lusu: [
    sk("\u69BB\u4E0A\u7B56", "active", "aoe", 0.76, 1, "\u5408\u7EB5\u4E4B\u8BAE\u5316\u4E3A\u6CD5\u672F\uFF0C\u4F24\u5BB3\u5168\u4F53", { target: "enemy-all" }),
    sk("\u72EC\u65AD", "passive", "passive-atk", 0.09, 2, "\u501F\u8346\u5DDE\u4E4B\u8C0B\uFF0C\u6C38\u4E45\u63D0\u9AD8\u653B\u51FB", { value: 0.09 }),
    sk("\u5355\u5200\u8D74\u4F1A", "active", "heal", 1, 3, "\u4EE5\u8C08\u6B62\u5175\uFF0C\u6CBB\u7597\u6211\u65B9\u4F24\u52BF\u6700\u91CD\u8005", { target: "ally-low" }),
    sk("\u540C\u821F\u5171\u6D4E", "active", "shield", 1.1, 4, "\u6C5F\u4E1C\u540C\u5FC3\uFF0C\u4E3A\u6211\u65B9\u5168\u4F53\u51DD\u805A\u62A4\u76FE", { target: "ally-all" })
  ],
  lingtong: [
    sk("\u5408\u6DDD\u7A81\u9635", "active", "strike", 1.7, 1, "\u767D\u9A6C\u7A81\u5165\uFF0C\u91CD\u521B\u654C\u65B9\u5355\u4F53", { target: "enemy-front" }),
    sk("\u864E\u81E3", "passive", "passive-atk", 0.1, 2, "\u6C5F\u8868\u5C11\u58EE\uFF0C\u6C38\u4E45\u63D0\u9AD8\u653B\u51FB", { value: 0.1 }),
    sk("\u4E50\u8FDB\u5BF9\u51B3", "active", "execute", 1.55, 3, "\u72ED\u8DEF\u76F8\u9022\uFF0C\u65A9\u6740\u751F\u547D\u6700\u4F4E\u8005", { target: "enemy-low" }),
    sk("\u5C11\u58EE", "active", "absorb", 1.4, 4, "\u8840\u6218\u6C99\u573A\uFF0C\u593A\u53D6\u4F24\u5BB3\u56DE\u590D\u81EA\u8EAB", { target: "enemy-front" })
  ],
  lukang: [
    sk("\u897F\u9675\u7834\u56F4", "active", "aoe", 0.8, 1, "\u4ECE\u5BB9\u8C03\u5EA6\uFF0C\u6CD5\u672F\u8986\u76D6\u654C\u65B9\u5168\u4F53", { target: "enemy-all" }),
    sk("\u5E7C\u8282", "passive", "passive-def", 0.1, 2, "\u6B65\u6B65\u4E3A\u8425\uFF0C\u6C38\u4E45\u63D0\u9AD8\u9632\u5FA1", { value: 0.1 }),
    sk("\u836F\u9001\u7F8A\u9646", "active", "heal", 1.08, 3, "\u8FB9\u5883\u4E92\u5E02\uFF0C\u6CBB\u7597\u6211\u65B9\u4F24\u52BF\u6700\u91CD\u8005", { target: "ally-low" }),
    sk("\u514B\u627F\u7236\u5FD7", "active", "weaken", 0.32, 4, "\u9646\u6C0F\u5175\u6CD5\uFF0C\u524A\u5F31\u654C\u65B9\u5168\u4F53\u653B\u51FB", { target: "enemy-all", value: 3 })
  ],
  sunshangxiang: [
    sk("\u8FDE\u73E0\u7BAD", "active", "execute", 1.72, 1, "\u5F13\u5F00\u6EE1\u6708\uFF0C\u4F18\u5148\u5C04\u6740\u6B8B\u654C", { target: "enemy-low" }),
    sk("\u5F13\u8170", "passive", "passive-atk", 0.1, 2, "\u4F8D\u5A62\u7686\u6B66\u88C5\uFF0C\u6C38\u4E45\u63D0\u9AD8\u653B\u51FB", { value: 0.1 }),
    sk("\u8FD8\u5434", "active", "strike", 1.7, 3, "\u62BD\u5200\u65AD\u540E\uFF0C\u5BF9\u5355\u4F53\u9020\u6210\u9AD8\u989D\u4F24\u5BB3", { target: "enemy-front" }),
    sk("\u67AD\u59EC", "active", "chain", 0.7, 4, "\u8FDE\u73E0\u7BAD\u96E8\uFF0C\u8FDE\u51FB\u591A\u4E2A\u654C\u4EBA", { target: "enemy-all", value: 3 })
  ],
  dongzhuo: [
    sk("\u66B4\u8650\u6A2A\u884C", "active", "strike", 1.55, 1, "\u897F\u51C9\u94C1\u9A91\u8E0F\u9635\uFF0C\u91CD\u51FB\u5355\u4F53", { target: "enemy-front" }),
    sk("\u592A\u5E08", "passive", "passive-hp", 0.12, 2, "\u6743\u503E\u671D\u91CE\uFF0C\u6C38\u4E45\u63D0\u9AD8\u751F\u547D", { value: 0.12 }),
    sk("\u5E9F\u7ACB", "active", "aoe", 0.6, 3, "\u53F7\u4EE4\u51C9\u5DDE\u5175\uFF0C\u6A2A\u626B\u654C\u65B9\u5168\u4F53", { target: "enemy-all" }),
    sk("\u90FF\u575E", "active", "shield", 1.5, 4, "\u9AD8\u5792\u6DF1\u6C9F\uFF0C\u4E3A\u6211\u65B9\u5168\u4F53\u51DD\u805A\u62A4\u76FE", { target: "ally-all" })
  ],
  jiaxu: [
    sk("\u79BB\u95F4\u4E09\u8BA1", "active", "control", 1.2, 1, "\u4E00\u8A00\u79BB\u95F4\uFF0C\u654C\u65B9\u524D\u6392\u65E0\u6CD5\u884C\u52A8", { target: "enemy-front", value: 2 }),
    sk("\u6BD2\u58EB", "passive", "passive-atk", 0.1, 2, "\u7B97\u65E0\u9057\u7B56\uFF0C\u6C38\u4E45\u63D0\u9AD8\u653B\u51FB", { value: 0.1 }),
    sk("\u6BD2\u70DF\u8680\u9AA8", "active", "poison", 0.72, 3, "\u6BD2\u70DF\u5F25\u6F2B\uFF0C\u654C\u65B9\u5168\u4F53\u4E2D\u6BD2\u5E76\u6301\u7EED\u6389\u8840", { target: "enemy-all", value: 3 }),
    sk("\u7B97\u65E0\u9057\u7B56", "active", "weaken", 0.36, 4, "\u4E71\u654C\u9635\u811A\uFF0C\u524A\u5F31\u654C\u65B9\u5168\u4F53\u653B\u51FB", { target: "enemy-all", value: 3 })
  ],
  huaxiong: [
    sk("\u6E29\u9152\u672A\u51C9", "active", "strike", 1.75, 1, "\u5173\u524D\u6426\u6218\uFF0C\u91CD\u521B\u654C\u65B9\u5355\u4F53", { target: "enemy-front" }),
    sk("\u5148\u950B", "passive", "passive-atk", 0.1, 2, "\u8463\u519B\u9510\u58EB\uFF0C\u6C38\u4E45\u63D0\u9AD8\u653B\u51FB", { value: 0.1 }),
    sk("\u6C5C\u6C34", "active", "execute", 1.55, 3, "\u8FDE\u65A9\u6570\u5C06\uFF0C\u72D9\u6740\u751F\u547D\u6700\u4F4E\u8005", { target: "enemy-low" }),
    sk("\u897F\u51C9\u9510", "active", "absorb", 1.4, 4, "\u864E\u996E\u8840\uFF0C\u593A\u53D6\u4F24\u5BB3\u56DE\u590D\u81EA\u8EAB", { target: "enemy-front" })
  ],
  yanliang: [
    sk("\u767D\u9A6C\u7A81\u9A91", "active", "execute", 1.78, 1, "\u4E07\u519B\u53D6\u9996\uFF0C\u65A9\u6740\u751F\u547D\u6700\u4F4E\u8005", { target: "enemy-low" }),
    sk("\u4E0A\u5C06", "passive", "passive-atk", 0.1, 2, "\u6CB3\u5317\u540D\u5C06\uFF0C\u6C38\u4E45\u63D0\u9AD8\u653B\u51FB", { value: 0.1 }),
    sk("\u6CB3\u4E0A\u9635", "active", "strike", 1.7, 3, "\u5927\u65A7\u5F53\u5148\uFF0C\u5BF9\u5355\u4F53\u9020\u6210\u9AD8\u989D\u4F24\u5BB3", { target: "enemy-front" }),
    sk("\u6CB3\u5317\u53CC\u58C1", "active", "mark", 0.34, 4, "\u540D\u9707\u6CB3\u5317\uFF0C\u6807\u8BB0\u76EE\u6807\u63D0\u9AD8\u5176\u53D7\u521B", { target: "enemy-low", value: 3 })
  ],
  caiwenji: [
    sk("\u60B2\u6124\u629A\u7434", "active", "heal", 1.3, 1, "\u80E1\u7B33\u4E00\u58F0\uFF0C\u6CBB\u7597\u6211\u65B9\u751F\u547D\u6700\u4F4E\u7684\u6B66\u5C06", { target: "ally-low" }),
    sk("\u5F52\u6C49", "passive", "regen", 0.1, 2, "\u6BCF\u56DE\u5408\u4E3A\u4F24\u52BF\u6700\u91CD\u7684\u53CB\u519B\u56DE\u590D\u751F\u547D", { cond: "ally-hurt" }),
    sk("\u5341\u516B\u62CD", "active", "heal-all", 0.62, 3, "\u7434\u97F3\u56DE\u8425\uFF0C\u6CBB\u7597\u6211\u65B9\u5168\u4F53", { target: "ally-all" }),
    sk("\u8FA8\u7434", "active", "cleanse", 1, 4, "\u4E00\u66F2\u6E05\u5FC3\uFF0C\u9A71\u6563\u53CB\u519B\u8D1F\u9762\u72B6\u6001", { target: "ally-other" })
  ]
};
var ROLE_AWAKEN_TEMPLATES = {
  tank: [
    { name: "\u94C1\u58C1\u771F\u8EAB", fx: "shield", power: 1.8, target: "ally-all", desc: "\u89C9\u9192\uFF1A\u51DD\u805A\u94DC\u5899\u94C1\u58C1\uFF0C\u4E3A\u6211\u65B9\u5168\u4F53\u9644\u52A0\u62A4\u76FE" },
    { name: "\u6012\u559D\u4E09\u519B", fx: "taunt", power: 1, target: "enemy-front", desc: "\u89C9\u9192\uFF1A\u6012\u559D\u654C\u65B9\u524D\u6392\uFF0C\u8FEB\u5176\u653B\u51FB\u81EA\u5DF1" },
    { name: "\u767E\u70BC\u94A2\u8EAB", fx: "passive-hp", power: 0.16, desc: "\u89C9\u9192\uFF1A\u767E\u70BC\u94A2\u8EAB\uFF0C\u6C38\u4E45\u63D0\u9AD8\u751F\u547D" },
    { name: "\u9677\u9635\u4E4B\u5A01", fx: "aoe", power: 0.72, desc: "\u89C9\u9192\uFF1A\u9677\u9635\u7A81\u8FDB\uFF0C\u4F24\u5BB3\u654C\u65B9\u5168\u4F53" },
    { name: "\u4E0D\u52A8\u5982\u5C71", fx: "passive-def", power: 0.18, desc: "\u89C9\u9192\uFF1A\u4E0D\u52A8\u5982\u5C71\uFF0C\u6C38\u4E45\u63D0\u9AD8\u9632\u5FA1" }
  ],
  warrior: [
    { name: "\u6218\u795E\u964D\u4E34", fx: "strike", power: 2.15, desc: "\u89C9\u9192\uFF1A\u6218\u795E\u964D\u4E34\uFF0C\u91CD\u521B\u654C\u65B9\u5355\u4F53" },
    { name: "\u7834\u519B", fx: "pierce", power: 0.48, desc: "\u89C9\u9192\uFF1A\u7834\u519B\u51FB\u788E\u654C\u65B9\u9632\u5FA1" },
    { name: "\u65E0\u53CC\u8FDE\u65A9", fx: "chain", power: 0.9, desc: "\u89C9\u9192\uFF1A\u65E0\u53CC\u8FDE\u65A9\uFF0C\u8FDE\u51FB\u591A\u4E2A\u654C\u4EBA" },
    { name: "\u8840\u6218\u4E4B\u9B42", fx: "drain", power: 0.22, desc: "\u89C9\u9192\uFF1A\u8840\u6218\u4E4B\u9B42\uFF0C\u666E\u653B\u5438\u53D6\u751F\u547D" },
    { name: "\u4E07\u519B\u8F9F\u6613", fx: "execute", power: 2.2, desc: "\u89C9\u9192\uFF1A\u4E07\u519B\u8F9F\u6613\uFF0C\u65A9\u6740\u751F\u547D\u6700\u4F4E\u8005" }
  ],
  dps: [
    { name: "\u795E\u7F5A\u8BDB\u654C", fx: "execute", power: 2.3, desc: "\u89C9\u9192\uFF1A\u795E\u7F5A\u8BDB\u654C\uFF0C\u65A9\u6740\u751F\u547D\u6700\u4F4E\u8005" },
    { name: "\u7EDD\u547D\u6807\u8BB0", fx: "mark", power: 0.42, desc: "\u89C9\u9192\uFF1A\u7EDD\u547D\u6807\u8BB0\uFF0C\u63D0\u9AD8\u76EE\u6807\u53D7\u5230\u7684\u4F24\u5BB3" },
    { name: "\u6740\u622E\u9886\u57DF", fx: "aoe", power: 0.85, desc: "\u89C9\u9192\uFF1A\u6740\u622E\u9886\u57DF\uFF0C\u4F24\u5BB3\u654C\u65B9\u5168\u4F53" },
    { name: "\u8840\u9B54", fx: "absorb", power: 1.85, desc: "\u89C9\u9192\uFF1A\u8840\u9B54\u5438\u53D6\uFF0C\u593A\u53D6\u4F24\u5BB3\u56DE\u590D\u81EA\u8EAB" },
    { name: "\u706D\u9876", fx: "sunder", power: 0.18, desc: "\u89C9\u9192\uFF1A\u706D\u9876\u524A\u51CF\u654C\u65B9\u751F\u547D\u4E0A\u9650" }
  ],
  mage: [
    { name: "\u5929\u706B\u71CE\u539F", fx: "aoe", power: 0.95, desc: "\u89C9\u9192\uFF1A\u5929\u706B\u71CE\u539F\uFF0C\u4F24\u5BB3\u654C\u65B9\u5168\u4F53" },
    { name: "\u711A\u5929", fx: "burn", power: 1.05, desc: "\u89C9\u9192\uFF1A\u711A\u5929\u4E1A\u706B\uFF0C\u707C\u70E7\u654C\u65B9\u5168\u4F53" },
    { name: "\u4E07\u6BD2\u566C\u4F53", fx: "poison", power: 0.95, desc: "\u89C9\u9192\uFF1A\u4E07\u6BD2\u566C\u4F53\uFF0C\u654C\u65B9\u5168\u4F53\u4E2D\u6BD2" },
    { name: "\u6444\u9B42", fx: "control", power: 1.35, desc: "\u89C9\u9192\uFF1A\u6444\u9B42\u672F\uFF0C\u654C\u65B9\u524D\u6392\u65E0\u6CD5\u884C\u52A8" },
    { name: "\u5F31\u5316\u5929\u5A01", fx: "weaken", power: 0.45, desc: "\u89C9\u9192\uFF1A\u5F31\u5316\u5929\u5A01\uFF0C\u524A\u5F31\u654C\u65B9\u5168\u4F53\u653B\u51FB" }
  ],
  heal: [
    { name: "\u7518\u9716\u666E\u964D", fx: "heal-all", power: 0.78, desc: "\u89C9\u9192\uFF1A\u7518\u9716\u666E\u964D\uFF0C\u6CBB\u7597\u6211\u65B9\u5168\u4F53" },
    { name: "\u5999\u624B\u56DE\u6625", fx: "heal", power: 1.75, desc: "\u89C9\u9192\uFF1A\u5999\u624B\u56DE\u6625\uFF0C\u5927\u91CF\u6CBB\u7597\u4F24\u52BF\u6700\u91CD\u8005" },
    { name: "\u6DA4\u8361\u6D4A\u6C14", fx: "cleanse", power: 1, desc: "\u89C9\u9192\uFF1A\u6DA4\u8361\u6D4A\u6C14\uFF0C\u9A71\u6563\u53CB\u519B\u8D1F\u9762\u72B6\u6001" },
    { name: "\u751F\u751F\u4E0D\u606F", fx: "regen-all", power: 0.12, desc: "\u89C9\u9192\uFF1A\u751F\u751F\u4E0D\u606F\uFF0C\u6BCF\u56DE\u5408\u5168\u4F53\u56DE\u590D\u751F\u547D" },
    { name: "\u56FA\u82E5\u91D1\u6C64", fx: "shield", power: 1.35, desc: "\u89C9\u9192\uFF1A\u56FA\u82E5\u91D1\u6C64\uFF0C\u4E3A\u6211\u65B9\u5168\u4F53\u51DD\u805A\u62A4\u76FE" }
  ]
};

// src/data/skills.ts
var DIVINE_SKILLS = {
  tank: { name: "\u795E\u8EAF", kind: "passive", fx: "passive-hp", power: 0.22, unlockAt: 0, desc: "\u795E\u5C06\u4E0D\u706D\u4E4B\u8EAF\uFF0C\u6C38\u4E45\u5927\u5E45\u63D0\u9AD8\u751F\u547D", value: 0.22 },
  warrior: { name: "\u795E\u5A01", kind: "active", fx: "strike", power: 2.1, unlockAt: 0, desc: "\u795E\u5A01\u5929\u964D\uFF0C\u91CD\u521B\u654C\u65B9\u5355\u4F53", target: "enemy-front" },
  dps: { name: "\u795E\u8BDB", kind: "active", fx: "execute", power: 2.2, unlockAt: 0, desc: "\u795E\u7F5A\u8BDB\u654C\uFF0C\u65A9\u6740\u751F\u547D\u6700\u4F4E\u8005", target: "enemy-low" },
  mage: { name: "\u795E\u7F5A", kind: "active", fx: "aoe", power: 0.92, unlockAt: 0, desc: "\u5929\u706B\u71CE\u539F\uFF0C\u4F24\u5BB3\u654C\u65B9\u5168\u4F53", target: "enemy-all" },
  heal: { name: "\u795E\u6108", kind: "active", fx: "heal-all", power: 0.72, unlockAt: 0, desc: "\u7518\u9716\u666E\u964D\uFF0C\u6CBB\u7597\u6211\u65B9\u5168\u4F53", target: "ally-all" }
};
function divineSkill(heroId) {
  const base = DIVINE_SKILLS[HERO_MAP[heroId]?.role ?? ""];
  return base ? tuneForRole(heroId, [base])[0] : null;
}
function heroSkills(heroId) {
  return tuneForRole(heroId, HERO_SKILLS[heroId] ?? []);
}
function awakenSkills(heroId, _awaken) {
  const role = HERO_MAP[heroId]?.role ?? "warrior";
  const tpl = ROLE_AWAKEN_TEMPLATES[role] ?? ROLE_AWAKEN_TEMPLATES.warrior;
  const title = HERO_MAP[heroId]?.title ?? "\u65E0\u540D";
  return tpl.map((t, i) => {
    const sk2 = {
      name: `${title}\xB7${t.name}`,
      kind: t.fx.startsWith("passive-") ? "passive" : "active",
      fx: t.fx,
      power: t.power,
      unlockAt: 0,
      desc: t.desc,
      awakenAt: i + 1
    };
    if (t.cond) sk2.cond = t.cond;
    if (t.target) sk2.target = t.target;
    if (t.fx.startsWith("passive-")) sk2.value = t.power;
    return sk2;
  });
}
function tuneForRole(heroId, list) {
  const role = HERO_MAP[heroId]?.role;
  return list.map((sk2) => {
    let power = sk2.power;
    if (role === "tank" && (sk2.fx === "passive-def" || sk2.fx === "passive-hp")) power = round2(power + 0.06);
    if (role === "warrior" && (sk2.fx === "strike" || sk2.fx === "passive-atk")) power = round2(power * 1.12);
    if (role === "dps" && (sk2.fx === "strike" || sk2.fx === "execute" || sk2.fx === "passive-atk")) power = round2(power * 1.18);
    if (role === "mage" && (sk2.fx === "aoe" || sk2.fx === "burn" || sk2.fx === "poison")) power = round2(power * 1.18);
    if (role === "mage" && sk2.fx === "passive-atk") power = round2(power * 1.1);
    if (role === "heal" && (sk2.fx === "heal" || sk2.fx === "heal-all")) power = round2(power * 1.28);
    if (role === "tank" && (sk2.fx === "shield" || sk2.fx === "taunt")) power = round2(power * 1.12);
    if (role === "warrior" && (sk2.fx === "drain" || sk2.fx === "pierce")) power = round2(power * 1.1);
    if (role === "dps" && (sk2.fx === "chain" || sk2.fx === "absorb" || sk2.fx === "mark")) power = round2(power * 1.12);
    if (role === "heal" && sk2.fx === "cleanse") power = round2(power * 1.2);
    return power === sk2.power ? sk2 : { ...sk2, power };
  });
}
function round2(n) {
  return Math.round(n * 100) / 100;
}
function skillNeed(unlockAt) {
  return Math.max(0, unlockAt - 1);
}
function unlockedSkills(heroId, breakthrough, divine = false, awaken = 0) {
  const list = heroSkills(heroId).filter((s) => breakthrough >= skillNeed(s.unlockAt));
  if (awaken > 0) {
    list.push(...awakenSkills(heroId, awaken).filter((s) => s.awakenAt <= awaken));
  }
  if (divine) {
    const god = divineSkill(heroId);
    if (god) list.push(god);
  }
  return list;
}
var DEFAULT_CTX = {
  hp: 1,
  maxHp: 1,
  allies: [],
  enemies: []
};
function condSatisfied(cond, ctx) {
  if (!cond || cond === "always") return true;
  const { allies, enemies, hp, maxHp } = ctx;
  switch (cond) {
    case "ally-hurt":
      return allies.some((f) => f.hp < f.maxHp * 0.7);
    case "self-burn":
      return false;
    case "self-poison":
      return false;
    case "enemy-burn":
      return enemies.some((f) => f.burn > 0);
    case "enemy-control":
      return enemies.some((f) => f.stun > 0);
    case "hp-high":
      return hp >= maxHp * 0.8;
    case "hp-low":
      return hp <= maxHp * 0.4;
    case "enemy-few":
      return enemies.length <= 2;
    default:
      return true;
  }
}
function situationalBonus(sk2, ctx) {
  const hurtAllies = ctx.allies.filter((f) => f.hp < f.maxHp * 0.6).length;
  const lowEnemies = ctx.enemies.filter((f) => f.hp < f.maxHp * 0.35).length;
  switch (sk2.fx) {
    case "heal":
    case "heal-all":
      return hurtAllies * (sk2.fx === "heal" ? 1.6 : 1.1);
    case "execute":
      return lowEnemies * 2.2;
    case "sunder":
      return lowEnemies * 1.2;
    case "mark":
    case "chain":
    case "absorb":
      return ctx.enemies.length >= 3 ? 1.2 : 0;
    case "shield":
    case "taunt":
      return hurtAllies >= 2 ? 1.8 : 0.2;
    case "cleanse":
      return ctx.allies.some((f) => f.burn > 0 || f.poison > 0 || f.stun > 0) ? 3 : 0;
    case "haste":
      return ctx.allies.length >= 4 ? 1.1 : 0.3;
    case "pierce":
    case "weaken":
      return ctx.enemies.length >= 2 ? 1.3 : 0.6;
    default:
      return 0;
  }
}
var ROLE_WEIGHT = {
  tank: { strike: 0.8, aoe: 1, shield: 2.2, taunt: 2, burn: 0.6, control: 1, "passive-hp": 1.5, "passive-def": 1.5, regen: 1.2, "regen-all": 1 },
  warrior: { strike: 2, execute: 1.6, pierce: 1.8, drain: 1.8, aoe: 0.9, burn: 0.8, mark: 1.2, "passive-atk": 1.5, haste: 1.2, control: 0.7 },
  dps: { execute: 2.2, strike: 1.8, chain: 2, absorb: 1.8, mark: 1.6, sunder: 1.4, aoe: 1.2, burn: 1.2, "passive-atk": 1.5 },
  mage: { aoe: 1.8, burn: 1.8, poison: 1.8, weaken: 1.8, chain: 1.6, control: 1.4, strike: 0.7, execute: 1, "passive-atk": 1.3 },
  heal: { heal: 2, "heal-all": 1.8, cleanse: 2.2, regen: 1.4, "regen-all": 1.2, strike: 0.2, aoe: 0.2 }
};
function scoreSkill(sk2, heroId, ctx) {
  const role = HERO_MAP[heroId]?.role ?? "warrior";
  const pref = ROLE_WEIGHT[role]?.[sk2.fx] ?? 1;
  const cond = condSatisfied(sk2.cond, ctx) ? 1.6 : 0;
  const situ = situationalBonus(sk2, ctx);
  const base = sk2.cond && sk2.cond !== "always" ? cond : 1;
  return pref * base + situ + sk2.power * 0.35;
}
function chooseSkill(heroId, breakthrough, ctx = DEFAULT_CTX, divine = false, awaken = 0) {
  const list = unlockedSkills(heroId, breakthrough, divine, awaken).filter((s) => s.kind === "active");
  if (!list.length) return null;
  const usable = list.filter((s) => condSatisfied(s.cond, ctx));
  const pool = usable.length ? usable : list;
  let best = pool[0];
  let bestScore = -Infinity;
  for (const sk2 of pool) {
    const score = scoreSkill(sk2, heroId, ctx) + Math.random() * 0.5;
    if (score > bestScore) {
      bestScore = score;
      best = sk2;
    }
  }
  return best;
}

// src/game/squad.ts
function squadSlots(count) {
  const table = [
    [],
    [1],
    [0, 2],
    [0, 1, 2],
    [0, 1, 2, 4],
    [0, 1, 2, 3, 5],
    [0, 1, 2, 3, 4, 5]
  ];
  const n = Math.max(0, Math.min(6, count));
  return table[n] ?? table[6];
}
function squadLevel(base, count) {
  const scale = [1, 1.42, 1.24, 1.1, 1, 0.94, 0.86][Math.max(1, Math.min(6, count))] ?? 1;
  return Math.max(1, Math.round(base * scale));
}
function enemyBreakthrough(level) {
  return Math.min(4, Math.floor((level - 1) / 8));
}

// src/data/equips.ts
var EQUIPS = [
  { id: "blade_green", name: "\u9752\u91ED\u5251", slot: "weapon", rarity: "R", atk: 28, hp: 0, def: 0, desc: "\u950B\u5229\u77ED\u5251\uFF0C\u63D0\u5347\u653B\u51FB" },
  { id: "blade_purple", name: "\u9F99\u6CC9\u5251", slot: "weapon", rarity: "SR", atk: 55, hp: 40, def: 0, desc: "\u540D\u5251\uFF0C\u653B\u9632\u517C\u5907" },
  { id: "blade_orange", name: "\u9752\u9F99\u5043\u6708", slot: "weapon", rarity: "SSR", atk: 95, hp: 60, def: 10, desc: "\u5173\u7FBD\u7684\u5043\u6708\u5200", exclusive: { heroId: "guanyu", atk: 40, hp: 24, def: 8 } },
  { id: "spear_r", name: "\u70B9\u94A2\u67AA", slot: "weapon", rarity: "R", atk: 32, hp: 0, def: 0, desc: "\u67AA\u51FA\u5982\u9F99" },
  { id: "fan_sr", name: "\u7FBD\u6247", slot: "weapon", rarity: "SR", atk: 48, hp: 80, def: 8, desc: "\u8C0B\u58EB\u4E4B\u5668\uFF0C\u589E\u5F3A\u6CD5\u653B" },
  { id: "armor_r", name: "\u94C1\u672D\u7532", slot: "armor", rarity: "R", atk: 0, hp: 120, def: 18, desc: "\u666E\u901A\u94C1\u7532" },
  { id: "armor_sr", name: "\u9501\u5B50\u7532", slot: "armor", rarity: "SR", atk: 10, hp: 220, def: 36, desc: "\u7CBE\u5DE5\u9501\u7532" },
  { id: "armor_ssr", name: "\u9EC4\u91D1\u94E0", slot: "armor", rarity: "SSR", atk: 20, hp: 380, def: 58, desc: "\u540D\u5C06\u91D1\u7532" },
  { id: "robe_r", name: "\u9053\u888D", slot: "armor", rarity: "R", atk: 8, hp: 90, def: 10, desc: "\u8F7B\u4FBF\u9632\u62A4" },
  { id: "ring_r", name: "\u7389\u4F69", slot: "accessory", rarity: "R", atk: 12, hp: 40, def: 6, desc: "\u6E29\u6DA6\u5982\u7389" },
  { id: "ring_sr", name: "\u864E\u7B26", slot: "accessory", rarity: "SR", atk: 28, hp: 80, def: 12, desc: "\u8C03\u5175\u9063\u5C06" },
  { id: "ring_ssr", name: "\u4F20\u56FD\u7389\u73BA", slot: "accessory", rarity: "SSR", atk: 50, hp: 140, def: 22, desc: "\u53D7\u547D\u4E8E\u5929" },
  { id: "helm_r", name: "\u76AE\u76D4", slot: "helm", rarity: "R", atk: 0, hp: 40, def: 10, desc: "\u5BFB\u5E38\u76AE\u76D4" },
  { id: "helm_sr", name: "\u517D\u9762\u76D4", slot: "helm", rarity: "SR", atk: 6, hp: 80, def: 22, desc: "\u517D\u9762\u62A4\u9996" },
  { id: "helm_ssr", name: "\u91D1\u7F15\u76D4", slot: "helm", rarity: "SSR", atk: 14, hp: 140, def: 36, desc: "\u91D1\u7F15\u62A4\u989D" },
  { id: "boot_r", name: "\u5E03\u9774", slot: "boots", rarity: "R", atk: 4, hp: 30, def: 6, desc: "\u6B65\u5C65\u5E73\u7A33" },
  { id: "boot_sr", name: "\u8FFD\u98CE\u9774", slot: "boots", rarity: "SR", atk: 18, hp: 100, def: 16, desc: "\u8EAB\u8F7B\u5982\u71D5" },
  { id: "boot_ssr", name: "\u4E91\u5C65", slot: "boots", rarity: "SSR", atk: 28, hp: 160, def: 24, desc: "\u8E0F\u4E91\u800C\u884C" },
  { id: "book_r", name: "\u5175\u6CD5\u6B8B\u5377", slot: "treasure", rarity: "R", atk: 16, hp: 20, def: 0, desc: "\u6B8B\u5377\u4EA6\u6709\u6240\u5F97" },
  { id: "book_sr", name: "\u5B59\u5B50\u5175\u6CD5", slot: "treasure", rarity: "SR", atk: 36, hp: 40, def: 8, desc: "\u77E5\u5DF1\u77E5\u5F7C" },
  { id: "book_ssr", name: "\u9752\u56CA\u4E66", slot: "treasure", rarity: "SSR", atk: 24, hp: 180, def: 18, desc: "\u533B\u9053\u5175\u673A" },
  { id: "yun_spear", name: "\u9F99\u80C6\u4EAE\u94F6\u67AA", slot: "weapon", rarity: "SSR", atk: 110, hp: 80, def: 12, desc: "\u5E38\u5C71\u8D75\u4E91\u7684\u94F6\u67AA", exclusive: { heroId: "zhaoyun", atk: 48, hp: 30, def: 8 } },
  { id: "snake_spear", name: "\u4E08\u516B\u86C7\u77DB", slot: "weapon", rarity: "SSR", atk: 108, hp: 70, def: 10, desc: "\u71D5\u4EBA\u5F20\u98DE\u7684\u957F\u77DB", exclusive: { heroId: "zhangfei", atk: 46, hp: 24, def: 6 } },
  { id: "twin_sword", name: "\u96CC\u96C4\u53CC\u5251", slot: "weapon", rarity: "SSR", atk: 96, hp: 90, def: 14, desc: "\u5218\u5907\u7684\u53CC\u80A1\u5251", exclusive: { heroId: "liubei", atk: 36, hp: 40, def: 10 } },
  { id: "zhuge_fan", name: "\u8BF8\u845B\u7FBD\u6247", slot: "weapon", rarity: "SSR", atk: 100, hp: 120, def: 16, desc: "\u5367\u9F99\u624B\u4E2D\u7684\u7FBD\u6247", exclusive: { heroId: "zhugeliang", atk: 42, hp: 36, def: 8 } },
  { id: "sky_halberd", name: "\u65B9\u5929\u753B\u621F", slot: "weapon", rarity: "SSR", atk: 120, hp: 70, def: 12, desc: "\u5415\u5E03\u7684\u753B\u621F", exclusive: { heroId: "lvbu", atk: 55, hp: 20, def: 6 } },
  { id: "yitian", name: "\u501A\u5929\u5251", slot: "weapon", rarity: "SSR", atk: 112, hp: 60, def: 10, desc: "\u66F9\u64CD\u7684\u4F69\u5251", exclusive: { heroId: "caocao", atk: 50, hp: 24, def: 8 } },
  { id: "sunset_bow", name: "\u843D\u65E5\u5F13", slot: "weapon", rarity: "SSR", atk: 108, hp: 50, def: 8, desc: "\u9EC4\u5FE0\u7684\u5F3A\u5F13", exclusive: { heroId: "huangzhong", atk: 52, hp: 16, def: 4 } },
  { id: "iron_ji", name: "\u53CC\u94C1\u621F", slot: "weapon", rarity: "SSR", atk: 104, hp: 90, def: 16, desc: "\u5178\u97E6\u7684\u53CC\u621F", exclusive: { heroId: "dianwei", atk: 44, hp: 36, def: 12 } }
];
var EQUIP_MAP = Object.fromEntries(EQUIPS.map((e) => [e.id, e]));

// src/game/stats.ts
function rarityMult(rarity) {
  switch (rarity) {
    case "SSR":
      return 1.35;
    case "SR":
      return 1.18;
    case "R":
      return 1;
    default:
      return 0.9;
  }
}
function calcEquipBonus(owned, bag) {
  let atk = 0;
  let hp = 0;
  let def = 0;
  for (const uid of Object.values(owned.gear ?? {})) {
    if (!uid) continue;
    const oe = bag.find((e) => e.uid === uid);
    if (!oe) continue;
    const ed = EQUIP_MAP[oe.equipId];
    if (!ed) continue;
    const grown = equipBonus(ed, oe.level, oe.forge ?? 0);
    atk += grown.atk;
    hp += grown.hp;
    def += grown.def;
    const extra = exclusiveBonus(ed, oe.level, oe.forge ?? 0, owned.heroId);
    atk += extra.atk;
    hp += extra.hp;
    def += extra.def;
  }
  return { atk, hp, def };
}
function calcStats(owned, bag = []) {
  const def = HERO_MAP[owned.heroId];
  if (!def) return { atk: 0, hp: 0, def: 0, power: 0 };
  const lv = owned.level;
  const grow = 1 + (lv - 1) * 0.08;
  const rm = rarityMult(def.rarity);
  const bt = 1 + (owned.breakthrough ?? 0) * 0.08;
  const aw = 1 + (owned.awaken ?? 0) * 0.05;
  const god = owned.divine ? DIVINE_MULT : 1;
  const eq = calcEquipBonus(owned, bag);
  let atk = Math.round(def.atk * grow * rm * bt * aw * god + eq.atk);
  let hp = Math.round(def.hp * grow * rm * bt * aw * god + eq.hp);
  let defense = Math.round(def.def * grow * rm * bt * aw * god + eq.def);
  for (const sk2 of unlockedSkills(owned.heroId, owned.breakthrough ?? 0, owned.divine ?? false, owned.awaken ?? 0)) {
    if (sk2.kind !== "passive") continue;
    if (sk2.fx === "passive-atk") atk = Math.round(atk * (1 + sk2.power));
    if (sk2.fx === "passive-hp" || sk2.fx === "regen" || sk2.fx === "regen-all") hp = Math.round(hp * (1 + sk2.power));
    if (sk2.fx === "passive-def") defense = Math.round(defense * (1 + sk2.power));
  }
  const power = atk * 2 + hp * 0.15 + defense * 1.5 + (owned.breakthrough ?? 0) * 40 + (owned.awaken ?? 0) * 60;
  return { atk, hp, def: defense, power: Math.round(power) };
}
function activeBonds(heroIds) {
  const set = new Set(heroIds);
  return BONDS.filter((b) => b.heroes.every((id) => set.has(id)));
}
function pct(n) {
  return `${Math.round(n * 100)}%`;
}
function factionAuras(heroIds) {
  const counts = /* @__PURE__ */ new Map();
  for (const id of heroIds) {
    const faction = HERO_MAP[id]?.faction;
    if (!faction) continue;
    counts.set(faction, (counts.get(faction) ?? 0) + 1);
  }
  return [...counts.entries()].map(([faction, count]) => {
    const tier = [...FACTION_TIERS].reverse().find((t) => count >= t.count);
    const next = FACTION_TIERS.find((t) => t.count > count);
    const label = FACTION_LABEL[faction];
    const hint = tier ? next ? `\u653B+${pct(tier.atk)} \u751F\u547D+${pct(tier.hp)}${tier.def ? ` \u9632+${pct(tier.def)}` : ""} \xB7 \u518D\u4E0A${next.count - count}\u540D\u53EF\u63D0\u5347` : `\u653B+${pct(tier.atk)} \u751F\u547D+${pct(tier.hp)} \u9632+${pct(tier.def)} \xB7 \u540C\u9635\u5DF2\u6EE1` : `\u518D\u4E0A${(next?.count ?? 2) - count}\u540D${label}\u6FC0\u6D3B\u9635\u8425\u52A0\u6210`;
    return {
      faction,
      count,
      atk: tier?.atk ?? 0,
      hp: tier?.hp ?? 0,
      def: tier?.def ?? 0,
      active: !!tier,
      hint
    };
  }).sort((a, b) => b.count - a.count);
}
function formationMods(heroIds) {
  const bonds = activeBonds(heroIds);
  const factions = factionAuras(heroIds);
  return {
    bonds,
    factions,
    atk: bonds.reduce((s, b) => s + b.bonusAtk, 0) + factions.reduce((s, f) => s + f.atk, 0),
    hp: bonds.reduce((s, b) => s + b.bonusHp, 0) + factions.reduce((s, f) => s + f.hp, 0),
    def: factions.reduce((s, f) => s + f.def, 0)
  };
}
var DIVINE_MULT = 1.35;
function equipBonus(def, level, forge = 0) {
  const scale = equipScale(level, forge, def.rarity);
  return {
    atk: Math.round(def.atk * scale),
    hp: Math.round(def.hp * scale),
    def: Math.round(def.def * scale)
  };
}
function exclusiveBonus(def, level, forge, heroId) {
  const ex = def.exclusive;
  if (!ex || !heroId || ex.heroId !== heroId) return { atk: 0, hp: 0, def: 0 };
  const scale = equipScale(level, forge);
  return {
    atk: Math.round(ex.atk * scale),
    hp: Math.round(ex.hp * scale),
    def: Math.round(ex.def * scale)
  };
}
function equipScale(level, forge = 0, rarity) {
  const grow = 1 + Math.max(0, level - 1) * 0.18;
  const smith = 1 + Math.max(0, forge) * 0.15;
  const quality = rarity === "SSR" ? 1.12 : rarity === "SR" ? 1.06 : 1;
  return grow * smith * quality;
}
function equipLevelCap(forge) {
  return 20 + Math.max(0, forge) * 10;
}
var SMITH_CAP = 8;
var UPGRADE_CAP = equipLevelCap(SMITH_CAP);

// src/game/skillFx.ts
function pickTargets(ctx, target, fx) {
  const { actor, foes, friends } = ctx;
  const aliveFoes = ctx.alive(foes);
  const aliveFriends = ctx.alive(friends);
  switch (target ?? defaultTarget(fx)) {
    case "enemy-front":
      return aliveFoes.filter((f) => f.slot < 3).slice(0, 1);
    case "enemy-low":
      return aliveFoes.slice().sort((a, b) => a.hp - b.hp).slice(0, 1);
    case "enemy-back":
      return aliveFoes.filter((f) => f.slot >= 3).slice(0, 1);
    case "enemy-all":
      return aliveFoes;
    case "enemy-random": {
      if (!aliveFoes.length) return [];
      return [aliveFoes[Math.floor(Math.random() * aliveFoes.length)]];
    }
    case "ally-low":
      return aliveFriends.slice().sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp).slice(0, 1);
    case "ally-all":
      return aliveFriends;
    case "ally-other":
      return aliveFriends.filter((f) => f.uid !== actor.uid);
    case "self":
      return [actor];
    default:
      return aliveFoes.slice(0, 1);
  }
}
function defaultTarget(fx) {
  switch (fx) {
    case "aoe":
    case "burn":
    case "poison":
      return "enemy-all";
    case "heal":
      return "ally-low";
    case "heal-all":
      return "ally-all";
    case "execute":
      return "enemy-low";
    case "shield":
    case "taunt":
      return "self";
    case "cleanse":
      return "ally-other";
    default:
      return "enemy-front";
  }
}
function condMet(cond, ctx) {
  if (!cond || cond === "always") return true;
  const { actor, foes, friends } = ctx;
  switch (cond) {
    case "ally-hurt":
      return ctx.alive(friends).some((f) => f.hp < f.maxHp * 0.7);
    case "self-burn":
      return actor.burn > 0;
    case "self-poison":
      return actor.poison > 0;
    case "enemy-burn":
      return ctx.alive(foes).some((f) => f.burn > 0);
    case "enemy-control":
      return ctx.alive(foes).some((f) => f.stun > 0);
    case "hp-high":
      return actor.hp >= actor.maxHp * 0.8;
    case "hp-low":
      return actor.hp <= actor.maxHp * 0.4;
    case "enemy-few":
      return ctx.alive(foes).length <= 2;
    default:
      return true;
  }
}

// src/game/skillExec.ts
function makeCtx(actor, foes, friends) {
  return {
    actor,
    foes,
    friends,
    alive: (list) => list.filter((f) => f.alive && f.hp > 0)
  };
}
function execSkill(sk2, ctx, h) {
  const { actor } = ctx;
  const power = sk2.power;
  const value = sk2.value ?? 0;
  const targets = pickTargets(ctx, sk2.target, sk2.fx);
  if (!targets.length && sk2.fx !== "cleanse") return null;
  switch (sk2.fx) {
    // ── 基础伤害 ──
    case "strike": {
      const t = targets[0];
      if (!t) return null;
      const hurt = h.hit(actor, t, power);
      return { text: `${actor.name}\u3010${sk2.name}\u3011\u91CD\u521B ${t.name} -${hurt}`, targetIds: [t.uid], value: hurt, kind: "skill", fx: "strike" };
    }
    case "aoe": {
      let total = 0;
      const ids = [];
      for (const t of targets) {
        total += h.hit(actor, t, power);
        ids.push(t.uid);
      }
      return { text: `${actor.name}\u3010${sk2.name}\u3011\u626B\u8FC7\u654C\u9635\uFF0C\u5171\u9020\u6210 ${total} \u4F24\u5BB3`, targetIds: ids, value: total, kind: "skill", fx: "aoe" };
    }
    case "execute": {
      const t = targets[0];
      if (!t) return null;
      const hurt = h.hit(actor, t, power);
      return { text: `${actor.name}\u3010${sk2.name}\u3011\u9501\u5B9A ${t.name} -${hurt}`, targetIds: [t.uid], value: hurt, kind: "skill", fx: "execute" };
    }
    case "chain": {
      const count = Math.max(2, Math.round(value || 3));
      const pool = ctx.alive(ctx.foes).slice();
      let total = 0;
      const ids = [];
      let mult = power;
      for (let i = 0; i < count && pool.length; i++) {
        const idx = Math.floor(Math.random() * pool.length);
        const t = pool.splice(idx, 1)[0];
        total += h.hit(actor, t, mult);
        ids.push(t.uid);
        mult *= 0.72;
      }
      return { text: `${actor.name}\u3010${sk2.name}\u3011\u8FDE\u51FB ${ids.length} \u6B21\uFF0C\u5171\u9020\u6210 ${total} \u4F24\u5BB3`, targetIds: ids, value: total, kind: "skill", fx: "chain" };
    }
    case "absorb": {
      let total = 0;
      const ids = [];
      for (const t of targets) {
        const hurt = h.hit(actor, t, power);
        total += hurt;
        ids.push(t.uid);
      }
      const heal = Math.round(total * 0.4);
      h.mend(actor, actor, heal);
      return { text: `${actor.name}\u3010${sk2.name}\u3011\u5438\u53D6 ${total} \u4F24\u5BB3\uFF0C\u56DE\u590D ${heal} \u751F\u547D`, targetIds: ids, value: total, kind: "skill", fx: "absorb" };
    }
    case "sunder": {
      const t = targets[0];
      if (!t) return null;
      const cut = Math.max(1, Math.round(t.maxHp * power));
      t.maxHp = Math.max(1, t.maxHp - cut);
      t.hp = Math.max(0, t.hp - cut);
      if (t.hp <= 0) t.alive = false;
      actor.dealt += cut;
      t.taken += cut;
      return { text: `${actor.name}\u3010${sk2.name}\u3011\u524A\u51CF ${t.name} \u751F\u547D\u4E0A\u9650 ${cut}`, targetIds: [t.uid], value: cut, kind: "skill", fx: "sunder" };
    }
    // ── 持续伤害 ──
    case "burn": {
      const tick = Math.max(8, Math.round(h.effAtk(actor) * 0.2));
      const turn = Math.max(1, Math.round(value || 2));
      let total = 0;
      const ids = [];
      for (const t of targets) {
        total += h.hit(actor, t, power * 0.6);
        t.burn = Math.max(t.burn, turn);
        t.burnTick = Math.max(t.burnTick, tick);
        t.burnFrom = actor.uid;
        ids.push(t.uid);
      }
      return { text: `${actor.name}\u3010${sk2.name}\u3011\u707C\u70E7\u654C\u9635\uFF0C\u9020\u6210 ${total} \u4F24\u5BB3`, targetIds: ids, value: total, kind: "skill", fx: "burn" };
    }
    case "poison": {
      const tick = Math.max(6, Math.round(h.effAtk(actor) * 0.16));
      const turn = Math.max(1, Math.round(value || 3));
      let total = 0;
      const ids = [];
      for (const t of targets) {
        total += h.hit(actor, t, power * 0.38);
        t.poison = Math.max(t.poison, turn);
        t.poisonTick = Math.max(t.poisonTick, tick);
        t.poisonFrom = actor.uid;
        ids.push(t.uid);
      }
      return { text: `${actor.name}\u3010${sk2.name}\u3011\u65BD\u6BD2\uFF0C\u9020\u6210 ${total} \u4F24\u5BB3`, targetIds: ids, value: total, kind: "skill", fx: "poison" };
    }
    // ── 控制与增益减益 ──
    case "control": {
      const t = targets[0];
      if (!t) return null;
      const hurt = h.hit(actor, t, Math.max(0.4, power * 0.35));
      const turn = Math.max(1, Math.round(value || 1));
      t.stun = Math.max(t.stun, turn);
      return { text: `${actor.name}\u3010${sk2.name}\u3011\u63A7\u5236 ${t.name} -${hurt}\uFF0C${turn} \u56DE\u5408\u65E0\u6CD5\u884C\u52A8`, targetIds: [t.uid], value: hurt, kind: "skill", fx: "control" };
    }
    case "taunt": {
      const t = targets[0];
      if (!t) return null;
      const turn = Math.max(1, Math.round(value || 1));
      t.tauntBy = actor.uid;
      t.tauntTurns = turn;
      return { text: `${actor.name}\u3010${sk2.name}\u3011\u6012\u559D ${t.name}\uFF0C${turn} \u56DE\u5408\u88AB\u8FEB\u653B\u51FB\u81EA\u5DF1`, targetIds: [t.uid], value: turn, kind: "skill", fx: "taunt" };
    }
    case "pierce": {
      const t = targets[0];
      if (!t) return null;
      const turn = Math.max(1, Math.round(value || 2));
      const ratio = Math.min(0.75, power);
      t.defDown = Math.max(t.defDown, ratio);
      t.defDownTurns = Math.max(t.defDownTurns, turn);
      const hurt = h.hit(actor, t, 0.3);
      return { text: `${actor.name}\u3010${sk2.name}\u3011\u7834\u7532 ${t.name}\uFF0C\u9632\u5FA1\u964D\u4F4E ${Math.round(ratio * 100)}%`, targetIds: [t.uid], value: hurt, kind: "skill", fx: "pierce" };
    }
    case "weaken": {
      const t = targets[0];
      if (!t) return null;
      const turn = Math.max(1, Math.round(value || 2));
      const ratio = Math.min(0.75, power);
      t.atkDown = Math.max(t.atkDown, ratio);
      t.atkDownTurns = Math.max(t.atkDownTurns, turn);
      return { text: `${actor.name}\u3010${sk2.name}\u3011\u524A\u5F31 ${t.name}\uFF0C\u653B\u51FB\u964D\u4F4E ${Math.round(ratio * 100)}%`, targetIds: [t.uid], value: turn, kind: "skill", fx: "weaken" };
    }
    case "mark": {
      const t = targets[0];
      if (!t) return null;
      const turn = Math.max(1, Math.round(value || 2));
      const ratio = Math.min(0.6, power);
      t.mark = Math.max(t.mark, ratio);
      t.markTurns = Math.max(t.markTurns, turn);
      return { text: `${actor.name}\u3010${sk2.name}\u3011\u6807\u8BB0 ${t.name}\uFF0C\u5176\u53D7\u5230\u7684\u4F24\u5BB3\u63D0\u9AD8 ${Math.round(ratio * 100)}%`, targetIds: [t.uid], value: turn, kind: "skill", fx: "mark" };
    }
    case "haste": {
      const turn = Math.max(1, Math.round(value || 2));
      const ids = [];
      for (const t of targets) {
        t.haste = Math.max(t.haste, 1);
        t.hasteTurns = Math.max(t.hasteTurns, turn);
        ids.push(t.uid);
      }
      return { text: `${actor.name}\u3010${sk2.name}\u3011\u75BE\u98CE\u52A0\u6301\uFF0C\u53CB\u519B\u884C\u52A8\u52A0\u5FEB`, targetIds: ids, value: turn, kind: "skill", fx: "haste" };
    }
    // ── 治疗与护盾 ──
    case "heal": {
      const t = targets[0];
      if (!t) return null;
      const heal = Math.round(h.effAtk(actor) * power);
      h.mend(actor, t, heal);
      return { text: `${actor.name}\u3010${sk2.name}\u3011\u6CBB\u7597 ${t.name} +${heal}`, targetIds: [t.uid], value: heal, kind: "heal", fx: "heal" };
    }
    case "heal-all": {
      const heal = Math.round(h.effAtk(actor) * power);
      const ids = [];
      let total = 0;
      for (const t of targets) {
        h.mend(actor, t, heal);
        ids.push(t.uid);
        total += heal;
      }
      return { text: `${actor.name}\u3010${sk2.name}\u3011\u6CBB\u7597\u6211\u65B9\u5168\u4F53 +${total}`, targetIds: ids, value: total, kind: "heal", fx: "heal-all" };
    }
    case "shield": {
      const ids = [];
      let total = 0;
      for (const t of targets) {
        const amount = Math.round(h.effAtk(actor) * power);
        t.shield += amount;
        ids.push(t.uid);
        total += amount;
      }
      return { text: `${actor.name}\u3010${sk2.name}\u3011\u51DD\u805A\u62A4\u76FE +${total}`, targetIds: ids, value: total, kind: "skill", fx: "shield" };
    }
    case "cleanse": {
      const ids = [];
      let n = 0;
      for (const t of targets) {
        if (t.burn > 0) {
          t.burn = 0;
          t.burnTick = 0;
          n += 1;
        }
        if (t.poison > 0) {
          t.poison = 0;
          t.poisonTick = 0;
          n += 1;
        }
        if (t.stun > 0) {
          t.stun = 0;
          n += 1;
        }
        if (t.atkDown > 0) {
          t.atkDown = 0;
          t.atkDownTurns = 0;
        }
        if (t.defDown > 0) {
          t.defDown = 0;
          t.defDownTurns = 0;
        }
        ids.push(t.uid);
      }
      if (!n) return null;
      return { text: `${actor.name}\u3010${sk2.name}\u3011\u9A71\u6563\u53CB\u519B ${n} \u5C42\u8D1F\u9762\u72B6\u6001`, targetIds: ids, value: n, kind: "skill", fx: "cleanse" };
    }
    default:
      return null;
  }
}
function tickPassive(sk2, ctx, h) {
  const { actor } = ctx;
  switch (sk2.fx) {
    case "regen": {
      const weak = ctx.alive(ctx.friends).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
      if (!weak || weak.hp >= weak.maxHp) return null;
      const heal = Math.round(h.effAtk(actor) * (0.4 + sk2.power));
      h.mend(actor, weak, heal);
      return { text: `${actor.name}\u3010${sk2.name}\u3011\u6CBB\u7597 ${weak.name} +${heal}`, targetIds: [weak.uid], value: heal, kind: "heal", fx: "heal" };
    }
    case "regen-all": {
      const wounded = ctx.alive(ctx.friends).filter((a) => a.hp < a.maxHp);
      if (!wounded.length) return null;
      const heal = Math.round(h.effAtk(actor) * 0.28);
      const ids = [];
      let total = 0;
      for (const t of wounded) {
        h.mend(actor, t, heal);
        ids.push(t.uid);
        total += heal;
      }
      return { text: `${actor.name}\u3010${sk2.name}\u3011\u6CBB\u7597\u6211\u65B9\u5168\u4F53 +${total}`, targetIds: ids, value: total, kind: "heal", fx: "heal-all" };
    }
    case "drain": {
      return null;
    }
    default:
      return null;
  }
}

// src/game/battle.ts
function snapSide(list) {
  return list.map((f) => ({
    uid: f.uid,
    heroId: f.heroId,
    name: f.name,
    hp: Math.max(0, f.hp),
    maxHp: f.maxHp,
    side: f.side,
    color: f.color,
    slot: f.slot
  }));
}
function push(log, allies, enemies, partial) {
  log.push({
    ...partial,
    allies: snapSide(allies),
    enemies: snapSide(enemies)
  });
}
function makeFighter(owned, bag, side, slot, atkB, hpB, defB) {
  const def = HERO_MAP[owned.heroId];
  const s = calcStats(owned, bag);
  const atk = Math.round(s.atk * (1 + atkB));
  const hp = Math.round(s.hp * (1 + hpB));
  return {
    uid: owned.uid,
    heroId: owned.heroId,
    name: def.name,
    side,
    hp,
    maxHp: hp,
    atk,
    def: Math.round(s.def * (1 + defB)),
    skill: def.skill,
    breakthrough: owned.breakthrough ?? 0,
    divine: owned.divine ?? false,
    awaken: owned.awaken ?? 0,
    color: def.color,
    alive: true,
    slot,
    dealt: 0,
    healed: 0,
    taken: 0,
    burn: 0,
    poison: 0,
    stun: 0,
    burnTick: 0,
    poisonTick: 0,
    shield: 0,
    mark: 0,
    markTurns: 0,
    tauntTurns: 0,
    defDown: 0,
    defDownTurns: 0,
    atkDown: 0,
    atkDownTurns: 0,
    haste: 0,
    hasteTurns: 0,
    skillUses: {},
    cooldowns: {}
  };
}
function effDef(target) {
  return Math.max(0, target.def * (1 - target.defDown));
}
function effAtk(actor) {
  return Math.max(1, actor.atk * (1 - actor.atkDown));
}
var EXEC_HOOKS = {
  hit: (actor, target, mult) => strike(actor, target, mult),
  mend: (actor, target, amount) => mend(actor, target, amount),
  effDef: (target) => effDef(target),
  effAtk: (actor) => effAtk(actor),
  randomFoe: (foes) => {
    const pool = alive(foes);
    return pool.length ? pool[Math.floor(Math.random() * pool.length)] : void 0;
  }
};
function strike(actor, target, mult) {
  const hurt = dmg(effAtk(actor), effDef(target), mult);
  return applyDamage(actor, target, hurt);
}
function applyDamage(actor, target, hurt) {
  const real = Math.round(hurt * (1 + target.mark));
  let rest = real;
  if (target.shield > 0) {
    const absorbed = Math.min(target.shield, rest);
    target.shield -= absorbed;
    rest -= absorbed;
  }
  target.hp -= rest;
  if (target.hp <= 0) target.alive = false;
  actor.dealt += real;
  target.taken += rest;
  return real;
}
function mend(actor, target, amount) {
  target.hp = Math.min(target.maxHp, target.hp + amount);
  actor.healed += amount;
}
function findFighter(allies, enemies, uid) {
  if (!uid) return void 0;
  return [...allies, ...enemies].find((f) => f.uid === uid);
}
function tickRegen(log, allies, enemies) {
  for (const f of [...allies, ...enemies]) {
    if (!f.alive || f.hp <= 0) continue;
    const friends = f.side === "ally" ? allies : enemies;
    const foes = f.side === "ally" ? enemies : allies;
    const passives = unlockedSkills(f.heroId, f.breakthrough, f.divine, f.awaken).filter((s) => s.kind === "passive");
    for (const sk2 of passives) {
      const ctx = makeCtx(f, foes, friends);
      if (!condMet(sk2.cond, ctx)) continue;
      const res = tickPassive(sk2, ctx, EXEC_HOOKS);
      if (!res) continue;
      push(log, allies, enemies, {
        kind: res.kind,
        text: res.text,
        actorId: f.uid,
        targetIds: res.targetIds,
        value: res.value,
        fx: res.fx
      });
    }
  }
}
function tickStatus(allies, enemies) {
  for (const f of [...allies, ...enemies]) {
    if (f.markTurns > 0) {
      f.markTurns -= 1;
      if (f.markTurns <= 0) f.mark = 0;
    }
    if (f.tauntTurns > 0) {
      f.tauntTurns -= 1;
      if (f.tauntTurns <= 0) f.tauntBy = void 0;
    }
    if (f.defDownTurns > 0) {
      f.defDownTurns -= 1;
      if (f.defDownTurns <= 0) f.defDown = 0;
    }
    if (f.atkDownTurns > 0) {
      f.atkDownTurns -= 1;
      if (f.atkDownTurns <= 0) f.atkDown = 0;
    }
    if (f.hasteTurns > 0) {
      f.hasteTurns -= 1;
      if (f.hasteTurns <= 0) f.haste = 0;
    }
    for (const key of Object.keys(f.cooldowns)) {
      f.cooldowns[key] = Math.max(0, f.cooldowns[key] - 1);
    }
  }
}
function tickDots(log, allies, enemies) {
  for (const f of [...allies, ...enemies]) {
    if (!f.alive || f.hp <= 0) continue;
    if (f.burn > 0) {
      const hurt2 = f.burnTick;
      f.hp -= hurt2;
      f.taken += hurt2;
      const src2 = findFighter(allies, enemies, f.burnFrom);
      if (src2) src2.dealt += hurt2;
      f.burn -= 1;
      if (f.hp <= 0) f.alive = false;
      push(log, allies, enemies, {
        kind: "skill",
        text: `${f.name} \u53D7\u5230\u707C\u70E7 -${hurt2}`,
        actorId: f.burnFrom,
        targetIds: [f.uid],
        value: hurt2,
        fx: "burn"
      });
    }
    if (!f.alive || f.hp <= 0 || f.poison <= 0) continue;
    const hurt = f.poisonTick;
    f.hp -= hurt;
    f.taken += hurt;
    const src = findFighter(allies, enemies, f.poisonFrom);
    if (src) src.dealt += hurt;
    f.poison -= 1;
    if (f.hp <= 0) f.alive = false;
    push(log, allies, enemies, {
      kind: "skill",
      text: `${f.name} \u53D7\u5230\u4E2D\u6BD2 -${hurt}`,
      actorId: f.poisonFrom,
      targetIds: [f.uid],
      value: hurt,
      fx: "poison"
    });
  }
}
function pack(win, log, rounds, allies, enemies) {
  const report = [...allies, ...enemies].map((f) => ({
    uid: f.uid,
    heroId: f.heroId,
    name: f.name,
    side: f.side,
    dealt: f.dealt,
    healed: f.healed,
    taken: f.taken
  }));
  return { win, log, rounds, allies, enemies, report, exp: [] };
}
function makeEnemy(heroId, level, slot, bt = 0, aw = 0, uidPrefix = "e", mult = 1) {
  const owned = {
    uid: `${uidPrefix}_${slot}`,
    heroId,
    level,
    shards: 0,
    breakthrough: bt || enemyBreakthrough(level),
    awaken: aw,
    exp: 0,
    gear: {}
  };
  const b = mult - 1;
  return makeFighter(owned, [], "enemy", slot, b, b, b);
}
function alive(list) {
  return list.filter((f) => f.alive && f.hp > 0);
}
function pickFront(list) {
  const a = alive(list);
  if (!a.length) return null;
  const front = a.filter((f) => f.slot < 3);
  const pool = front.length ? front : a;
  return pool.slice().sort((x, y) => x.slot - y.slot)[0];
}
function pickTargetWithTaunt(foes) {
  const taunted = alive(foes).find((f) => f.tauntTurns > 0 && f.tauntBy);
  if (taunted) return taunted;
  return pickFront(foes);
}
function drainRatioOf(f) {
  let best = 0;
  for (const sk2 of unlockedSkills(f.heroId, f.breakthrough, f.divine, f.awaken)) {
    if (sk2.kind === "passive" && sk2.fx === "drain") best = Math.max(best, sk2.value ?? 0);
  }
  return best;
}
function skillUsable(f, sk2) {
  if ((f.cooldowns[sk2.name] ?? 0) > 0) return false;
  const limit = sk2.uses ?? DEFAULT_USES;
  return (f.skillUses[sk2.name] ?? 0) < limit;
}
var DEFAULT_USES = 3;
function skillCtxOf(f, allies, enemies) {
  const friends = f.side === "ally" ? allies : enemies;
  const foes = f.side === "ally" ? enemies : allies;
  const pack2 = (list) => list.map((x) => ({ hp: x.hp, maxHp: x.maxHp, slot: x.slot, burn: x.burn, poison: x.poison, stun: x.stun }));
  return {
    hp: f.hp,
    maxHp: f.maxHp,
    allies: pack2(friends),
    enemies: pack2(foes)
  };
}
function expandLine(primary, foes, line) {
  const mates = alive(foes).filter(
    (t) => line === "row" ? t.slot % 3 === primary.slot % 3 : t.slot < 3 === primary.slot < 3
  );
  if (!mates.some((t) => t.uid === primary.uid)) mates.unshift(primary);
  return mates;
}
function dmg(atk, def, mult = 1) {
  const raw = atk * mult - def * 0.35;
  return Math.max(8, Math.round(raw * (0.9 + Math.random() * 0.25)));
}
function tickCombo(log, allies, enemies, bonds) {
  const foeList = alive(enemies);
  if (!foeList.length) return;
  for (const bond of bonds) {
    const members = bond.heroes.map((hid) => allies.find((a) => a.heroId === hid)).filter((a) => !!a);
    if (members.length < bond.heroes.length) continue;
    const aliveMembers = members.filter((m) => m.alive && m.hp > 0);
    if (aliveMembers.length < 2) continue;
    const casters = aliveMembers.sort((a, b) => b.atk - a.atk).slice(0, 2);
    const avgAtk = casters.reduce((s, c) => s + effAtk(c), 0) / casters.length;
    const mult = bond.comboMult;
    let total = 0;
    const ids = [];
    for (const t of foeList) {
      const hurt = Math.max(8, Math.round(avgAtk * mult - effDef(t) * 0.2));
      const real = applyDamage(casters[0], t, hurt);
      total += real;
      ids.push(t.uid);
    }
    const share = Math.round(total / casters.length);
    casters[0].dealt = Math.max(0, casters[0].dealt - total) + share;
    if (casters[1]) casters[1].dealt += share;
    push(log, allies, enemies, {
      kind: "combo",
      text: `\u7F81\u7ECA\u5408\u51FB\u3010${bond.combo}\u3011\uFF01${casters.map((c) => c.name).join("\u3001")}\u5408\u529B\u653B\u654C\uFF0C\u5171\u9020\u6210 ${total} \u4F24\u5BB3`,
      actorId: casters[0].uid,
      targetIds: ids,
      value: total,
      comboName: bond.combo,
      fx: "combo"
    });
    return;
  }
}
function runRounds(log, allies, enemies, bonds = []) {
  let rounds = 0;
  const maxRounds = 30;
  while (rounds < maxRounds) {
    rounds += 1;
    push(log, allies, enemies, { kind: "round", text: `\u2014\u2014 \u7B2C ${rounds} \u56DE\u5408 \u2014\u2014` });
    tickRegen(log, allies, enemies);
    if (rounds % 4 === 2) tickCombo(log, allies, enemies, bonds);
    const order = [
      ...alive(allies).sort((a, b) => a.haste - b.haste || a.slot - b.slot),
      ...alive(enemies).sort((a, b) => a.haste - b.haste || a.slot - b.slot)
    ];
    for (const f of order) {
      if (!f.alive || f.hp <= 0) continue;
      if (f.stun > 0) {
        f.stun -= 1;
        push(log, allies, enemies, {
          kind: "skill",
          text: `${f.name} \u88AB\u63A7\u5236\uFF0C\u65E0\u6CD5\u884C\u52A8`,
          actorId: f.uid,
          fx: "control"
        });
        continue;
      }
      const foes = f.side === "ally" ? enemies : allies;
      const friends = f.side === "ally" ? allies : enemies;
      if (!alive(foes).length) break;
      const ctx = makeCtx(f, foes, friends);
      const active = chooseSkill(f.heroId, f.breakthrough, skillCtxOf(f, allies, enemies), f.divine, f.awaken);
      const canUse = !!active && skillUsable(f, active);
      const useSkill = canUse && (rounds % 3 === 0 || Math.random() < 0.34);
      if (useSkill && active) {
        f.skillUses[active.name] = (f.skillUses[active.name] ?? 0) + 1;
        if (active.cooldown) f.cooldowns[active.name] = active.cooldown;
        const res = execSkill(active, ctx, EXEC_HOOKS);
        if (res) {
          push(log, allies, enemies, {
            kind: res.kind,
            text: res.text,
            actorId: f.uid,
            targetIds: res.targetIds,
            value: res.value,
            fx: res.fx
          });
        }
      } else {
        const t = pickTargetWithTaunt(foes);
        if (t) {
          const line = attackLine(f.heroId);
          const targets = line ? expandLine(t, foes, line) : [t];
          let total = 0;
          for (const foe of targets) {
            total += strike(f, foe, foe.uid === t.uid ? 1 : 0.62);
          }
          const drainRatio = drainRatioOf(f);
          if (drainRatio > 0 && total > 0) {
            const back = Math.round(total * drainRatio);
            mend(f, f, back);
          }
          push(log, allies, enemies, {
            kind: "hit",
            text: line ? `${f.name} ${line === "row" ? "\u6A2A\u6392" : "\u7AD6\u6392"} -${total}` : `${f.name} \u666E\u653B ${t.name} -${total}`,
            actorId: f.uid,
            targetIds: targets.map((foe) => foe.uid),
            value: total,
            fx: line === "row" ? "line-row" : line === "col" ? "line-col" : "strike"
          });
        }
      }
      if (!alive(enemies).length || !alive(allies).length) break;
    }
    tickDots(log, allies, enemies);
    tickStatus(allies, enemies);
    if (!alive(enemies).length) return { win: true, rounds };
    if (!alive(allies).length) return { win: false, rounds };
  }
  return { win: false, rounds };
}
function simulateStageBattle(team, bag, stage) {
  const waves = stage.waves?.length ? stage.waves : [stage.enemies];
  const ids = team.map((t) => t.owned.heroId);
  const mod = formationMods(ids);
  const auras = factionAuras(ids).filter((f) => f.active);
  const allies = team.map((t) => makeFighter(t.owned, bag, "ally", t.slot, mod.atk, mod.hp, mod.def));
  const log = [];
  let enemies = [];
  push(log, allies, enemies, {
    kind: "sys",
    text: `\u5F00\u6218\uFF1A${stage.name}${waves.length > 1 ? `\uFF08\u5171 ${waves.length} \u6CE2\u654C\u519B\uFF09` : ""}`
  });
  if (mod.bonds.length) {
    push(log, allies, enemies, {
      kind: "sys",
      text: `\u7F81\u7ECA\uFF1A${mod.bonds.map((b) => `${b.name} \u653B+${Math.round(b.bonusAtk * 100)}% \u751F\u547D+${Math.round(b.bonusHp * 100)}%`).join("\uFF0C")}`
    });
  }
  if (auras.length) {
    push(log, allies, enemies, {
      kind: "sys",
      text: `\u9635\u8425\uFF1A${auras.map((f) => `${FACTION_LABEL[f.faction]}\xD7${f.count} ${f.hint.split(" \xB7 ")[0]}`).join("\uFF0C")}`
    });
  }
  let totalRounds = 0;
  for (let w = 0; w < waves.length; w++) {
    const waveIn = waves[w];
    const slots = squadSlots(waveIn.length);
    enemies = waveIn.map(
      (e, i) => makeEnemy(e.heroId, e.level, e.slot ?? slots[i] ?? i, e.bt ?? 0, e.aw ?? 0, `e${w}`, e.mult ?? 1)
    );
    if (waves.length > 1) {
      push(log, allies, enemies, { kind: "sys", text: `\u2014\u2014 \u7B2C ${w + 1} \u6CE2 \xB7 ${waveIn.length} \u654C\u6740\u5230 \u2014\u2014` });
    }
    const outcome = runRounds(log, allies, enemies, mod.bonds);
    totalRounds += outcome.rounds;
    if (!outcome.win) {
      const reason = alive(allies).length ? "\u82E6\u6218\u8D85\u65F6\uFF0C\u672A\u80FD\u7834\u654C" : "\u5168\u519B\u8986\u6CA1";
      push(log, allies, enemies, {
        kind: "lose",
        text: waves.length > 1 ? `\u6218\u8D25\u2026\u2026\u6B62\u6B65\u4E8E\u7B2C ${w + 1} \u6CE2\uFF0C${reason}` : `\u6218\u8D25\u2026\u2026${reason}`
      });
      return pack(false, log, totalRounds, allies, enemies);
    }
    if (w < waves.length - 1) {
      for (const a of alive(allies)) {
        a.hp = Math.min(a.maxHp, a.hp + Math.round(a.maxHp * 0.15));
        a.burn = 0;
        a.poison = 0;
        a.stun = 0;
      }
      push(log, allies, enemies, { kind: "sys", text: `\u51FB\u6E83\u7B2C ${w + 1} \u6CE2\uFF01\u7A0D\u4E8B\u4F11\u6574\uFF0C\u4E0B\u4E00\u6CE2\u654C\u519B\u6B63\u5728\u903C\u8FD1` });
    }
  }
  push(log, allies, enemies, {
    kind: "win",
    text: waves.length > 1 ? `\u80DC\u5229\uFF01\u5386\u7ECF ${totalRounds} \u56DE\u5408\uFF0C\u8FDE\u7834 ${waves.length} \u6CE2\u654C\u519B` : `\u80DC\u5229\uFF01\u5386\u7ECF ${totalRounds} \u56DE\u5408\u626B\u6E05\u654C\u519B`
  });
  return pack(true, log, totalRounds, allies, enemies);
}

// src/data/stages.ts
var CHAPTER_SIZE = 10;
var DIFFICULTY_ORDER = ["normal", "hard", "hero", "epic"];
var DIFF_CURVE_EXP = 0.8;
function difficultyMult(diff, id, total = NAMES.length) {
  const base = DIFFICULTIES[diff].mult;
  if (base <= 1) return 1;
  const curve = Math.pow(Math.max(0, Math.min(1, id / total)), DIFF_CURVE_EXP);
  return 1 + (base - 1) * curve;
}
var DIFFICULTIES = {
  normal: {
    key: "normal",
    name: "\u666E\u901A",
    mult: 1,
    bossBt: 0,
    bossAw: 0,
    goldMult: 1,
    jadeMult: 1,
    expMult: 1,
    sealMult: 1,
    color: "#9c8b6e",
    hint: "\u6807\u51C6\u654C\u519B\u914D\u7F6E"
  },
  hard: {
    key: "hard",
    name: "\u56F0\u96BE",
    mult: 3.2,
    bossBt: 0,
    bossAw: 0,
    goldMult: 2,
    jadeMult: 2,
    expMult: 2,
    sealMult: 1.5,
    color: "#5b8ec9",
    hint: "\u654C\u519B\u5C5E\u6027\u968F\u5173\u5361\u63A8\u8FDB\u589E\u5F3A\uFF0C\u7EC8\u5173\u7EA6 \xD73.2"
  },
  hero: {
    key: "hero",
    name: "\u82F1\u96C4",
    mult: 4.2,
    bossBt: 2,
    bossAw: 1,
    goldMult: 3.5,
    jadeMult: 3,
    expMult: 3,
    sealMult: 2.5,
    color: "#b06fd0",
    hint: "\u654C\u519B\u5C5E\u6027\u968F\u5173\u5361\u63A8\u8FDB\u589E\u5F3A\uFF0C\u7EC8\u5173\u7EA6 \xD74.2\uFF0CBoss \u989D\u5916\u7A81\u7834+2"
  },
  epic: {
    key: "epic",
    name: "\u53F2\u8BD7",
    mult: 5.2,
    bossBt: 2,
    bossAw: 3,
    goldMult: 6,
    jadeMult: 5,
    expMult: 5,
    sealMult: 4,
    color: "#e0a13c",
    hint: "\u654C\u519B\u5C5E\u6027\u968F\u5173\u5361\u63A8\u8FDB\u589E\u5F3A\uFF0C\u7EC8\u5173\u7EA6 \xD75.2\uFF0C\u9700 6 \u540D\u6EE1\u7EA7\u795E\u5C06\u65B9\u80FD\u9669\u80DC"
  }
};
var enemyPool = [
  "dianwei",
  "huangzhong",
  "taishici",
  "xiaoqiao",
  "huatuo",
  "ganning",
  "huangyueying",
  "xiahoudun",
  "luxun",
  "machao",
  "guojia",
  "diaochan",
  "sunquan",
  "zhangfei",
  "liubei",
  "caocao",
  "zhouyu",
  "guanyu",
  "zhaoyun",
  "lvbu",
  "zhangliao",
  "sunce",
  "pangtong",
  "xuchu",
  "lvmeng",
  "zhangjiao",
  "huanggai",
  "guanping",
  "weiyan",
  "fazheng",
  "xiahouyuan",
  "xunyu",
  "caoren",
  "zhoutai",
  "lusu",
  "lingtong",
  "lukang",
  "sunshangxiang",
  "dongzhuo",
  "jiaxu",
  "huaxiong",
  "yanliang",
  "caiwenji"
];
var EARLY_COUNTS = [1, 2, 3, 2, 4, 1, 5, 3, 6, 4, 2, 5, 6, 3, 4, 5, 1, 6, 4, 5];
var NAMES = [
  "\u9EC4\u5DFE\u521D\u8D77",
  "\u6C5C\u6C34\u5173\u524D",
  "\u864E\u7262\u4E89\u950B",
  "\u706B\u70E7\u6D1B\u9633",
  "\u5F90\u5DDE\u98CE\u4E91",
  "\u5C0F\u6C9B\u591C\u88AD",
  "\u767D\u95E8\u697C\u5F71",
  "\u5B98\u6E21\u5BF9\u5CD9",
  "\u706B\u70E7\u4E4C\u5DE2",
  "\u4E09\u8BA9\u5F90\u5DDE",
  "\u65B0\u91CE\u5C6F\u5175",
  "\u535A\u671B\u5761\u706B",
  "\u957F\u5742\u5761\u8840",
  "\u5F53\u9633\u6865\u543C",
  "\u8D64\u58C1\u4E1C\u98CE",
  "\u534E\u5BB9\u5C0F\u5F84",
  "\u53D6\u897F\u5DDD\u9053",
  "\u5B9A\u519B\u5C71\u5C16",
  "\u8346\u5DDE\u98CE\u96E8",
  "\u5937\u9675\u4F59\u70EC",
  "\u5357\u5F81\u6E21\u6CF8",
  "\u94F6\u5751\u63A2\u6D1E",
  "\u76D8\u86C7\u8C37\u96FE",
  "\u4E03\u64D2\u5B5F\u83B7",
  "\u5357\u4E2D\u5F52\u5FC3",
  "\u5929\u6C34\u57CE\u4E0B",
  "\u5180\u57CE\u591C\u8C08",
  "\u6536\u59DC\u7EF4",
  "\u7941\u5C71\u521D\u9635",
  "\u4E00\u51FA\u7941\u5C71",
  "\u6FE1\u987B\u591C\u822A",
  "\u767E\u9A91\u52AB\u8425",
  "\u6C5F\u4E0A\u89C2\u654C",
  "\u65B0\u57CE\u5BF9\u5CD9",
  "\u5B59\u6743\u9000\u5175",
  "\u9633\u5E73\u5173\u524D",
  "\u8D70\u9A6C\u5CAD",
  "\u6C49\u6C34\u4E89\u7CAE",
  "\u9EC4\u5FE0\u8BF7\u7F28",
  "\u6C49\u4E2D\u79F0\u738B",
  "\u8944\u6A0A\u5BF9\u5CD9",
  "\u6C34\u6DF9\u4E03\u519B",
  "\u4E8E\u7981\u8BF7\u964D",
  "\u5173\u5E73\u9A70\u63F4",
  "\u5F90\u6643\u7834\u56F4",
  "\u767D\u8863\u6E21\u6C5F",
  "\u516C\u5B89\u5931\u5B88",
  "\u4E34\u6CAE\u57CB\u4F0F",
  "\u9EA6\u57CE\u591C\u96E8",
  "\u7389\u6CC9\u949F\u58F0",
  "\u4E8C\u51FA\u7941\u5C71",
  "\u9A6C\u8C21\u8BF7\u4EE4",
  "\u738B\u5E73\u82E6\u8C0F",
  "\u8857\u4EAD\u5D29\u76D8",
  "\u6325\u6CEA\u65A9\u8C21",
  "\u4E0A\u65B9\u8C37\u706B",
  "\u6597\u9635\u4E2D\u539F",
  "\u4E94\u4E08\u539F\u79CB",
  "\u661F\u843D\u4E2D\u519B",
  "\u6728\u50CF\u9000\u5175",
  "\u6C93\u4E2D\u5C6F\u7530",
  "\u59DC\u7EF4\u590D\u51FA",
  "\u5251\u9601\u94C1\u95E8",
  "\u9634\u5E73\u9669\u9053",
  "\u7EF5\u7AF9\u8840\u6218",
  "\u6F7C\u5173\u5217\u9635",
  "\u897F\u51C9\u94C1\u9A91",
  "\u5272\u987B\u5F03\u888D",
  "\u8BB8\u891A\u88F8\u8863",
  "\u9A6C\u8D85\u5F52\u5218",
  "\u5B9B\u57CE\u591C\u5BB4",
  "\u5178\u97E6\u65AD\u540E",
  "\u6076\u6765\u6B89\u4E3B",
  "\u66F9\u64CD\u7A81\u56F4",
  "\u6E05\u6C34\u56DE\u8425",
  "\u6FEE\u9633\u706B\u57CE",
  "\u5415\u5E03\u8BBE\u4F0F",
  "\u706B\u4E2D\u66F9\u7792",
  "\u9648\u5BAB\u732E\u8BA1",
  "\u6FEE\u9633\u9000\u5175",
  "\u9648\u4ED3\u7B51\u57CE",
  "\u90DD\u662D\u5B88\u95E8",
  "\u4E91\u68AF\u653B\u57CE",
  "\u706B\u7BAD\u9000\u654C",
  "\u4E45\u653B\u4E0D\u4E0B",
  "\u9647\u53F3\u8FDE\u8425",
  "\u59DC\u7EF4\u4E5D\u4F10",
  "\u94C1\u7B3C\u5C71\u56F4",
  "\u53F8\u9A6C\u8FFD\u51FB",
  "\u5175\u9000\u6C49\u4E2D",
  "\u5BFF\u6625\u4E3E\u5175",
  "\u6DEE\u5357\u4E09\u53DB",
  "\u738B\u51CC\u5175\u53D8",
  "\u53F8\u9A6C\u5E73\u53DB",
  "\u6DEE\u5357\u5C18\u5B9A",
  "\u9AD8\u5E73\u9675\u53D8",
  "\u53F8\u9A6C\u4EE3\u9B4F",
  "\u664B\u9633\u53F7\u4EE4",
  "\u4E09\u5206\u5C06\u5C3D",
  "\u6D1B\u9633\u5F52\u5FC3",
  "\u4E1C\u5174\u96EA\u6218",
  "\u77F3\u4EAD\u8BBE\u4F0F",
  "\u5408\u80A5\u65B0\u57CE",
  "\u8BF8\u845B\u606A\u4F10\u9B4F",
  "\u4E1C\u5174\u51EF\u65CB",
  "\u4E50\u5609\u70FD\u70DF",
  "\u6BCC\u4E18\u4FED\u4E3E\u5175",
  "\u9879\u53BF\u56FA\u5B88",
  "\u4E50\u5609\u7834\u9635",
  "\u6DEE\u5357\u4E8C\u53DB",
  "\u8BF8\u845B\u8BDE\u5B88\u5BFF\u6625",
  "\u5BFF\u6625\u56F4\u4E09\u531D",
  "\u80E1\u594B\u7834\u57CE",
  "\u6DEE\u5357\u4E09\u53DB\u5E73",
  "\u53F8\u9A6C\u662D\u4E13\u6743",
  "\u6D2E\u897F\u5927\u6377",
  "\u72C4\u9053\u89E3\u56F4",
  "\u8944\u6B66\u4E89\u593A",
  "\u6BB5\u8C37\u4E4B\u8D25",
  "\u59DC\u7EF4\u9000\u6C93\u4E2D",
  "\u957F\u57CE\u93D6\u5175",
  "\u8292\u6C34\u5BF9\u5CD9",
  "\u4FAF\u548C\u53D7\u632B",
  "\u6C93\u4E2D\u907F\u7978",
  "\u9634\u5E73\u6865\u5934",
  "\u9093\u827E\u51FF\u9669",
  "\u6469\u5929\u5CAD\u4E0B",
  "\u6C5F\u6CB9\u5173\u7834",
  "\u6DAA\u57CE\u8FCE\u654C",
  "\u7EF5\u7AF9\u51B3\u6218",
  "\u8BF8\u845B\u77BB\u6B89\u56FD",
  "\u96D2\u57CE\u6700\u540E\u4E00\u6218",
  "\u6210\u90FD\u51FA\u964D",
  "\u949F\u4F1A\u5165\u8700",
  "\u59DC\u7EF4\u5BC6\u8C0B",
  "\u6210\u90FD\u5175\u53D8",
  "\u949F\u9093\u4E89\u529F",
  "\u8700\u5730\u5C18\u57C3",
  "\u6C38\u5B89\u5B64\u57CE",
  "\u7F57\u5BAA\u5B88\u5B64",
  "\u897F\u9675\u9A70\u63F4",
  "\u6B65\u9610\u636E\u57CE",
  "\u9646\u6297\u7834\u56F4",
  "\u897F\u9675\u51EF\u6B4C",
  "\u4EA4\u8DBE\u53DB\u4E71",
  "\u9676\u749C\u5E73\u4EA4",
  "\u4E5D\u771F\u5F52\u9644",
  "\u65E5\u5357\u626C\u5C18",
  "\u5357\u670D\u521D\u5B9A",
  "\u51C9\u5DDE\u70FD\u8D77",
  "\u79C3\u53D1\u6811\u673A\u80FD",
  "\u6B66\u5A01\u93D6\u6218",
  "\u9A6C\u9686\u897F\u5F81",
  "\u51C9\u5DDE\u5E95\u5B9A",
  "\u592A\u5EB7\u8087\u57FA",
  "\u6D1B\u9633\u53D7\u7985",
  "\u4E09\u8DEF\u4F10\u5434",
  "\u738B\u6FEC\u697C\u8239",
  "\u76CA\u5DDE\u6C34\u5E08",
  "\u6C5F\u9675\u4E1C\u4E0B",
  "\u590F\u53E3\u7A81\u7834",
  "\u4E09\u5C71\u77F6\u706B",
  "\u5EFA\u4E1A\u738B\u6C14",
  "\u77F3\u5934\u57CE\u964D\u5E61",
  "\u5B59\u7693\u51FA\u964D",
  "\u91D1\u9675\u738B\u6C14\u6536",
  "\u5929\u4E0B\u4E00\u7EDF",
  "\u534E\u6797\u56ED\u5BB4",
  "\u592A\u5EB7\u76DB\u4E16",
  "\u65E7\u5C06\u5F52\u7530",
  "\u94C1\u9A91\u89E3\u7532",
  "\u6C5F\u5C71\u5165\u753B\u56FE",
  "\u94DC\u96C0\u6625\u6DF1",
  "\u90BA\u4E0B\u6587\u4EBA\u96C6",
  "\u6D1B\u795E\u8D4B\u5F71",
  "\u91D1\u8C37\u56ED\u5BB4",
  "\u77F3\u5D07\u6597\u5BCC",
  "\u7EFF\u73E0\u5760\u697C",
  "\u516B\u738B\u6697\u6D8C",
  "\u8D75\u738B\u79C9\u653F",
  "\u9F50\u738B\u4E3E\u4E49",
  "\u957F\u6C99\u738B\u5B88\u6D1B",
  "\u6210\u90FD\u738B\u9547\u90BA",
  "\u6CB3\u95F4\u738B\u636E\u5173",
  "\u4E1C\u6D77\u738B\u6536\u573A",
  "\u4E94\u80E1\u4E91\u52A8",
  "\u5308\u5974\u8D77\u5DE6\u56FD",
  "\u7FAF\u9F13\u9707\u5E76\u5DDE",
  "\u9C9C\u5351\u5357\u4E0B",
  "\u6C10\u7F8C\u5165\u5DDD",
  "\u6D41\u6C11\u8D77\u4E49",
  "\u6D1B\u9633\u9677\u843D",
  "\u6C38\u5609\u4E4B\u4E71",
  "\u8863\u51A0\u5357\u6E21",
  "\u5EFA\u5EB7\u65B0\u7ACB",
  "\u738B\u5BFC\u8F85\u653F",
  "\u738B\u6566\u8DCB\u6248",
  "\u82CF\u5CFB\u4E4B\u4E71",
  "\u5EBE\u4EAE\u51FA\u9547",
  "\u6C5F\u4E1C\u518D\u9020"
];
function squadCount(id) {
  if (id <= EARLY_COUNTS.length) return EARLY_COUNTS[id - 1];
  if (id % CHAPTER_SIZE === 0) return 6;
  if (id % CHAPTER_SIZE === 5) return 5;
  const wave = [3, 4, 3, 5, 4, 4, 5, 4];
  return wave[(id - 21) % wave.length];
}
function mobCount(id, waveIdx) {
  return waveIdx === 0 ? 2 + id % 2 : 3 + (id + 1) % 2;
}
function waveEnemies(id, waveIdx, count, level) {
  const slots = squadSlots(count);
  const idx = id - 1;
  return slots.map((slot, i) => ({
    heroId: enemyPool[(idx * 3 + waveIdx * 7 + i * 2) % enemyPool.length],
    level: Math.max(1, level + (slot === 1 && waveIdx === 2 ? 1 : 0)),
    slot
  }));
}
function makeStage(id, diff = "normal") {
  const chapter = Math.ceil(id / CHAPTER_SIZE);
  const idx = id - 1;
  const pos = (id - 1) % CHAPTER_SIZE;
  const bossStage = pos === 4 || pos === 9;
  const base = 1 + Math.floor(id * 1.2);
  const bossCount = squadCount(id);
  const bossLevel = squadLevel(base, bossCount);
  const w1Count = mobCount(id, 0);
  const w2Count = mobCount(id, 1);
  const w1Level = squadLevel(Math.max(1, base - 2), w1Count);
  const w2Level = squadLevel(Math.max(1, base - 1), w2Count);
  const meta = DIFFICULTIES[diff];
  const rawWaves = [
    waveEnemies(id, 0, w1Count, w1Level),
    waveEnemies(id, 1, w2Count, w2Level),
    waveEnemies(id, 2, bossCount, bossLevel)
  ];
  const mult = difficultyMult(diff, id);
  const curve = meta.mult <= 1 ? 0 : Math.pow(Math.max(0, Math.min(1, id / NAMES.length)), DIFF_CURVE_EXP);
  const bossBt = Math.round(meta.bossBt * curve);
  const bossAw = Math.round(meta.bossAw * curve);
  const waves = rawWaves.map((w, wi) => {
    const isBossWave = wi === rawWaves.length - 1;
    return w.map((e) => ({
      ...e,
      mult,
      bt: isBossWave && bossBt ? Math.min(5, enemyBreakthrough(e.level) + bossBt) : void 0,
      aw: isBossWave ? bossAw || void 0 : void 0
    }));
  });
  const enemies = waves[2];
  const raw = waves.flat().reduce((sum, e) => sum + 80 + e.level * 36, 0);
  const power = Math.round((id <= 20 ? raw : Math.round(raw * (1 + (id - 20) * 0.015))) * mult);
  return {
    id,
    chapter,
    name: NAMES[idx] ?? `\u7B2C${id}\u5173`,
    power,
    enemies,
    waves,
    boss: bossStage,
    rewardGold: Math.round((80 + id * 25) * meta.goldMult),
    rewardJade: Math.round((id % 5 === 0 ? 20 : 5) * meta.jadeMult),
    rewardExp: Math.round((30 + id * 8) * meta.expMult)
  };
}
var STAGES = Array.from({ length: NAMES.length }, (_, i) => makeStage(i + 1));
var STAGES_BY_DIFF = {
  normal: STAGES,
  hard: Array.from({ length: NAMES.length }, (_, i) => makeStage(i + 1, "hard")),
  hero: Array.from({ length: NAMES.length }, (_, i) => makeStage(i + 1, "hero")),
  epic: Array.from({ length: NAMES.length }, (_, i) => makeStage(i + 1, "epic"))
};
function stageFor(id, diff = "normal") {
  return STAGES_BY_DIFF[diff]?.[id - 1];
}
var CHAPTER_META = [
  { city: "\u6D1B\u9633", name: "\u9EC4\u5DFE\u4E4B\u4E71" },
  { city: "\u5B98\u6E21", name: "\u4E2D\u539F\u4E89\u9738" },
  { city: "\u8346\u5DDE", name: "\u5357\u4E0B\u8054\u5434" },
  { city: "\u5937\u9675", name: "\u4E09\u5206\u5929\u4E0B" },
  { city: "\u5357\u4E2D", name: "\u4E03\u64D2\u5B5F\u83B7" },
  { city: "\u5929\u6C34", name: "\u6536\u59DC\u7EF4" },
  { city: "\u6FE1\u987B", name: "\u6C5F\u4E1C\u6C34\u5BE8" },
  { city: "\u6C49\u4E2D", name: "\u6C49\u4E2D\u79F0\u738B" },
  { city: "\u6A0A\u57CE", name: "\u6C34\u6DF9\u4E03\u519B" },
  { city: "\u9EA6\u57CE", name: "\u8D25\u8D70\u9EA6\u57CE" },
  { city: "\u8857\u4EAD", name: "\u8857\u4EAD\u4E4B\u5931" },
  { city: "\u4E94\u4E08\u539F", name: "\u661F\u843D\u79CB\u98CE" },
  { city: "\u5251\u9601", name: "\u9634\u5E73\u5947\u88AD" },
  { city: "\u6F7C\u5173", name: "\u897F\u51C9\u94C1\u9A91" },
  { city: "\u5B9B\u57CE", name: "\u6076\u6765\u6B89\u4E3B" },
  { city: "\u6FEE\u9633", name: "\u706B\u70E7\u6FEE\u9633" },
  { city: "\u9648\u4ED3", name: "\u90DD\u662D\u5B88\u57CE" },
  { city: "\u9647\u53F3", name: "\u4E5D\u4F10\u4E2D\u539F" },
  { city: "\u5BFF\u6625", name: "\u6DEE\u5357\u98CE\u4E91" },
  { city: "\u664B\u9633", name: "\u5929\u4E0B\u5F52\u5FC3" }
];
var CHAPTERS = CHAPTER_META.map(
  (meta, i) => {
    const row = Math.floor(i / 5);
    const col = i % 5;
    const ccol = row % 2 ? 4 - col : col;
    const xs = [12, 30, 48, 66, 84];
    const ys = [16, 38, 60, 82];
    return { id: i + 1, city: meta.city, name: meta.name, x: xs[ccol], y: ys[row] };
  }
);

// scripts/calib-difficulty.ts
var HEROES2 = ["guanyu", "zhaoyun", "lvbu", "zhangfei", "huangzhong", "dianwei"];
var EXCLUSIVE_WEAPON = {
  guanyu: "blade_orange",
  zhaoyun: "yun_spear",
  lvbu: "sky_halberd",
  zhangfei: "snake_spear",
  huangzhong: "sunset_bow",
  dianwei: "iron_ji"
};
function makeBag() {
  const bag = [];
  const push2 = (id) => {
    const uid = `e_${id}`;
    if (!bag.find((e) => e.uid === uid)) bag.push({ uid, equipId: id, level: 100, forge: 8 });
    return uid;
  };
  for (const h of Object.values(EXCLUSIVE_WEAPON)) push2(h);
  for (const id of ["armor_ssr", "helm_ssr", "boot_ssr", "ring_ssr", "book_ssr"]) push2(id);
  return bag;
}
var BAG = makeBag();
function hero(heroId, divine, level = 120, gear = true, aw = 5) {
  const g = gear ? {
    weapon: `e_${EXCLUSIVE_WEAPON[heroId] ?? "blade_orange"}`,
    armor: "e_armor_ssr",
    helm: "e_helm_ssr",
    boots: "e_boot_ssr",
    accessory: "e_ring_ssr",
    treasure: "e_book_ssr"
  } : {};
  return { uid: `h_${heroId}_${divine ? "d" : "m"}`, heroId, level, shards: 0, breakthrough: 5, awaken: aw, exp: 0, gear: g, divine };
}
var TEAMS = [
  ["6\u6EE1\u914D\u795E\u5C06", HEROES2.map((h, i) => ({ owned: hero(h, true), slot: i }))],
  ["5\u6EE1\u914D\u795E\u5C06", HEROES2.slice(0, 5).map((h, i) => ({ owned: hero(h, true), slot: i }))],
  ["6\u6EE1\u914D\u51E1\u4EBA", HEROES2.map((h, i) => ({ owned: hero(h, false), slot: i }))],
  ["5\u6EE1\u914D\u51E1\u4EBA", HEROES2.slice(0, 5).map((h, i) => ({ owned: hero(h, false), slot: i }))],
  ["\u795E\u5C06\u88F8\u88C5", HEROES2.map((h, i) => ({ owned: hero(h, true, 120, false), slot: i }))],
  ["\u795E\u5C06\u672A\u89C9\u9192", HEROES2.map((h, i) => ({ owned: hero(h, true, 120, true, 0), slot: i }))]
];
function rate(team, stageId, diff, runs = 20) {
  const stage = stageFor(stageId, diff);
  let w = 0;
  let a = 0;
  for (let i = 0; i < runs; i++) {
    const res = simulateStageBattle(team, BAG, stage);
    if (res.win) w++;
    a += res.allies.filter((f) => f.alive).length;
  }
  return { r: w / runs, a: a / runs };
}
var failed = 0;
var check = (ok, label) => {
  if (!ok) failed++;
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${label}`);
};
console.log("=== 1) \u53F2\u8BD7\u7B2C 200 \u5173\u95E8\u69DB\uFF08\u9700\u6C42\uFF1A6 \u6EE1\u7EA7\u795E\u5C06\u624D\u80FD\u6253\u8FC7\uFF09===");
var e200 = TEAMS.map(([n, t]) => {
  const v = rate(t, 200, "epic");
  return `${n.padEnd(12)} ${(v.r * 100).toFixed(0)}% \u80DC / \u5B58\u6D3B ${v.a.toFixed(1)}`;
});
e200.forEach((l) => console.log("  " + l));
var g6 = rate(TEAMS[0][1], 200, "epic");
var g5 = rate(TEAMS[1][1], 200, "epic");
var m6 = rate(TEAMS[2][1], 200, "epic");
var m5 = rate(TEAMS[3][1], 200, "epic");
var bare = rate(TEAMS[4][1], 200, "epic");
var noAw = rate(TEAMS[5][1], 200, "epic");
check(g6.r >= 0.7, `6 \u6EE1\u914D\u795E\u5C06\u80FD\u9669\u80DC\uFF08\u80DC\u7387 ${(g6.r * 100).toFixed(0)}% \u2265 70%\uFF09`);
check(g5.r <= 0.3, `5 \u795E\u5C06\u57FA\u672C\u6253\u4E0D\u8FC7\uFF08\u80DC\u7387 ${(g5.r * 100).toFixed(0)}% \u2264 30%\uFF09`);
check(g6.r - m6.r >= 0.3, `\u795E\u5C06\u660E\u663E\u5F3A\u4E8E\u51E1\u4EBA\uFF08${(g6.r * 100).toFixed(0)}% vs ${(m6.r * 100).toFixed(0)}%\uFF0C\u5DEE\u8DDD \u2265 30 \u4E2A\u767E\u5206\u70B9\uFF09`);
check(m5.r === 0, `5 \u51E1\u4EBA\u5B8C\u5168\u6253\u4E0D\u8FC7\uFF08\u80DC\u7387 ${(m5.r * 100).toFixed(0)}%\uFF09`);
check(bare.r === 0, `\u795E\u5C06\u65E0\u88C5\u5907\u6253\u4E0D\u8FC7\uFF08\u80DC\u7387 ${(bare.r * 100).toFixed(0)}%\uFF09`);
check(noAw.r === 0, `\u795E\u5C06\u672A\u89C9\u9192\u6253\u4E0D\u8FC7\uFF08\u80DC\u7387 ${(noAw.r * 100).toFixed(0)}%\uFF09`);
console.log("\n=== 2) \u7B2C 200 \u5173\u96BE\u5EA6\u9636\u68AF\uFF086 \u6EE1\u914D\u795E\u5C06 / 6 \u6EE1\u914D\u51E1\u4EBA\uFF09===");
for (const d of DIFFICULTY_ORDER) {
  const a = rate(TEAMS[0][1], 200, d);
  const b = rate(TEAMS[2][1], 200, d);
  console.log(
    `  ${DIFFICULTIES[d].name.padEnd(4)} 6\u795E\u5C06 ${(a.r * 100).toFixed(0)}%/${a.a.toFixed(1)}\u6D3B   6\u51E1\u4EBA ${(b.r * 100).toFixed(0)}%/${b.a.toFixed(1)}\u6D3B`
  );
}
var ladder = DIFFICULTY_ORDER.map((d) => rate(TEAMS[0][1], 200, d).r);
check(
  ladder.every((v, i) => i === 0 || v <= ladder[i - 1] + 1e-3),
  "\u540C\u5173\u5361\u4E0B\u96BE\u5EA6\u8D8A\u9AD8\u3001\u6EE1\u914D\u795E\u5C06\u80DC\u7387\u8D8A\u4F4E\uFF08\u9636\u68AF\u6210\u7ACB\uFF09"
);
console.log("\n=== 3) \u666E\u901A\u6863\u56DE\u5F52\uFF08\u4E0E\u6539\u52A8\u524D\u4E00\u81F4\uFF09===");
var normOk = true;
for (const id of [1, 7, 50, 123, 200]) {
  const st = stageFor(id, "normal");
  const expGold = 80 + id * 25;
  const expJade = id % 5 === 0 ? 20 : 5;
  const expExp = 30 + id * 8;
  const multOk = st.waves.every((w) => w.every((e) => (e.mult ?? 1) === 1));
  const goldOk = st.rewardGold === expGold;
  const jadeOk = st.rewardJade === expJade;
  const expOk = st.rewardExp === expExp;
  if (!(multOk && goldOk && jadeOk && expOk)) normOk = false;
  console.log(
    `  #${id} \u500D\u7387${multOk ? "=1" : "\u22601"} \u94F6\u4E24${st.rewardGold}(\u671F\u671B${expGold}) \u5143\u5B9D${st.rewardJade}(\u671F\u671B${expJade}) \u7ECF\u9A8C${st.rewardExp}(\u671F\u671B${expExp})`
  );
}
check(normOk, "\u666E\u901A\u6863\u5C5E\u6027\u500D\u7387\u4E0E\u5956\u52B1\u5B8C\u5168\u672A\u53D8");
console.log("\n=== 4) \u524D\u671F\u5173\u5361\u5404\u96BE\u5EA6\u500D\u7387\uFF08\u89E3\u9501\u94FE\u4E0D\u4F1A\u5361\u6B7B\uFF09===");
for (const id of [1, 5, 10, 30, 60, 100, 150, 200]) {
  const row = DIFFICULTY_ORDER.map((d) => {
    const st = stageFor(id, d);
    return `${DIFFICULTIES[d].name}\xD7${(st.waves[0][0]?.mult ?? 1).toFixed(2)}`;
  });
  console.log(`  #${String(id).padStart(3)}  ${row.join("  ")}`);
}
var curveOk = true;
for (const id of [1, 5, 10, 30, 60, 100, 150, 200]) {
  const hard = stageFor(id, "hard");
  const norm = stageFor(id, "normal");
  if ((hard.waves[0][0]?.mult ?? 1) < (norm.waves[0][0]?.mult ?? 1)) curveOk = false;
}
check(curveOk, "\u5404\u96BE\u5EA6\u500D\u7387\u5355\u8C03\u4E0D\u964D\u4E8E\u666E\u901A\u6863");
console.log(`
${failed === 0 ? "\u5168\u90E8\u901A\u8FC7" : failed + " \u9879\u672A\u901A\u8FC7"}`);
if (failed > 0) process.exit(1);
