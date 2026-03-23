import Link from "next/link";
import MobileMenu from "./MobileMenu";
import NavbarAuthButtons from "./NavbarAuthButtons";

const PublicNavbar = () => {
  const navItems = [
    { href: "/events", label: "Explore Events" },
    { href: "/host", label: "Become a Host" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          EventsHub
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-2">
          <NavbarAuthButtons />
        </div>

        {/* Mobile Menu */}
        <MobileMenu navItems={navItems} />
      </div>
    </header>
  );
};

export default PublicNavbar;
