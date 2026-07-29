import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

const fieldClass =
  "w-full border border-ink/20 bg-transparent px-4 py-3 text-sm text-ink placeholder:text-stone/70 focus:border-gold focus:outline-none";

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
