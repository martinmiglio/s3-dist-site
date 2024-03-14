import Link from "next/link";

export default function Footer() {
  const authors: { name: string; url?: string }[] = [
    {
      name: process.env.NEXT_PUBLIC_AUTHOR ?? "",
      url: process.env.NEXT_PUBLIC_AUTHOR_LINK,
    },
  ];

  return (
    <div className="flex w-full flex-row flex-wrap items-center justify-between py-8 text-sm text-primary">
      <div>
        © {new Date().getFullYear()}{" "}
        {authors.map((author, index) => (
          <span key={author.name}>
            {index > 0 && index < authors.length - 1 && ", "}
            {index > 0 && index === authors.length - 1 && " and "}
            {author.url ? (
              <Link
                href={author.url}
                className="hover:underline"
                data-umami-event={`Footer - ${author.name}`}
              >
                {author.name}
              </Link>
            ) : (
              author.name
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
