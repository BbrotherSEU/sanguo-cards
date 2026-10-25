# Spec：装备弹层虚化背景 / 布阵界面修复 / 征战三难度

日期：2026-10-25。三项任务均来自用户原话，根因已全部定位，本 spec 为最终实现依据。

## 任务 1：装备弹层保留人物界面虚化背景

### 现状与根因
- `gearPop` 挂载在 `.dossier-stage` **内部**（render.ts:811），`.gear-pop` 为 `position:absolute; inset:0`（style.css:6448），只遮住立绘区，右侧属性栏不受影响；`backdrop-filter: blur(2px)` 太弱，视觉上人物界面像被弹层"换掉"。

### 改动
1. render.ts heroDetailView：把 `${gearPop}` 从 `.dossier-stage` 内移到 `</section>`（`.hero-page.dossier`）之前，使遮罩覆盖整个人物页。
2. style.css：
   - `.hero-page.dossier { position: relative }`（确保 absolute 定位上下文）。
   - `.gear-pop`：`background: rgba(12,6,4,0.38)`、`backdrop-filter: blur(6px) saturate(0.85)`、`z-index` 保持高于侧栏。
3. 升级/锻造点击后 `gearPick` 保留、弹层随重绘刷新（现状已满足，不动）。

### 验证
- 武将详情页点任意装备位 → 弹层出现，整个人物页（立绘+侧栏）作为虚化背景可见；点遮罩/× 关闭；连续点升级弹层不关闭、数值刷新。

## 任务 2：布阵界面四项修复

### 现状与根因
| 问题 | 根因 |
|---|---|
| 不能拖拽换位 | `bindTeamDrag` 守卫 `root.querySelector('.form-board')`（render.ts:1595）——当前布局已无该元素，函数直接 return；1612/1635 行的 `drag-live` 也挂在旧类名上 |
| 过滤不生效 | 过滤器 handler 查询 `.pick-grid [data-faction]`（render.ts:1997），bench 实际容器是 `.bench-strip`；且 `.hero-card{display:grid}`（style.css:663）覆盖 UA `[hidden]` 规则，bench 缺少 `.bench-strip .hero-card[hidden]{display:none}` 兜底（只有 `.pick-grid` 有，style.css:1285） |
| 待上阵展示不全 | `.panel.form-v2-bench{max-height:190px}`（style.css:7286）+ `.bench-strip` 单行 `overflow-x:auto`（7300-7308），只能横滑看几个 |
| 上阵/下阵体感差 | `data-pick` 点击在队满时硬编码写入 slot 4 顶人（render.ts:2088-2089）；点槽位 `store.go('team')` 全量重绘丢失 `.bench-strip` 滚动位置（render() 只保留 `.main` scrollTop，render.ts:137-164） |

### 改动

**A. 竖排 3×2（style.css + render.ts）**

战斗回放中我方在左、前排靠右迎敌（battlePlay.ts:169-174），布阵舞台与之一致：
- 舞台 `.form-v2-stage` 改为 **CSS Grid**：`grid-template-columns: 150px 200px`（左列=后排，右列=前排）、`grid-template-rows: repeat(3, minmax(0,1fr))`、`justify-content/justify-items: center`。
  - 采用网格而非百分比绝对定位：舞台可用高度仅 ~296px，`top:12%/40%/68%` 的绝对定位会让三行矩形互相重叠（slot0 246–378 与 slot1 306–420 重叠 72px），后渲染的槽位覆盖前者，`elementFromPoint` 命中错位导致拖拽换位"看起来没反应"。网格排布从根本上保证槽位互不重叠。
  - `.slot-v2.back` → `grid-column: 1`、`.slot-v2.front` → `grid-column: 2`；`col-0/1/2` 重解释为纵向行号 → `grid-row: 1/2/3`。
- 槽位结构改为 flex 竖排（render.ts）：`.slot-v2` > `.slot-v2-fig`（立绘，flex:1）+ `.slot-v2-tag`（名字/缘分，浮在立绘脚下）。空槽用 `.slot-v2-blank` 承载虚线框。
- 立绘 `object-fit: contain; max-height: 100%`；后排立绘 `max-height: 76%` 形成前后大小差。
- 名字标签移到立绘脚下（原来是浮在头顶，竖排 3 行时头部标签会互相压叠）。

