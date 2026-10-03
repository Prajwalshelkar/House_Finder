"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "nagpur_homes_saved_properties";

export function useSavedProperties() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedIds(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to read saved properties:", e);
    }

    const handleStorageChange = () => {
      try {
        const updated = localStorage.getItem(STORAGE_KEY);
        if (updated) setSavedIds(JSON.parse(updated));
      } catch (e) {}
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("nagpur_homes_saved_updated", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("nagpur_homes_saved_updated", handleStorageChange);
    };
  }, []);

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        window.dispatchEvent(new Event("nagpur_homes_saved_updated"));
      } catch (e) {}
      return next;
    });
  };

  const isSaved = (id: string) => savedIds.includes(id);

  return {
    savedIds,
    toggleSave,
    isSaved,
    count: isClient ? savedIds.length : 0,
  };
}
