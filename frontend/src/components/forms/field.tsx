import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const fieldClass =
  "w-full border border-ink/20 bg-white px-4 py-3 text-sm text-ink placeholder:text-stone/70 focus:border-gold focus:outline-none";

export function TextField({
  label,
  name,
  required,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-data text-[11px] uppercase tracking-[0.18em] text-stone">
        {label}
        {required ? <span className="text-gold"> *</span> : null}
      </span>
      <input id={name} name={name} required={required} className={fieldClass} {...props} />
    </label>
  );
}

export function TextAreaField({
  label,
  name,
  required,
  rows = 5,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; name: string }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-data text-[11px] uppercase tracking-[0.18em] text-stone">
        {label}
        {required ? <span className="text-gold"> *</span> : null}
      </span>
      <textarea id={name} name={name} required={required} rows={rows} className={fieldClass} {...props} />
    </label>
  );
}

export function SelectField({
  label,
  name,
  required,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string; name: string }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-data text-[11px] uppercase tracking-[0.18em] text-stone">
        {label}
        {required ? <span className="text-gold"> *</span> : null}
      </span>
      <div className="relative">
        <select id={name} name={name} required={required} className={`${fieldClass} appearance-none pr-10`} {...props}>
          {children}
        </select>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute right-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone"
        >
          <path d="M5.5 9l6.5 6.5L18.5 9" />
        </svg>
      </div>
    </label>
  );
}

export function FormNotice({ status }: { status: { type: "success" | "error"; message: string } | null }) {
  if (!status) return null;

  return (
    <p
      role="status"
      className={`font-data border px-4 py-3 text-xs uppercase tracking-[0.14em] ${
        status.type === "success" ? "border-gold/60 text-gold" : "border-red-800/60 text-red-800"
      }`}
    >
      {status.message}
    </p>
  );
}
