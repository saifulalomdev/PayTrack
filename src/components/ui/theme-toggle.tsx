// src/components/ui/theme-toggle.tsx
import { actions } from "astro:actions";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";

interface ThemeToggleProps {
  currentTheme: "light" | "dark";
}

export function ThemeToggle({ currentTheme }: ThemeToggleProps) {
  const { execute, isLoading } = useAction(actions.theme.setTheme, {
    successMessage: "Theme updated",
    onSuccess: () => window.location.reload(),
  });

  const next = currentTheme === "dark" ? "light" : "dark";

  return (
    <Button variant="outline" size="icon" disabled={isLoading} onClick={() => execute({ theme: next })}>
      {currentTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}