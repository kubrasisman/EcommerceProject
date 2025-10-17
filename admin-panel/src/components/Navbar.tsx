import { useState, type JSX } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Menu } from "lucide-react";

type MenuKey = "product" | "order" | "cart" | "customer" | null;

export default function Navbar(): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<MenuKey>(null);

  const toggleDropdown = (menu: MenuKey) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight hover:text-blue-400">
          🛍️ E-Shop
        </Link>

        {/* Hamburger (mobile) */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu size={28} />
        </button>

        {/* Menu Items */}
        <ul
          className={`md:flex md:space-x-6 absolute md:static top-16 left-0 w-full md:w-auto bg-gray-900 md:bg-transparent transition-all duration-300 ease-in-out ${
            isOpen ? "block" : "hidden"
          }`}
        >
          {/* Product */}
          <li className="relative group">
            <button
              onClick={() => toggleDropdown("product")}
              className="flex items-center gap-1 py-2 px-4 hover:text-blue-400 w-full md:w-auto"
            >
              Product <ChevronDown size={16} />
            </button>
            {openDropdown === "product" && (
              <ul className="absolute bg-gray-800 shadow-md rounded-md mt-2 w-40">
                <li>
                  <Link to="/products" className="block px-4 py-2 hover:bg-gray-700">
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/categories" className="block px-4 py-2 hover:bg-gray-700">
                    Categories
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Order */}
          <li className="relative group">
            <button
              onClick={() => toggleDropdown("order")}
              className="flex items-center gap-1 py-2 px-4 hover:text-blue-400 w-full md:w-auto"
            >
              Order <ChevronDown size={16} />
            </button>
            {openDropdown === "order" && (
              <ul className="absolute bg-gray-800 shadow-md rounded-md mt-2 w-44">
                <li>
                  <Link to="/orders" className="block px-4 py-2 hover:bg-gray-700">
                    Orders
                  </Link>
                </li>
                <li>
                  <Link to="/orderentries" className="block px-4 py-2 hover:bg-gray-700">
                    Order Entries
                  </Link>
                </li>
                <li>
                  <Link to="/payments" className="block px-4 py-2 hover:bg-gray-700">
                    Payment
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Cart */}
          <li className="relative group">
            <button
              onClick={() => toggleDropdown("cart")}
              className="flex items-center gap-1 py-2 px-4 hover:text-blue-400 w-full md:w-auto"
            >
              Cart <ChevronDown size={16} />
            </button>
            {openDropdown === "cart" && (
              <ul className="absolute bg-gray-800 shadow-md rounded-md mt-2 w-40">
                <li>
                  <Link to="/cart" className="block px-4 py-2 hover:bg-gray-700">
                    Cart
                  </Link>
                </li>
                <li>
                  <Link to="/cartentries" className="block px-4 py-2 hover:bg-gray-700">
                    Cart Entries
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Customer */}
          <li className="relative group">
            <button
              onClick={() => toggleDropdown("customer")}
              className="flex items-center gap-1 py-2 px-4 hover:text-blue-400 w-full md:w-auto"
            >
              Customer <ChevronDown size={16} />
            </button>
            {openDropdown === "customer" && (
              <ul className="absolute bg-gray-800 shadow-md rounded-md mt-2 w-44">
                <li>
                  <Link to="/customers" className="block px-4 py-2 hover:bg-gray-700">
                    Customers
                  </Link>
                </li>
                <li>
                  <Link to="/address" className="block px-4 py-2 hover:bg-gray-700">
                    Address
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
