import { Link } from "@heroui/link";

export function Footer() {
  return (
    <footer className="w-full flex items-center justify-center py-3">
      <Link
        isExternal
        className="flex items-center gap-1 text-current"
        href=""
        title="heroui.com homepage"
      >
        <span className="text-default-600">Made for</span>
        <p className="text-primary">Skillset Hackathon</p>
      </Link>
    </footer>
  );
}