**B. 拖拽修复（render.ts）**
- `bindTeamDrag` 三处 `.form-board` → `.form-v2-stage`（1595/1612/1635）。
- style.css 补 `.form-v2-stage.drag-live .slot-v2 { border-color: rgba(232,197,106,.55) }`（沿用旧语义）。
- 触屏可用：`.slot-v2 { touch-action:none; user-select:none }`；`.bench-strip .hero-card { touch-action:pan-y }`（保留纵向滚动，220ms 长按后进入拖拽，浏览器接管滚动会触发 pointercancel 走 onUp 清理）。
- 新增下阵手势：slot 拖出落到 `.bench-strip` 上 → `store.setTeamSlot(from, null)`（onUp 中 `from!==null && !slotEl` 时判 `document.elementFromPoint(...).closest('.bench-strip')`）。

**C. 上阵/下阵体感（render.ts `data-pick` click，2081-2092）**
- 该武将已在阵上 → 下阵（`setTeamSlot(现有槽, null)`）。
- 未上阵 + 有选中槽 → 放入选中槽（setTeamSlot 已处理同人换槽）。
- 未上阵 + 无选中槽 → 第一个空槽；无空槽 → `store.toast='阵容已满，请先点选要替换的阵位'; store.redraw()`。
- 槽位点击：再次点击已选中槽 → 取消选中（`selectedSlot=null`），其余照旧选中。

**D. 滚动位置保留（render.ts render() keep/restore 块，137-164）**
- keep 增加 `benchLeft = root.querySelector('.bench-strip')?.scrollLeft ?? 0`；同屏重绘后恢复 `.bench-strip` 的 scrollLeft（仿照 mainTop 现有写法）。

**E. bench 展示 + 过滤修复**
- style.css：`.panel.form-v2-bench` 去 `max-height`、加 `min-height:0`；`.shell.screen-team .main` 行高改为 `minmax(0,1fr) 206px`（舞台优先，待上阵区固定高度内换行滚动）；`.bench-strip` 改 `flex-wrap:wrap; overflow-y:auto; overflow-x:hidden; align-content:flex-start`。
- style.css 补 `.bench-strip .hero-card[hidden]{display:none}`（兜底 `display:grid` 覆盖 UA `[hidden]`）。
- style.css：`.bench-strip .hero-card` 补 `min-height:92px`（原 `.hero-card{min-height:210px}` 会把卡撑到 210px 却被 88px 卡框裁切，是"展示不全"的直接原因），并让 `.art` 取消 3:4 固定比例改为自适应剩余空间。
- style.css：`.form-v2-bench h3` 改 `align-self:flex-start`（标题绶带原本被 flex 拉伸成整条红带，挤占待上阵区）。
- render.ts:1997 过滤选择器 → `.bench-strip [data-faction], .pick-grid [data-faction]`。
- render.ts bench 渲染：移除末尾 3 个 `.bench-locked` 占位格（它们排在最后会把卡片挤到第二行并撑高滚动区）。

### 验证
- 布阵页：两列三行，前排右列大立绘、后排左列小立绘；拖拽 slot↔slot 换位、bench→slot 上阵、slot→bench 下阵均生效；点击已上阵 bench 卡下阵；队满点未上阵卡出 toast；反复上阵/下阵 bench 滚动条不跳。
- 过滤：阵/职/稀三组 chip 点选后 bench 即时筛选，空结果显示"没有符合的武将"；切回"全"恢复。

## 任务 3：征战四档难度（普通/困难/英雄/史诗）

