"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";

interface MobileMenuProps {
  navItems: Array<{ href: string; label: string }>;
}

const MobileMenu = ({ navItems }: MobileMenuProps) => {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">
            <Menu />
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-75 p-4">
          <nav className="flex flex-col space-y-4 mt-8">
            {navItems.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-lg font-medium"
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t pt-4 flex flex-col space-y-4">
              <Link href="/login">
                <Button className="w-full">Login</Button>
              </Link>

              <Link href="/register">
                <Button className="w-full" variant="secondary">
                  Register
                </Button>
              </Link>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;
