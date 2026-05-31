# Reversi プロジェクト レビューレポート

**対象**: COM対戦機能追加後の ドキュメント・実装・動作

**ビルド**: ✅ 成功 | **テスト**: ✅ 16/16 pass | **TypeScript**: ✅ エラーなし

---

## 1. 総合評価

全体として **非常に高品質なプロジェクト** です。アーキテクチャ方針に忠実で、レイヤー分離・イミュータブル設計・責務分離がきれいに保たれています。COM対戦機能は既存設計を壊さず自然に追加されています。

以下のセクションでは、改善点と潜在的な問題を **深刻度別** に整理します。

---

## 2. ドキュメント（SPEC.md / PRD.md）とのギャップ

### 2.1 SPEC.md の構造整合性

| 項目 | SPEC記載 | 実装 | 判定 |
|---|---|---|---|
| ディレクトリ構造 (§4) | `utils/` ディレクトリを記載 | 存在しない | ⚠️ 軽微 |
| `ai.ts` の配置 (§4) | `logic/ai.ts` として記載 | [ai.ts](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/logic/ai.ts) に実装 — 一致 | ✅ |
| `stats.ts` の配置 (§4) | `logic/stats.ts` として記載 | [stats.ts](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/logic/stats.ts) に実装 — 一致 | ✅ |
| `useGameSettings` / `useGameStats` (§4) | `hooks/` に記載 | 実装済み — 一致 | ✅ |
| `GameSettingsDialog` / `GameStatsDialog` (§4) | `components/` に記載 | 実装済み — 一致 | ✅ |

> [!NOTE]
> SPEC §4 に `utils/` ディレクトリが記載されていますが、実装には存在しません。現状不要であれば SPEC から削除するか、今後の拡張に備えて空ディレクトリを残すか統一してください。

---

### 2.2 AI仕様（§7.5）の将来拡張セクション（§15.1）との矛盾

SPEC §7.5 では `computeAiMove` を `logic/ai.ts` に定義する仕様になっていますが、§15.1「将来拡張 > AI対戦」では `logic/ai/randomAi.ts`, `logic/ai/minimaxAi.ts`, `logic/ai/evaluateBoard.ts` のようなサブディレクトリ構成を想定しています。

**現在の実装** では §7.5 に従い単一ファイル `ai.ts` にすべてを集約しています。これは現時点で適切ですが、§15.1 の記述は「将来拡張 → 実装済み」になったため、ドキュメント上で整合性を取る必要があります。

> [!TIP]
> §15.1 の AI対戦セクションを「実装済み」に更新し、現在の `ai.ts` 単一ファイル構成を正式な仕様として記載することを推奨します。

---

### 2.3 PRD.md の更新漏れ

