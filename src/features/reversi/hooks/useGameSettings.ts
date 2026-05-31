import { useState, useEffect } from "react";
import { GameSettings } from "../types/reversi";

const SETTINGS_STORAGE_KEY = "reversi_game_settings";

const DEFAULT_SETTINGS: GameSettings = {
  mode: "cpu",
  difficulty: "normal",
  playerColor: "black",
};

/**
 * Hook to manage game settings with persistence to localStorage.
 */
export function useGameSettings() {
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed && parsed.mode) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setSettings(parsed as GameSettings);
        }
      }
    } catch (e) {
      console.error("Failed to load settings", e);
    }
    setIsLoaded(true);
  }, []);

  const updateSettings = (newSettings: Partial<GameSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save settings", e);
    }
  };

  return {
    settings,
    updateSettings,
    isLoaded,
  };
}
