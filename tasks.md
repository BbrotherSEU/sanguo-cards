# Tasks：装备弹层虚化背景 / 布阵界面修复 / 征战三难度

## T1 装备弹层保留人物界面虚化背景
- [ ] render.ts：`${gearPop}` 从 `.dossier-stage` 内移到 `.hero-page.dossier` 的 `</section>` 前
- [ ] style.css：`.hero-page.dossier{position:relative}`；`.gear-pop` 背景 `rgba(12,6,4,0.38)` + `backdrop-filter: blur(6px) saturate(.85)`
- [ ] 验证：弹层覆盖整个人物页、背景虚化可见、关闭正常、连续升级不闪关

## T2 布阵界面修复
- [ ] 竖排 3×2：style.css `.slot-v2.front` → `left:66%`，`.back` → `left:28%`，`col-0/1/2` → `top:12%/40%/68%`
- [ ] 拖拽：render.ts `bindTeamDrag` 三处 `.form-board` → `.form-v2-stage`；CSS 补 `.form-v2-stage.drag-live .slot-v2`；`.slot-v2{touch-action:none;user-select:none}`；`.bench-strip .hero-card{touch-action:pan-y}`；slot 拖到 bench 下阵
- [ ] 体感：`data-pick` 点击——已上阵→下阵；未上阵→选中槽/首空槽；队满→toast；槽位重复点击取消选中
- [ ] render() keep/restore 增加 `.bench-strip` scrollLeft
- [ ] bench：去 `max-height:190px`，`.screen-team .main` 行高 `minmax(0,1.15fr) minmax(0,1fr)`，`.bench-strip` 改 wrap+纵滚；补 `.bench-strip .hero-card[hidden]{display:none}`；过滤选择器改 `.bench-strip [data-faction], .pick-grid [data-faction]`
- [ ] 验证：拖拽三种手势、上阵/下阵、滚动保持、三组过滤即时生效

## T3 征战三难度
- [ ] types.ts：`Difficulty` 类型 + SaveData 三进度字段 + pending 加 diff
- [ ] stages.ts：`makeStage(id, diff)` 缩放表（1.0/1.6/2.4/4.2，Boss 额外突破/觉醒，奖励 ×1/×2/×3.5/×6，元宝 ×1/×2/×3/×5）
- [ ] save.ts：defaultSave/loadSave/acceptServerSave 补三个进度字段
- [ ] store.ts：`difficulty` 字段、`progressFor`、`challenge(stageId, diff)` 递进+解锁链、扫荡与自动推图按当前难度
- [ ] render.ts：campaignView 难度 chips + 节点状态分难度着色；prepView 难度标签
- [ ] Node 校准脚本：史诗 200 = 6 满配神将险胜、非神将满配败；普通档回归不变

## T4 总验证
- [ ] `npm run build` 通过
- [ ] 浏览器实测 T1/T2/T3 全部清单（造档双写 localStorage + PUT /api/save）
- [ ] 实测后还原存档
