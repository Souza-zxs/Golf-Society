export function ArticleBody({ content }: { content: string }) {
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="flex flex-col gap-6">
      {paragraphs.map((paragraph, index) => {
        if (paragraph.startsWith("> ")) {
          return (
            <blockquote
              key={index}
              className="font-display my-2 border-l-2 border-gold py-1 pl-6 text-2xl italic leading-snug tracking-tight text-gold sm:text-3xl"
            >
              {paragraph.slice(2)}
            </blockquote>
          );
        }

        return (
          <p
            key={index}
            className={`whitespace-pre-wrap text-base leading-[1.8] text-ink/85 ${
              index === 0
                ? "first-letter:font-display first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-7xl first-letter:italic first-letter:leading-[0.8] first-letter:text-gold"
                : ""
            }`}
          >
            {paragraph}
          </p>
        );
      })}
    </div>
  );
}
