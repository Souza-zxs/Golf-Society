import { ChevronDownIcon } from "./icons";

export function StatusSelect<T extends string>({
  value,
  options,
  labels,
  disabled,
  onChange,
}: {
  value: T;
  options: readonly T[];
  labels: Record<string, string>;
  disabled?: boolean;
  onChange: (value: T) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value as T)}
        className="font-data appearance-none border border-ink/20 bg-white py-1.5 pl-3 pr-7 text-[11px] uppercase tracking-[0.1em] text-ink transition-colors focus:border-gold focus:outline-none disabled:opacity-50"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {labels[option] ?? option}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-stone" />
    </div>
  );
}
