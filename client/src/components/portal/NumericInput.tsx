/**
 * NumericInput - Enhanced number input with:
 * - Clears "0" on focus, restores "0" on blur if empty
 * - Currency formatting (comma-separated) on blur for dollar fields
 * - Validation feedback (red border + message) for out-of-range values
 */

import { useState, useRef, useMemo } from "react";

interface NumericInputProps {
  value: number | string;
  onChange: (value: number | string) => void;
  style?: React.CSSProperties;
  className?: string;
  id?: string;
  min?: number;
  max?: number;
  placeholder?: string;
  /** If true, treats value as string (for string-backed state) */
  stringMode?: boolean;
  /** Default value to restore on blur if empty. Defaults to 0 */
  defaultValue?: number | string;
  /** If true, formats the display value with commas on blur (e.g., 1,500,000) */
  currency?: boolean;
  /** If true, shows a $ prefix in the formatted display */
  showDollarSign?: boolean;
  /** Validation label shown when value is out of range (e.g., "Must be 0-50%") */
  validationMessage?: string;
}

function formatWithCommas(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return String(value);
  // Handle decimals
  const parts = num.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

function stripFormatting(value: string): string {
  return value.replace(/[$,\s]/g, "");
}

export default function NumericInput({
  value,
  onChange,
  style,
  className,
  id,
  min,
  max,
  placeholder,
  stringMode = false,
  defaultValue,
  currency = false,
  showDollarSign = false,
  validationMessage,
}: NumericInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const resolvedDefault = defaultValue !== undefined ? defaultValue : (stringMode ? "0" : 0);

  // Determine if value is out of range for validation
  const numericValue = useMemo(() => {
    const raw = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(raw as number) ? 0 : (raw as number);
  }, [value]);

  const isOutOfRange = useMemo(() => {
    if (min !== undefined && numericValue < min) return true;
    if (max !== undefined && numericValue > max) return true;
    return false;
  }, [numericValue, min, max]);

  const handleFocus = () => {
    setIsFocused(true);
    // Strip formatting and show raw number for editing
    const currentVal = stripFormatting(String(value));
    if (currentVal === "0" || currentVal === "") {
      setDisplayValue("");
    } else {
      setDisplayValue(currentVal);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // If empty on blur, restore to default (0)
    if (displayValue === "" || displayValue === null) {
      if (stringMode) {
        onChange(String(resolvedDefault));
      } else {
        onChange(Number(resolvedDefault));
      }
    } else {
      // Commit the value
      const cleaned = stripFormatting(displayValue);
      if (stringMode) {
        onChange(cleaned);
      } else {
        const num = Number(cleaned);
        onChange(isNaN(num) ? Number(resolvedDefault) : num);
      }
    }
    setDisplayValue(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Allow digits, decimal point, minus sign, and commas during typing
    const cleaned = raw.replace(/[^0-9.\-]/g, "");
    setDisplayValue(cleaned);

    // Also update parent in real-time for live previews
    if (stringMode) {
      onChange(cleaned);
    } else {
      const num = Number(cleaned);
      if (cleaned === "" || cleaned === "-") {
        // Don't update parent yet - wait for blur
      } else if (!isNaN(num)) {
        onChange(num);
      }
    }
  };

  // Determine what to show
  let shown: string;
  if (isFocused && displayValue !== null) {
    // While editing, show raw number
    shown = displayValue;
  } else {
    // When not focused, format with commas if currency mode
    const rawVal = String(value);
    if (currency && rawVal && rawVal !== "0" && rawVal !== "") {
      shown = (showDollarSign ? "$" : "") + formatWithCommas(rawVal);
    } else {
      shown = rawVal;
    }
  }

  // Validation styling
  const validationBorderColor = isOutOfRange ? "#EF4444" : undefined;
  const mergedStyle: React.CSSProperties = {
    ...style,
    ...(isOutOfRange ? { borderColor: validationBorderColor, boxShadow: "0 0 0 1px #EF4444" } : {}),
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        ref={inputRef}
        id={id}
        type="text"
        inputMode="decimal"
        value={shown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        style={mergedStyle}
        className={className}
        placeholder={placeholder || "0"}
      />
      {isOutOfRange && validationMessage && (
        <span
          style={{
            display: "block",
            fontSize: "0.75rem",
            color: "#EF4444",
            marginTop: "0.25rem",
            fontWeight: 500,
          }}
        >
          {validationMessage}
        </span>
      )}
    </div>
  );
}
