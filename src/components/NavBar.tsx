import Link from "next/link";

export default function NavBar() {
  return (
    <span className="flex h-16 w-full items-center justify-between">
      <Link href="/" data-umami-event="NavBar - Home">
        <h1 className="select-none text-3xl text-primary">
          {process.env.NEXT_PUBLIC_PAGE_TITLE}
        </h1>
      </Link>

      {/* <div className="flex space-x-3">
        <Link
          href="/"
          className="hover:underline"
          data-umami-event="NavBar - Downloads"
        >
          Downloads
        </Link>
        <Link
          href="/instructions"
          className="hover:underline"
          data-umami-event="NavBar - Instructions"
        >
          Instructions
        </Link>
      </div> */}
    </span>
  );
}
