# Reversi プロジェクト 再レビューレポート (v2)

**対象**: 前回レビュー指摘への対応修正後のドキュメント・実装・動作

**ビルド**: ✅ 成功 | **テスト**: ✅ 23/23 pass (16 → 23) | **TypeScript**: ✅ エラーなし

---

## 1. 変更サマリー

今回の修正は大きく **3つの柱** に分かれています：

### 🆕 新機能: `idle` → `playing` → `finished` のステートマシン

| 変更 | 詳細 |
|---|---|
| `GameStatus` に `"idle"` 追加 | [reversi.ts L24](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/types/reversi.ts#L24) |
| 初期状態が `"idle"` に | [game.ts L15](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/logic/game.ts#L15) |
| `START_GAME` アクション追加 | [actions.ts](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/state/actions.ts), [gameReducer.ts](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/state/gameReducer.ts) |
| 「対局開始」ボタン + 設定ダイアログ統合 | [GameControls.tsx](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/components/GameControls.tsx), [GameSettingsDialog.tsx](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/components/GameSettingsDialog.tsx) |
| `idle` 時にクリック無効化 | [useReversiGame.ts L29](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/hooks/useReversiGame.ts#L29) |

### 📄 ドキュメント更新

| 変更 | 詳細 |
|---|---|
| SPEC §4 の `utils/` 削除 | ✅ 解消 |
| SPEC §15.1 AI「実装済み」に更新 | ✅ 解消 |
| SPEC §9.1 に `isCpuThinking` 追加 | ✅ 解消 |
| SPEC §7.5, §7.6 新設 (AI, Stats) | ✅ 解消 |
| PRD §5, §15 更新 | ✅ 解消 |

### 🧱 設計改善

| 変更 | 詳細 |
|---|---|
| `stats.ts` から `localStorage` 除去 → Hooks層に移動 | ✅ 前回指摘 #8 解消 |
| `GameStats` から `pvp` フィールド削除 | CPU専用に簡素化 |
| `computeAiMove` に exhaustive check 追加 | ✅ 前回指摘 #9 解消 |
| アクセシビリティ (`role="dialog"`, `aria-modal`) 追加 | ✅ 前回指摘 #3 解消 |
| CPU思考中インジケーター追加 | ✅ 前回指摘 #1 解消 |
| AI/stats テスト追加 (7件) | ✅ 前回指摘 #2 解消 |

---

## 2. 前回指摘の解消状況

### 🔴 対応推奨（前回 Medium Priority）

| # | 前回の指摘 | 状況 | 判定 |
|---|---|---|---|
| 1 | `isCpuThinking` が UI 側で使われていない | [GameInfoPanel](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/components/GameInfoPanel.tsx#L49) に思考中ドットアニメーション追加 | ✅ **解消** |
| 2 | COM対戦関連のユニットテスト未作成 | [ai.test.ts](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/logic/__tests__/ai.test.ts) (4件) + [stats.test.ts](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/logic/__tests__/stats.test.ts) (3件) 追加 | ✅ **解消** |
| 3 | ダイアログに `role="dialog"` / `aria-modal` 未設定 | [GameSettingsDialog L52-54](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/components/GameSettingsDialog.tsx#L52-L54), [GameStatsDialog L40-42](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/components/GameStatsDialog.tsx#L40-L42) に追加 | ✅ **解消** |

### 🟡 改善推奨（前回 Low Priority）

| # | 前回の指摘 | 状況 | 判定 |
|---|---|---|---|
| 4 | SPEC §9.1 に `isCpuThinking` 未記載 | [SPEC L738](file:///Users/tsutsumiakira/Develop/ai/Reversi/SPEC.md#L738) に追加 | ✅ **解消** |
| 5 | SPEC §15.1 が実装済みなのに未更新 | 「実装済み」に更新＋文言修正 | ✅ **解消** |
| 6 | PRD §15 の備考文言 | CPU対戦を含む旨に更新 | ✅ **解消** |
| 7 | SPEC §4 に `utils/` 存在 | 削除済み | ✅ **解消** |
| 8 | `stats.ts` の `localStorage` が Logic 層 | `loadStats`/`saveStats` を Hooks 層 ([useGameStats.ts](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/hooks/useGameStats.ts#L7-L35)) に移動 | ✅ **解消** |
| 9 | `computeAiMove` に exhaustive check なし | [ai.ts L175-176](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/logic/ai.ts#L175-L176) に追加 | ✅ **解消** |

> [!NOTE]
> 前回の指摘事項 **9件すべてが解消** されています。素晴らしい対応です。

---

## 3. 新規発見事項

### 3.1 🔴 `applyMove` が `idle` 状態の着手をブロックしない

[game.ts L43-47](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/logic/game.ts#L43-L47):

```ts
export function applyMove(gameState: GameState, position: Position): GameState {
  // 1. If the game is already finished, return the current state
  if (gameState.status === "finished") {
    return gameState;
  }
  // ... (idle でも通過する)
```

`status === "idle"` の場合もそのまま `applyMove` の処理が続行されます。現在は [useReversiGame.ts L29](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/hooks/useReversiGame.ts#L29) の `placeStone` で UI 層がガードしていますが、**Logic 層自体がガードしていない** ため、`dispatch({ type: "PLACE_STONE" })` を直接呼ばれた場合に `idle` 状態でも石が置けてしまいます。

> [!WARNING]
> **推奨修正**：`applyMove` の冒頭で `idle` も弾く:
> ```ts
> if (gameState.status !== "playing") {
>   return gameState;
> }
> ```
> これにより、Logic 層の防御が完全になり、UI 層のガードと二重防御になります。SPEC §12.3 の「不正な着手」条件にも「ゲーム開始前の着手」を追加することを推奨します。

---

### 3.2 🔴 SPEC §5.8 `GameStatus` に `idle` が未反映

SPEC §5.8 はまだ以下のままです：

```ts
type GameStatus = 'playing' | 'finished';
```

実装では `'idle' | 'playing' | 'finished'` に変更されています。

同様に、SPEC §5.10 の `createInitialGameState` の初期状態（`status: "playing"` と記載）も更新が必要です。

> [!IMPORTANT]
> SPECの以下の箇所を更新してください：
> - **§5.8**: `GameStatus` に `'idle'` を追加
> - **§7.4** `createInitialGameState` の初期状態: `status: "idle"`
> - **§8.2** Action定義: `START_GAME` アクションを追加
> - **§8.3** gameReducer の処理テーブル: `START_GAME` の行を追加
> - **§9.1** `useReversiGame` の戻り値: `startGame` 関数を追加
> - **§12.1** 初期化フローに `idle → (START_GAME) → playing` を追記
> - **§12.3** 不正な着手条件に「ゲーム未開始（idle状態）の着手」を追加

---

### 3.3 🟡 SPEC §5.12 `GameStats` に `pvp` フィールドが残っている

SPEC §5.12 には `pvp: StatRecord` が記載されていますが、実装では `pvp` は削除され CPU 専用になっています：

```ts
// SPEC記載
type GameStats = {
  pvp: StatRecord;
  cpu: { easy: StatRecord; normal: StatRecord; hard: StatRecord; };
};

// 実装
type GameStats = {
  cpu: { easy: StatRecord; normal: StatRecord; hard: StatRecord; };
};
```

---

### 3.4 🟡 `GameControls` のインラインスタイル

[GameControls.tsx L44-45](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/components/GameControls.tsx#L44-L45):

```tsx
style={{ opacity: isPlaying ? 0.5 : 1, cursor: isPlaying ? "not-allowed" : "pointer" }}
```

SPEC §18.1 の CSS 方針（「JavaScript側では、必要な状態フラグのみをCSSクラスに変換する」）に従い、CSS Modules に `disabled` クラスを定義してクラス名で制御する方が一貫性があります。

> [!TIP]
> ```css
> /* GameControls.module.css */
> .disabled {
>   opacity: 0.5;
>   cursor: not-allowed;
> }
> ```
> ```tsx
> className={`${styles.button} ${isPlaying ? styles.disabled : ""}`}
> ```

---

### 3.5 🟡 `GameControls` の `window.confirm` 使用

[GameControls.tsx L17-19](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/components/GameControls.tsx#L17-L19):

```ts
const handleReset = () => {
  if (window.confirm("現在の対局をリセットして待機状態に戻しますか？")) {
    onReset();
  }
};
```

ブラウザネイティブの `confirm` ダイアログは、他のダイアログ（`GameSettingsDialog` 等）のグラスモルフィズムデザインと視覚的に不整合です。将来的にはカスタム確認ダイアログの検討も良いかもしれません。ただし、機能としては正しく動作しています。

---

### 3.6 🟡 SPEC §9.1 `useReversiGame` の戻り値に `startGame` 未記載

SPEC §9.1 の戻り値に `isCpuThinking` は追加されていますが、`startGame` 関数が記載されていません：

```ts
// SPEC記載
{
  gameState: GameState;
  score: Score;
  isCpuThinking: boolean;
  placeStone: (position: Position) => void;
  resetGame: () => void;
}

// 実装
{
  gameState, score, placeStone, resetGame,
  startGame,      // ← SPEC に未記載
  isCpuThinking,
}
```

---

### 3.7 🟢 `stats.ts` のレイヤー分離改善が優秀

`loadStats` / `saveStats` を [useGameStats.ts](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/hooks/useGameStats.ts) に移動し、`stats.ts` の Logic 層には純粋な `updateStats` 関数と `DEFAULT_STATS` 定数のみが残っています。これにより：

- Logic 層は `localStorage` に非依存 → テスト容易性向上
- Hooks 層がストレージ責務を担う → 責務分離の原則に合致
- `DEFAULT_STATS` が export されテストから利用可能 → テストでの初期値生成が簡潔

前回の設計純度の指摘に対する **模範的な対応** です。

---

### 3.8 🟢 `idle` ステートマシン導入の設計評価

新しい `idle → playing → finished` のフローにより：

- 初回起動時に設定を確認してから対局開始できる
- 「対局開始」ボタンで明示的にゲーム開始するUXが自然
- CPUが先手の場合でも、ユーザーが準備できてから開始
- リセット時に即座にゲームが再開されない

これは前回指摘した「リセット直後にCPUが動き出す」問題を**根本から解決**する良いアプローチです。

---

## 4. テストの進捗

| ファイル | テスト数 | 前回比 |
|---|---|---|
| [board.test.ts](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/logic/__tests__/board.test.ts) | 3 | — |
| [rules.test.ts](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/logic/__tests__/rules.test.ts) | 5 | — |
| [scoring.test.ts](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/logic/__tests__/scoring.test.ts) | 3 | — |
| [game.test.ts](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/logic/__tests__/game.test.ts) | 5 | — |
| [ai.test.ts](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/logic/__tests__/ai.test.ts) | 4 | 🆕 |
| [stats.test.ts](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/logic/__tests__/stats.test.ts) | 3 | 🆕 |
| **合計** | **23** | **+7** |

AI テストでは以下がカバーされています：
- ✅ 合法手なし → `null` 返却
- ✅ Easy: ランダム選択が合法手範囲内
- ✅ Normal: 貪欲法で最大反転数の手を選択
- ✅ Hard: 角が取れる場面で角を選択

Stats テストでは：
- ✅ 人間勝利時の wins 加算
- ✅ CPU勝利時の losses 加算
- ✅ 引き分け時の draws 加算

---

## 5. 発見事項サマリー

### 🔴 対応推奨（Medium Priority）

| # | 内容 | ファイル |
|---|---|---|
| 1 | `applyMove` が `idle` 状態をブロックしない — Logic 層の防御不足 | [game.ts L43-47](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/logic/game.ts#L43-L47) |
| 2 | SPEC §5.8, §7.4, §8.2, §8.3, §9.1, §12.1, §12.3 に `idle` / `START_GAME` / `startGame` 関連の更新未反映 | [SPEC.md](file:///Users/tsutsumiakira/Develop/ai/Reversi/SPEC.md) |

### 🟡 改善推奨（Low Priority）

| # | 内容 | ファイル |
|---|---|---|
| 3 | SPEC §5.12 に `pvp` フィールドが残存（実装では削除済み） | SPEC.md §5.12 |
| 4 | `GameControls` のインラインスタイルが CSS 方針と不整合 | [GameControls.tsx L44-45](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/components/GameControls.tsx#L44-L45) |
| 5 | `window.confirm` がグラスモルフィズムデザインと不整合（将来改善候補） | [GameControls.tsx L17-19](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/components/GameControls.tsx#L17-L19) |
| 6 | SPEC §9.1 に `startGame` 関数が未記載 | SPEC.md §9.1 |

---

## 6. 結論

前回指摘した **9件すべてが適切に解消** されています。特に：

- **`localStorage` の Logic 層からの除去** は設計純度を大きく向上させました
- **`idle` ステートマシン** の導入は、ゲームフローの制御を明確にし、UX も改善しています
- **AI/Stats テストの追加** により、COM 対戦機能のカバレッジが確保されました
- **アクセシビリティの改善** (`role="dialog"`, `aria-modal`) も丁寧に対応されています

最優先の対応事項は **①`applyMove` の `idle` ガード追加** と **②SPEC への `idle`/`START_GAME` 仕様反映** です。いずれも修正量は小さく、すぐに対応できます。
