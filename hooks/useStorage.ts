import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(key)
      .then((stored) => {
        if (stored !== null) {
          try { setValue(JSON.parse(stored)); } catch {}
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [key]);

  const set = useCallback((newVal: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const next = typeof newVal === 'function' ? (newVal as (p: T) => T)(prev) : newVal;
      AsyncStorage.setItem(key, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, [key]);

  return [value, set, loaded] as const;
}
