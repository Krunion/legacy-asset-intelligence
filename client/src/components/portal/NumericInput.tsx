/**
 * NumericInput - A number input that clears "0" on focus and restores "0" on blur if empty.
 * Use this for all numeric inputs in portal tools.
 */

import { useState, useRef } from "react";

interface NumericInputProps {
  value: number | string;
  onChange: (value: number | string) => void;
  style?: React.CSSProperties;
  min?: number;
  max?: number;
  placeholder?: string;
  /** If true, treats value as string (for string-backed state) */
  stringMode?: boolean;
  /** Default value to restore on blur if empty. Defaults to 0 */
  defaultValue?: number | string;
}

export default function NumericInput({
  value,
  onChange,
  style,
  min,
  max,
  placeholder,
  stringMode = false,
  defaultValue,
}: NumericInputProps) {
  const [displayValue, setDisplayValue] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const resolvedDefault = defaultValue !== undefined ? defaultValue : (stringMode ? "0" : 0);

  const handleFocus = () => {
    // If the current value is 0 or "0", clear it so user can type fresh
    const currentVal = String(value);
    if (currentVal === "0" || currentVal === "") {
      setDisplayValue("");
    } else {
      setDisplayValue(currentVal);
    }
  };

  const handleBlur = () => {
    // If empty on blur, restore to default (0)
    if (displayValue === "" || displayValue === null) {
      if (stringMode) {
        onChange(String(resolvedDefault));
      } else {
        onChange(Number(resolvedDefault));
      }
    } else {
      // Commit the value
      if (stringMode) {
        onChange(displayValue);
      } else {
        const num = Number(displayValue);
        onChange(isNaN(num) ? Number(resolvedDefault) : num);
      }
    }
    setDisplayValue(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDisplayValue(val);

    // Also update parent in real-time for live previews
    if (stringMode) {
      onChange(val);
    } else {
      const num = Number(val);
      if (val === "" || val === "-") {
        // Don't update parent yet - wait for blur
      } else if (!isNaN(num)) {
        onChange(num);
      }
    }
  };

  // Show displayValue while focused, otherwise show the actual value
  const shown = displayValue !== null ? displayValue : String(value);

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="decimal"
      value={shown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      style={style}
      min={min}
      max={max}
      placeholder={placeholder || "0"}
    />
  );
}
