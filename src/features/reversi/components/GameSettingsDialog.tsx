import React, { useState, useEffect } from "react";
import styles from "./GameSettingsDialog.module.css";
import { GameMode, Difficulty, Stone, GameSettings } from "../types/reversi";

type GameSettingsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: GameSettings;
  onSave: (newSettings: Partial<GameSettings>) => void;
  onStartGame: () => void;
};

export const GameSettingsDialog: React.FC<GameSettingsDialogProps> = ({
  isOpen,
  onClose,
  currentSettings,
  onSave,
  onStartGame,
}) => {
  const [localMode, setLocalMode] = useState<GameMode>(currentSettings.mode);
  const [localDiff, setLocalDiff] = useState<Difficulty>(currentSettings.difficulty);
  const [localColor, setLocalColor] = useState<Stone>(currentSettings.playerColor);

  // Sync when dialog opens
  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalMode(currentSettings.mode);
      setLocalDiff(currentSettings.difficulty);
      setLocalColor(currentSettings.playerColor);
    }
  }, [isOpen, currentSettings]);

  if (!isOpen) return null;

  const handleStart = () => {
    onSave({
      mode: localMode,
      difficulty: localDiff,
      playerColor: localColor,
    });
    
    onStartGame();
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div 
        className={styles.dialog} 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-dialog-title"
      >
        <h2 id="settings-dialog-title" className={styles.title}>新しい対局</h2>

        <div className={styles.settingGroup}>
          <label className={styles.label}>モード</label>
          <div className={styles.toggleGroup}>
            <button
              className={`${styles.toggleButton} ${localMode === "pvp" ? styles.active : ""}`}
              onClick={() => setLocalMode("pvp")}
            >
              2人対戦 (PvP)
            </button>
            <button
              className={`${styles.toggleButton} ${localMode === "cpu" ? styles.active : ""}`}
              onClick={() => setLocalMode("cpu")}
            >
              CPU対戦
            </button>
          </div>
        </div>

        {localMode === "cpu" && (
          <>
            <div className={styles.settingGroup}>
              <label className={styles.label}>難易度 (CPU)</label>
              <div className={styles.toggleGroup}>
                <button
                  className={`${styles.toggleButton} ${localDiff === "easy" ? styles.active : ""}`}
                  onClick={() => setLocalDiff("easy")}
                >
                  Easy
                </button>
                <button
                  className={`${styles.toggleButton} ${localDiff === "normal" ? styles.active : ""}`}
                  onClick={() => setLocalDiff("normal")}
                >
                  Normal
                </button>
                <button
                  className={`${styles.toggleButton} ${localDiff === "hard" ? styles.active : ""}`}
                  onClick={() => setLocalDiff("hard")}
                >
                  Hard
                </button>
              </div>
            </div>

            <div className={styles.settingGroup}>
              <label className={styles.label}>あなたの担当</label>
              <div className={styles.toggleGroup}>
                <button
                  className={`${styles.toggleButton} ${localColor === "black" ? styles.active : ""}`}
                  onClick={() => setLocalColor("black")}
                >
                  黒 (先手)
                </button>
                <button
                  className={`${styles.toggleButton} ${localColor === "white" ? styles.active : ""}`}
                  onClick={() => setLocalColor("white")}
                >
                  白 (後手)
                </button>
              </div>
            </div>
          </>
        )}

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>キャンセル</button>
          <button className={styles.saveBtn} onClick={handleStart}>対局開始</button>
        </div>
      </div>
    </div>
  );
};