### 设计决策
- **难度类型**：`export type Difficulty = 'normal' | 'hard' | 'hero' | 'epic'`，放在 types.ts。
- **进度独立**：SaveData 新增 `stageHardCleared / stageHeroCleared / stageEpicCleared: number`（默认 0），普通沿用 `stageCleared`。
- **解锁链**：挑战第 N 关某难度需：该难度第 N-1 关已通（递进），且 困难需普通 N 已通、英雄需困难 N 已通、史诗需英雄 N 已通。
- **数值**：`makeStage(id, diff='normal')` 在现有 waves 生成后对每个敌人按难度缩放属性（不改等级，避免突破/觉醒门槛公式失真）。倍率随关卡推进递增（`mult = 1 + (base-1) × (id/200)^0.8`），保证前期不卡进度、终关形成门槛：
  | 难度 | 敌方属性终关 | Boss 额外 | 银两/经验奖励 | 首次通关元宝 |
  |---|---|---|---|---|
  | 普通 | ×1.0 | — | ×1 | 现状 |
  | 困难 | ×3.2 | — | ×2 | ×2 |
  | 英雄 | ×4.2 | Boss 突破+2 | ×3.5 | ×3 |
  | 史诗 | ×5.2 | Boss 突破+2、觉醒+3 | ×6 | ×5 |
- **倍率曲线**：`difficultyMult(diff, id) = 1 + (base-1) × diffCurve(id, 200)`，`diffCurve(id) = (id/200)^0.8`。第 1 关倍率仅 1.03/1.05/1.06，递进解锁链不会卡死。
- **校准目标与结果**（Node 模拟 20 次取样）：
  - 史诗 200 关：6 名满配神将 90–95% 胜、存活 3.2–3.5；5 神将 0–25%；6 满配凡人 25–45%；5 凡人 0%；裸装 0%；未觉醒 0%。
  - 阶梯：普通 6 神将 100%/6.0 活 → 困难 100%/6.0 活 → 英雄 100%/5.3 活 → 史诗 95%/3.2 活。
  - 普通档回归：倍率恒为 1，奖励与改动前完全一致。
- **扫荡**：各难度独立，`stageId <= 该难度进度` 可扫荡，共用每日扫荡次数。
- **自动推图**：在当前所选难度上连战（沿用现有 onBattlePlaybackDone 调度）。

### 改动文件
1. **types.ts**：`Difficulty` 类型；SaveData 加三个进度字段；`store.pending` 的 stage 分支加 `diff`。
2. **stages.ts**：`makeStage(id, diff)` + `DIFFICULTY` 常量表（系数/奖励倍率/标签色）；`STAGES` 保持普通档导出不变。
3. **save.ts**：`defaultSave()` 加三个 0；`loadSave()` 合并时用 `num(data.stageHardCleared)` 等兜底；`acceptServerSave()` 同样补三行。`SAVE_VERSION` 不变（纯新增字段，旧档自动补默认值）。
4. **store.ts**：
   - `difficulty: Difficulty = 'normal'` 字段（UI 切换时写入，不进存档）。
   - `progressFor(diff)`；`challenge(stageId, diff=this.difficulty)`：递进+解锁链校验，胜利更新对应进度，扫荡按对应进度判断。
   - `toggleAutoPush`/`onBattlePlaybackDone` 的 nextId 用 `progressFor(this.difficulty)+1`。
5. **render.ts**：
   - campaignView 章节内加难度切换 chips（普通/困难/英雄/史诗），模块级 `campaignDiff` 同步 `store.difficulty`；关卡节点状态（未解锁/当前/已通关）按 `progressFor(campaignDiff)` 着色；锁定难度 chip 显示解锁条件。
   - prepView 显示当前难度标签与敌方属性倍率提示。
6. **battle.ts**：不动（敌人缩放发生在 stages.ts 生成阶段）。

### 验证
- `npm run build` 通过。
- Node 脚本：6 满配神将 vs 史诗 200 → 胜且存活≤3；6 满级非神将 vs 史诗 200 → 败；普通 1~200 现有难度不变（普通档回归）。
- 浏览器实测：难度切换、解锁链拦截提示、困难/英雄/史诗各打 1 关、进度独立推进、扫荡、自动推图。

## 总体验证（任务 4）
1. `npm run build`。
2. `npx vite --port 5173 --strictPort` 起服务，浏览器逐项实测（任务1/2/3 的验证清单）。
3. 测试造档须同时写 localStorage 与 `PUT /api/save`（account.ts 4s pulse 会覆盖纯本地改动——已验证过的坑）。
4. 实测完毕还原存档。
