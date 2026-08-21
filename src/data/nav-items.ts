import { 
  LayoutDashboard, 
  ShieldUser,
  Users,
} from "lucide-react";
import type { en } from "@/i18n/en";

export interface NavItem {
  href: string;
  key: keyof typeof en.common;
  Icon: typeof LayoutDashboard;
}

export const adminNavItems: NavItem[] = [
  {
    href: "/",
    key: "dashboard",
    Icon: LayoutDashboard,
  },
  {
    href: "/customers",
    key: "customers",
    Icon: Users,
  },
  {
    href: "/staff",
    key: "staff",
    Icon: ShieldUser,
  },
];