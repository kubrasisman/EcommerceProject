import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  LogIn,
  LogOut,
  User,
  Home,
  Settings,
  FileText,
  ShoppingCart,
  CreditCard,
} from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

const MENU: MenuItem[] = [
  {
    id: "product",
    label: "Product",
    icon: <Home size={16} />,
    children: [
      { id: "products", label: "Products", icon: <FileText size={16} />, path: "/products" },
      { id: "categories", label: "Categories", icon: <FileText size={16} />, path: "/categories" },
    ],
  },
  {
    id: "order",
    label: "Order",
    icon: <ShoppingCart size={16} />,
    children: [
      { id: "orders", label: "Orders", icon: <FileText size={16} />, path: "/orders" },
      { id: "orderentries", label: "Order Entries", icon: <FileText size={16} />, path: "/order-entries" },
      { id: "payments", label: "Payments", icon: <CreditCard size={16} />, path: "/payments" },
    ],
  },
  {
    id: "cart",
    label: "Cart",
    icon: <ShoppingCart size={16} />,
    children: [
      { id: "cart", label: "Cart", icon: <FileText size={16} />, path: "/cart" },
      { id: "cartentries", label: "Cart Entries", icon: <FileText size={16} />, path: "/cart-entries" },
    ],
  },
  {
    id: "customer",
    label: "Customer",
    icon: <User size={16} />,
    children: [
      { id: "customers", label: "Customers", icon: <FileText size={16} />, path: "/customers" },
      { id: "address", label: "Address", icon: <FileText size={16} />, path: "/addresses" },
    ],
  },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const toggleMenu = (id: string) => setOpenMenu(openMenu === id ? null : id);

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`flex flex-col transition-all duration-200 bg-white/60 backdrop-blur border-r border-slate-200 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex items-center gap-3 p-4">
          <button
            aria-label="Toggle menu"
            onClick={() => setCollapsed((c) => !c)}
            className="p-2 rounded-md hover:bg-slate-100"
          >
            <Menu size={18} />
          </button>
          {!collapsed && <h3 className="text-lg font-semibold">Navigation</h3>}
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {MENU.map((m) => (
            <div key={m.id}>
              <button
                onClick={() => toggleMenu(m.id)}
                className={`w-full flex items-center gap-3 rounded-md p-2 hover:bg-slate-100 transition-colors text-sm ${
                  openMenu === m.id ? "bg-sky-50 text-sky-700" : "text-slate-700"
                }`}
              >
                <div className="flex items-center justify-center w-6 h-6">{m.icon}</div>
                {!collapsed && <span className="truncate">{m.label}</span>}
              </button>

              {m.children && openMenu === m.id && !collapsed && (
                <div className="pl-8 flex flex-col gap-1 mt-1">
                  {m.children.map((child) => (
                    <NavLink
                      key={child.id}
                      to={child.path || "#"}
                      className={({ isActive }) =>
                        `w-full flex items-center gap-2 rounded-md p-2 hover:bg-slate-100 text-sm ${
                          isActive ? "bg-sky-100 text-sky-700" : "text-slate-700"
                        }`
                      }
                    >
                      <div className="flex items-center justify-center w-5 h-5">{child.icon}</div>
                      <span className="truncate">{child.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4">
          <Card className="shadow-sm">
            <CardContent className="flex items-center gap-3">
              <Avatar />
              {!collapsed && (
                <div>
                  <div className="text-sm font-medium">Admin User</div>
                  <div className="text-xs text-slate-500">admin@example.com</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-6 py-3 border-b bg-white/50 backdrop-blur">
          <h1 className="text-lg font-bold">Admin Panel</h1>
          <div className="flex items-center gap-4">
            {!loggedIn ? (
              <Button onClick={() => setLoggedIn(true)} variant="ghost" size="sm">
                <LogIn className="mr-2" /> Login
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-md p-1 hover:bg-slate-100">
                    <Avatar />
                    <span className="hidden md:inline text-sm">Fatih Gün</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLoggedIn(false)}>
                    <LogOut size={14} className="mr-2 inline" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>

        <main className="p-6 bg-slate-50 flex-1">
          <Outlet />
        </main>

        <footer className="p-4 text-center text-xs text-slate-500 border-t">
          © {new Date().getFullYear()} Your Company
        </footer>
      </div>
    </div>
  );
}
