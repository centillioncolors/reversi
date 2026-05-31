import React from "react";
import styles from "./GameStatsDialog.module.css";
import { GameStats, StatRecord } from "../types/reversi";

type GameStatsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats | null;
};

const StatRow: React.FC<{ label: string; record: StatRecord }> = ({ label, record }) => {
  const total = record.wins + record.losses + record.draws;
  const winRate = total > 0 ? Math.round((record.wins / total) * 100) : 0;

  return (
    <div className={styles.statRow}>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statValues}>
        <span className={styles.win}>{record.wins}勝</span>
        <span className={styles.loss}>{record.losses}敗</span>
        <span className={styles.draw}>{record.draws}分</span>
      </div>
      <div className={styles.statRate}>勝率: {winRate}%</div>
    </div>
  );
};

export const GameStatsDialog: React.FC<GameStatsDialogProps> = ({
  isOpen,
  onClose,
  stats,
}) => {
  if (!isOpen || !stats) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div 
        className={styles.dialog} 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="stats-dialog-title"
      >
        <h2 id="stats-dialog-title" className={styles.title}>対戦成績</h2>
        


        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>対CPU戦</h3>
          <StatRow label="Easy" record={stats.cpu.easy} />
          <StatRow label="Normal" record={stats.cpu.normal} />
          <StatRow label="Hard" record={stats.cpu.hard} />
        </div>

        <div className={styles.actions}>
          <button className={styles.closeBtn} onClick={onClose}>閉じる</button>
        </div>
      </div>
    </div>
  );
};
