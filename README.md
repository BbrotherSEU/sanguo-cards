# 少年三国志 · 卡牌征程

粉丝向自制三国卡牌 Web 游戏（非官方）。

## 排期功能

| 优先级 | 模块 | 状态 |
|--------|------|------|
| P1 | 武将立绘（程序化 SVG） | ✅ |
| P1 | 战斗演出（回合回放 / 血条 / 必杀特效） | ✅ |
| P2 | 突破 + 觉醒 | ✅ |
| P2 | 装备穿戴 / 强化 / 掉落 | ✅ |
| P3 | 竞技场 | ✅ |
| 下一轮 | 精细立绘 / 合击动画 / 每日商店 | ✅ |

## 手游化美术改造

已完成整轮视觉重构，方案与进度见 **[ART_PLAN.md](./ART_PLAN.md)**。

核心做法：`src/ui/theme.css` 作为覆盖层（不改原样式，避免回归），统一设计令牌与通用组件
（面板 / 按钮 / 卡片 / 品质框 / 标签 / 导航 / Toast），再逐屏叠加光效与演出。

### 美术走查

```bash
node scripts/shot.mjs .shots          # 全部 8 屏
node scripts/shot.mjs .shots home     # 单屏
```

产物：`.shots/*.png`（截图）与 `.shots/report.json`（节点数 / 溢出 / 越界元素）。

## 运行

```bash
npm install
npm run dev
```

默认地址：http://127.0.0.1:5174

## 在手机上玩

游戏是纯前端 + 一个极简存档 API（`server/accounts.ts` 挂在 Vite 中间件上），所以只要把服务暴露到局域网，手机连同一个 WiFi 就能玩。

### 方式一：局域网直连（最快，推荐）

```bash
npm run dev:lan          # 开发模式，体积小、启动快
# 或
npm run build && npm run preview:lan   # 生产构建
```

终端会打印 `Network: http://<你的电脑IP>:端口/`，例如 `http://192.168.31.151:4174/`。

手机浏览器直接打开这个地址即可。

> 注意：电脑和手机要在同一 WiFi；如果打不开，多半是 Windows 防火墙拦了端口，允许一下即可。
> 想让手机用流量也能连，就把 `preview:lan` 换成内网穿透（ngrok / cloudflared 等），把隧道地址发给手机。

### 方式二：加到手机主屏

用手机浏览器打开后：

- **iOS Safari**：分享 → 添加到主屏幕
- **Android Chrome**：菜单 → 添加到主屏幕

会以全屏方式启动（已配好 `viewport-fit=cover` / `theme-color` / `apple-mobile-web-app-capable`）。

### 横屏专属

**本游戏为横屏专属。** 手机竖屏打开时会显示"请横屏游玩"的全屏提示，遮住不可用的竖屏布局。

- 横屏适配在 `src/ui/theme.css` 的 `@media (orientation: landscape) and (max-height: 560px)` 断点：吃掉 16:9 黑边、压缩顶栏与侧边导航、布阵页改为左舞台 + 右详情/援军两栏。
- 竖屏遮罩逻辑在 `src/game/orientation.ts`，同时会尝试用 Screen Orientation API 锁定横屏（Android 与已装到主屏的 PWA 生效；iOS Safari 不支持该 API，靠提示遮罩兜底）。
- 桌面浏览器不受影响，仍按 16:9 letterbox 自适应。

### 存档

账号密码存在服务端的 `data/accounts.json`，同一账号在手机和电脑上进度互通（不是 localStorage 独立副本）。换设备用同一个账号登录即可。

## 玩法循环

1. **招募**抽将（重复变碎片）
2. **武将**详情里升级 / 突破 / 觉醒，看立绘
3. **装备**穿戴强化
4. **布阵**凑缘分
5. **征战**推图拿材料与装备
6. **竞技**消耗次数打机器人赚积分
