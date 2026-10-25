# Tasks：装备弹层虚化背景 / 布阵界面修复 / 征战三难度

## T1 装备弹层保留人物界面虚化背景
- [x] render.ts：`${gearPop}` 从 `.dossier-stage` 内移到 `.hero-page.dossier` 的 `</section>` 前
- [x] style.css：`.hero-page.dossier{position:relative}`；`.gear-pop` 背景 `rgba(12,6,4,0.38)` + `backdrop-filter: blur(6px) saturate(.85)`
- [x] 验证：弹层覆盖整个人物页、背景虚化可见、关闭正常、连续升级不闪关

## T2 布阵界面修复
- [x] 竖排 3×2：`.form-v2-stage` 改 CSS Grid（2 列 × 3 行），槽位改 grid-column/grid-row，槽位结构拆为 `.slot-v2-fig` + `.slot-v2-tag`
- [x] 拖拽：render.ts `bindTeamDrag` 三处 `.form-board` → `.form-v2-stage`；CSS 补 `.form-v2-stage.drag-live`；`.slot-v2{touch-action:none}`；`.bench-strip .hero-card{touch-action:pan-y}`；slot 拖到 bench 下阵
- [x] 体感：`data-pick` 点击——已上阵→下阵；未上阵→选中槽/首空槽；队满→toast；槽位重复点击取消选中
- [x] render() keep/restore 增加 `.bench-strip` scrollTop
- [x] bench：去 `max-height:190px`；`.screen-team .main` 行高 `minmax(0,1fr) 206px`；`.bench-strip` 改 wrap+纵滚；`.bench-strip .hero-card{min-height:92px}` + `.art` 自适应；补 `.bench-strip .hero-card[hidden]{display:none}`；`h3` 改 `align-self:flex-start`；移除 3 个 `.bench-locked` 占位；过滤选择器改 `.bench-strip [data-faction], .pick-grid [data-faction]`
- [x] 验证：拖拽三种手势、上阵/下阵、滚动保持、三组过滤即时生效

## T3 征战三难度
- [x] types.ts：`Difficulty` 类型 + SaveData 三进度字段 + pending 加 diff
- [x] stages.ts：`makeStage(id, diff)` 缩放（曲线 1+(base-1)×(id/200)^0.8，base 3.2/4.2/5.2，Boss 额外突破/觉醒，奖励倍率 1/2/3.5/6，元宝 1/2/3/5）
- [x] save.ts：defaultSave/acceptServerSave 补三个进度字段
- [x] store.ts：`difficulty` 字段、`progressFor`、`challenge(stageId, diff)` 递进+解锁链、扫荡与自动推图按当前难度
- [x] render.ts：campaignView 难度 chips + 节点状态分难度着色；prepView 难度标签
- [x] Node 校准脚本：史诗 200 = 6 满配神将 90–95% 胜；5 神将/凡人/裸装均败；普通档回归不变

## T4 总验证
- [x] `npm run build` 通过
- [x] 浏览器实测 T1/T2/T3 全部清单（造档双写 localStorage + PUT /api/save）—— 53 项断言全绿
- [x] 实测后还原存档（清理测试账号，保留 1234 / shotbot / tester1）

## T5 收尾
- [x] 删除临时调试代码（`window.__drag`）
- [x] 清理临时脚本与截图产物
- [x] spec.md / tasks.md 同步最终实现
