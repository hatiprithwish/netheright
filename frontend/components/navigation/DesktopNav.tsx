import Link from "next/link";
import { HeaderLinks } from "./utils";

export default function DesktopNav() {
  return (
    <div className="hidden md:flex items-center gap-6">
      {HeaderLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
