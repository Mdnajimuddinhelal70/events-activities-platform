"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const NavbarAuthButtons = () => {
  return (
    <div className="flex items-center gap-2">
      <Link href="/login">
        <Button variant="ghost">Login</Button>
      </Link>

      <Link href="/register">
        <Button>Register</Button>
      </Link>
    </div>
  );
};

export default NavbarAuthButtons;