[PRD.md](file:///Users/tsutsumiakira/Develop/ai/Reversi/PRD.md) の §4.1 にCPU対戦・成績管理の機能が記載されていますが、以下の点が不整合です：

- §9「初期リリースでは、ローカル2人対戦に集中する」← CPU対戦が実装済みなので更新が必要
- §15「備考」に「初期リリースでは、ローカル2人対戦に集中する」とあるが、すでにCPU対戦は含まれている

> [!NOTE]
> PRD §15 の備考文言を「CPU対戦・成績管理を含む」旨に更新すると整合します。

---

### 2.4 useReversiGame の戻り値仕様ギャップ

SPEC §9.1 の `useReversiGame` 戻り値：

```ts
// SPEC記載
{ gameState, score, placeStone, resetGame }
```

実際の [useReversiGame.ts](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/hooks/useReversiGame.ts#L71-L77) の戻り値：

```ts
// 実装
{ gameState, score, placeStone, resetGame, isCpuThinking }
```

`isCpuThinking` が追加されていますが、SPECに未反映です。

---

## 3. アーキテクチャ レビュー

### 3.1 レイヤー分離 ✅ 優秀

```
UI → Hooks → State → Logic → Types/Constants
```

この依存方向は完全に守られています。

- **Logic層** (`board.ts`, `rules.ts`, `game.ts`, `scoring.ts`, `ai.ts`, `stats.ts`) は React / Next.js に一切依存しない純粋な TypeScript
- **State層** (`gameReducer.ts`, `actions.ts`) は Logic 層の関数を呼ぶだけの薄いレイヤー
- **Hooks層** は `useReducer` で状態管理し、UI向けのインターフェースを提供
- **UI層** はゲームルールのロジックを持たず、表示とイベント通知に専念

### 3.2 `stats.ts` の `localStorage` 直接参照

[stats.ts](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/logic/stats.ts#L18-L37) の `loadStats` / `saveStats` は Logic 層に配置されていますが、`localStorage` というブラウザAPIに直接依存しています。

> [!WARNING]
> **厳密にはレイヤー違反**です。Logic層は「React / Next.js に依存しない純粋な TypeScript モジュール」（SPEC §1）とされていますが、`localStorage` はブラウザ固有APIです。
>
> **対策案**:
> - `loadStats` / `saveStats` を Hooks 層へ移動し、`updateStats` のみ Logic 層に残す
> - または、ストレージアダプタを引数として注入する設計にする
>
> ただし `typeof window === "undefined"` ガードが入っており、SSR時の安全性は確保されています。**実用上は問題なし**ですが、設計純度の観点からは検討の余地があります。

### 3.3 Reducer の責務 ✅ 適切

[gameReducer.ts](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/state/gameReducer.ts) は SPEC §16.3 の方針どおり、`applyMove` と `createInitialGameState` を呼ぶだけの薄いレイヤーに留まっています。

---

## 4. COM対戦ロジック レビュー

### 4.1 AI アルゴリズム実装 ✅ 基本的に正しい

| 難易度 | アルゴリズム | SPEC準拠 | 品質 |
|---|---|---|---|
| Easy | ランダム選択 | ✅ | 適切 |
| Normal | 貪欲法（最大反転数） | ✅ | 適切 |
| Hard | Minimax + α-β枝刈り (深さ4) | ✅ | 適切 |

[evaluateBoard](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/logic/ai.ts#L17-L49) は位置重み付けマトリクス＋機動力（合法手数差）の複合評価で、バランスの良い設計です。

### 4.2 Minimax の深さとパフォーマンス

[minimax](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/logic/ai.ts#L70-L124) の探索は `depth = 3`（1手目の展開含めて実質 4 手先）で、α-β枝刈りにより妥当なパフォーマンスが期待できます。

> [!TIP]
> ゲーム終盤（空きマスが少ない場合）にはもう少し深く読める可能性があります。**終盤の深さ動的調整** は将来改善候補です。

### 4.3 🐛 潜在的バグ: AI の `computeAiMove` で `difficulty` の網羅性

[computeAiMove](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/logic/ai.ts#L129-L176) の最後の `return null` (L175) は、`difficulty` が `"easy"` / `"normal"` / `"hard"` のいずれにも該当しない場合に到達します。TypeScript の型上は `Difficulty` が 3 値に限定されているため実行時には到達しませんが、**安全ネットとしての `exhaustive check` がない**のは気になります。

```ts
// 推奨: exhaustive check を追加
const _exhaustiveCheck: never = difficulty;
return _exhaustiveCheck;
```

---

### 4.4 🐛 重要: CPU ターン時にユーザーがリセットした場合のレースコンディション

[useReversiGame.ts](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/hooks/useReversiGame.ts#L38-L68) の `useEffect` は `setTimeout` でCPUの手を遅延実行していますが、**クリーンアップ関数** (`clearTimeout` + `setIsCpuThinking(false)`) は正しく設定されています。

ただし、以下のシナリオで**微妙なタイミング問題**が発生する可能性があります：

1. CPUターンが始まる（`setTimeout` 設定）
2. ユーザーが「リセット」をクリック → `dispatch({ type: "RESET_GAME" })`
3. `gameState` が変わることで `useEffect` のクリーンアップが走り `clearTimeout` される
4. しかし、リセット後の新しい `gameState` で再び `useEffect` が発火
5. もし CPU モードで `playerColor = "white"` なら、リセット直後にまた CPU ターン（黒）が開始される

これは **仕様通りの正しい動作** ですが、ユーザー体験として「リセットしたのにすぐCPUが動き出す」ことになります。

> [!NOTE]
> これは実際には問題ではなく、むしろ正しい挙動です（CPUが先手なら即座に動くのは自然）。ただし、`thinkTimeMs` の遅延 600ms がリセット直後にも適用されるため、ユーザーはリセットされたことを認識できます。

---

### 4.5 CPU思考中のUI制御

[useReversiGame.ts L28-31](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/hooks/useReversiGame.ts#L27-L31):

```ts
const placeStone = useCallback((position: Position) => {
  if (isCpuThinking) return;
  dispatch({ type: "PLACE_STONE", payload: { position } });
}, [isCpuThinking]);
```

CPU思考中はクリックを無視する設計 — 適切です。ただし **UI側で「思考中」を視覚的に示す表現がない** ことに気づきました。

> [!IMPORTANT]
> `isCpuThinking` は `useReversiGame` から返されていますが、[ReversiGame.tsx](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/components/ReversiGame.tsx#L18) では使われていません：
>
> ```ts
> const { gameState, score, placeStone, resetGame } = useReversiGame(settings);
> //                                                   ^ isCpuThinking が取得されていない
> ```
>
> CPU思考中のインジケーター（ローディングスピナー、盤面のオーバーレイなど）を追加することを推奨します。

---

## 5. 状態管理 & ゲームフロー レビュー

### 5.1 成績記録のタイミング ✅ 正しい

[ReversiGame.tsx L26-33](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/components/ReversiGame.tsx#L26-L33) の `hasRecorded` フラグにより、成績が二重記録されない設計 — 適切です。

### 5.2 設定変更時のリセット ✅ 正しい

[GameSettingsDialog.tsx L35-52](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/components/GameSettingsDialog.tsx#L35-L52) で設定変更時のみ `onResetGame()` を呼ぶ — 適切です。

### 5.3 `passMessage` のライフサイクル ✅ SPEC準拠

[applyMove](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/logic/game.ts#L45-L128) 内で `nextPassMessage` は：
- 通常ターン切替時 → `null`
- 相手パス時 → メッセージ設定
- ゲーム終了時 → `null`

SPEC §12.4 の仕様に完全準拠しています。

---

## 6. UI/UX レビュー

### 6.1 SPEC 準拠度

| SPEC 仕様 | 実装状態 |
|---|---|
| §18.2 デザイントークン (CSS Custom Properties) | ✅ [globals.css](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/app/globals.css) に定義 |
| §18.3 盤面スタイル（ダークグリーン基調） | ✅ 実装済み |
| §18.4 石の立体的質感 | ✅ radial-gradient で実装 |
| §18.5 グラスモルフィズム | ✅ `backdrop-filter: blur()` 使用 |
| §18.6 合法手マーカー＆ホバープレビュー | ✅ 実装済み |
| §18.7 着手時エフェクト（スケール + リップル） | ✅ 実装済み |
| §18.8 反転アニメーション（3D flip） | ✅ 実装済み |
| §18.9 `prefers-reduced-motion` 対応 | ✅ 実装済み |
| §18.10 UI状態とゲーム状態の分離 | ✅ 完全分離 |

### 6.2 アクセシビリティ

- ✅ `role="grid"` / `role="gridcell"` の設定
- ✅ `aria-label` でセル位置・状態を説明
- ✅ `focus-visible` スタイル定義
- ✅ キーボード操作（Enter / Space）対応
- ✅ `prefers-reduced-motion` 対応

> [!TIP]
> `GameSettingsDialog` と `GameStatsDialog` のオーバーレイに `role="dialog"` と `aria-modal="true"` が未設定です（`GameResultDialog` には設定済み）。追加を推奨します。

### 6.3 反転アニメーションの実装

[ReversiCell.module.css](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/components/ReversiCell.module.css#L224-L243) の `animateFlip` は `scale` ベースの「ポップ」エフェクトですが、SPEC §18.8 では `rotateY` を使った 3D 反転を想定しています。

実際の3D反転は `.stone` の `transform: rotateY()` ベースの切り替え（`.black` = `0deg`, `.white` = `180deg`）で機能していますが、`animateFlip` クラスが付与されるタイミングでは既に `cellState` が変わっているため、CSS transition の `transform: rotateY()` が自動的に反転アニメーションを発生させます（`.stone` に `transition: transform var(--duration-flip)` が設定されているため）。

つまり **反転の 3D 回転はCSSの transition で正しく動作** し、`animateFlip` はそれに加えた「スケールバウンス」の付加エフェクトとして機能しています。設計上問題ありません。

---

## 7. テスト カバレッジ

### 7.1 現状のテスト

| ファイル | テスト数 | 状態 |
|---|---|---|
| [board.test.ts](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/logic/__tests__/board.test.ts) | 3 | ✅ Pass |
| [rules.test.ts](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/logic/__tests__/rules.test.ts) | 5 | ✅ Pass |
| [scoring.test.ts](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/logic/__tests__/scoring.test.ts) | 3 | ✅ Pass |
| [game.test.ts](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/logic/__tests__/game.test.ts) | 5 | ✅ Pass |

### 7.2 テスト不足箇所

> [!WARNING]
> COM対戦関連のテストが **ゼロ** です。以下のテスト追加を推奨します：

| 対象 | テスト内容 |
|---|---|
| `computeAiMove` (easy) | ランダム選択が `validMoves` の範囲内か |
| `computeAiMove` (normal) | 最大反転数の手が選択されるか |
| `computeAiMove` (hard) | 角が取れる場面で角を取るか |
| `computeAiMove` (合法手なし) | `null` を返すか |
| `evaluateBoard` | 角を持つ側が有利に評価されるか |
| `updateStats` (CPU) | 人間勝利時に wins が加算されるか |
| `updateStats` (CPU) | CPU 勝利時に losses が加算されるか |
| `updateStats` (PvP) | 黒勝利時に wins が加算されるか |

---

## 8. 発見事項サマリー

### 🔴 対応推奨（Medium Priority）

| # | 内容 | ファイル |
|---|---|---|
| 1 | `isCpuThinking` が UI 側で使われていない — 思考中の視覚フィードバックなし | [ReversiGame.tsx L18](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/components/ReversiGame.tsx#L18) |
| 2 | COM対戦関連のユニットテストが未作成 | `__tests__/` |
| 3 | `GameSettingsDialog` / `GameStatsDialog` に `role="dialog"` / `aria-modal` 未設定 | [GameSettingsDialog.tsx L56](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/components/GameSettingsDialog.tsx#L56), [GameStatsDialog.tsx L37](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/components/GameStatsDialog.tsx#L37) |

### 🟡 改善推奨（Low Priority）

| # | 内容 | ファイル |
|---|---|---|
| 4 | SPEC §9.1 の `useReversiGame` 戻り値に `isCpuThinking` 未記載 | SPEC.md §9.1 |
| 5 | SPEC §15.1 の AI 将来拡張セクションが実装済みなのに未更新 | SPEC.md §15.1 |
| 6 | PRD §15 備考の「ローカル2人対戦に集中」がCPU対戦追加後も残存 | PRD.md §15 |
| 7 | SPEC §4 に `utils/` ディレクトリ記載あるが実装に存在しない | SPEC.md §4 |
| 8 | `stats.ts` の `localStorage` 直接参照がLogic層の純粋性を損なう | [stats.ts](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/logic/stats.ts) |
| 9 | `computeAiMove` に exhaustive check がない | [ai.ts L175](file:///Users/tsutsumiakira/Develop/ai/Reversi/src/features/reversi/logic/ai.ts#L175) |

---

## 9. 結論

COM対戦機能の追加は、既存のアーキテクチャ設計を尊重しつつ、きれいに統合されています。特に以下の点が優れています：

- **AI ロジックの分離**: `computeAiMove` は `GameState` を受け取り `Position` を返す純粋関数
- **3段階の難易度**: ランダム → 貪欲法 → Minimax+α-β の段階設計が適切
- **設定の永続化**: `localStorage` による設定・成績の保存
- **UI統合**: 設定ダイアログ・成績ダイアログの追加が既存UIに自然に溶け込んでいる

最優先の対応事項は **①CPU思考中の視覚フィードバック** と **②AIロジックのテスト追加** です。
