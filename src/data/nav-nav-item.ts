import { 
  LayoutDashboard, 
  ShieldUser,
  Users,
} from "lucide-react";

export const adminNavItems = [
  {
    href: "/",
    name: "Dashboard",
    Icon: LayoutDashboard,
  },
  {
    href: "/customers",
    name: "Customers",
    Icon: Users,
  },
  {
    href: "/staff",
    name: "Staff",
    Icon: ShieldUser,
  },
];