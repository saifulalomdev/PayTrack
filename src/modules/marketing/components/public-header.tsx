import { cn } from "@/lib/utils";
import { useState } from "react";
import { navItems } from "@/config/nav-items";
import { Button } from "@/components/ui/button";
import { AppBranding } from "@/components/brand";
import { ChevronRight, Menu, X } from "lucide-react";


export function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="w-full h-16 md:h-20 z-50 flex justify-between items-center px-6 md:px-10 lg:px-20 py-4 fixed top-0 left-0 bg-background/5 backdrop-blur-md border-b border-white/10">
        <AppBranding />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-8 xl:gap-13">
          {navItems.map(({ href, name }, index) => (
            <a
              key={index}
              href={href}
              className="font-medium text-white/70 hover:text-primary transition-all"
            >
              {name}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4 z-50">
          <LandingCTA className="hidden md:block" />

          {/* Mobile Toggle Button */}
          <Button
            variant="outline"
            size="icon-lg"
            aria-label="Toggle navigation menu"
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </header>

      {/* Mobile Nav and Overlay */}
      <nav
        className={cn(
          "fixed w-full h-screen z-40 bg-background/95 backdrop-blur-xl mt-16 transition-all duration-300 md:hidden",
          isOpen ? "opacity-100 left-0" : "opacity-0 -translate-x-full"
        )}
      >
        {navItems.map(({ href, name }) => (
          <a
            href={href}
            key={name}
            onClick={() => setIsOpen(false)}
            className="text-[16px] border-b flex justify-between items-center first:border-t border-white/20 w-full px-6 py-4 font-semibold text-white hover:text-primary transition-colors"
          >
            {name} <ChevronRight />
          </a>
        ))}
        <LandingCTA className="px-6 mt-5" />
      </nav>
    </>
  );
}


function LandingCTA({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-4 w-full border-white/10", className)}>
      <a href="/dashboard" className="w-full md:w-auto">
        <Button size="lg" className="w-full md:w-auto">
          Dashboard
        </Button>
      </a>
    </div>
  )
}