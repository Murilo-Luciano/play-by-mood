import Link from "next/link";
import { buttonVariants } from "../ui/button";

export default function ErrorPage() {
  return (
    <main className="flex flex-col p-4 items-center">
      <div className="flex flex-col items-center gap-4">
        <TriangleAlertIcon className="h-16 w-16 text-gray-500 dark:text-gray-400" />
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Oops, something went wrong!</h1>
          <p className="text-gray-500 dark:text-gray-400">
            We're sorry, but it looks like there was an error. Please try again
            later or contact us if the issue persists.
          </p>
        </div>
        <Link
          href="/"
          prefetch={false}
          className={buttonVariants({ variant: "default" })}
        >
          Return to Homepage
        </Link>
      </div>
    </main>
  );
}

function TriangleAlertIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
