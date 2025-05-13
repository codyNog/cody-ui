import { useEffect, useState } from "react";

/**
 * Custom hook to debounce a value.
 * The debounced value will only reflect the latest value when the useDebounce hook has not been called for the specified time period.
 * @template T The type of the value to debounce.
 * @param {T} value The value to debounce.
 * @param {number} [delay=500] The delay in milliseconds. Defaults to 500ms.
 * @returns {T} The debounced value.
 *
 * @example
 * ```tsx
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 300);
 *
 * useEffect(() => {
 *   // Perform search when debouncedSearchTerm changes
 *   if (debouncedSearchTerm) {
 *     performSearch(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 *
 * return <input type="text" onChange={(e) => setSearchTerm(e.target.value)} />;
 * ```
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
