"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiHome,
  FiShoppingBag,
  FiMessageSquare,
  FiTruck,
  FiLogOut,
  FiLayout,
  FiXCircle,
  FiUser,
} from "react-icons/fi";
import Image from "next/image";
import CartIcon from "./CartIcon";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";
import { Product } from "@/types";
import Swal from "sweetalert2";

interface NavLink {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navLinks: NavLink[] = [
  { name: "Home", href: "/", icon: FiHome },
  { name: "Shop", href: "/shop", icon: FiShoppingBag },
  { name: "Contact", href: "/contact", icon: FiMessageSquare },
  { name: "Track Order", href: "/track-order", icon: FiTruck },
];

const UserAvatar = ({
  photoURL,
  name,
  size = 28,
}: {
  photoURL?: string | null;
  name?: string | null;
  size?: number;
}) => {
  const [imgError, setImgError] = useState(false);

  if (photoURL && !imgError) {
    return (
      <img
        src={photoURL}
        alt={name || "User"}
        className={`w-7 h-7 rounded-full object-cover`}
        onError={() => setImgError(true)}
      />
    );
  }
  const initial = name?.charAt(0).toUpperCase() || "U";
  return (
    <div className="w-7 h-7 bg-primary-gold rounded-full flex items-center justify-center text-white text-xs font-bold">
      {initial}
    </div>
  );
};

const getProductImage = (product: Product): string => {
  if (product.images && product.images.length > 0 && product.images[0])
    return product.images[0];
  if (product.image && typeof product.image === "string") return product.image;
  return "/placeholder.jpg";
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const { user, loading, logout, userRole } = useAuth();
  const { products } = useProducts();

  const trendingProducts = useMemo(() => {
    if (!products.length) return [];
    return products.filter((p) => p.rating && p.rating >= 4.5).slice(0, 5);
  }, [products]);

  const searchResults = useMemo(() => {
    if (searchQuery.trim() === "" || !products.length) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .slice(0, 5);
  }, [searchQuery, products]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#D98A2B",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      await logout();
      setIsMenuOpen(false);
      router.push("/");

      Swal.fire({
        title: "Logged Out!",
        text: "You have been successfully logged out.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleResultClick = (productId: string | undefined) => {
    if (productId && productId !== "undefined") {
      router.push(`/product/${productId}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const isActive = (href: string): boolean => {
    if (href === "/") return pathname === href;
    return pathname.startsWith(href);
  };

  const getUserName = (): string => {
    if (user?.displayName) return user.displayName.split(" ")[0];
    if (user?.email) return user.email?.split("@")[0] || "User";
    return "User";
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Main Row */}
        <div className="flex items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/icon.png"
              alt="Solid Bazzar"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
              priority
            />
            <h1 className="text-base md:text-xl font-bold text-primary-gold whitespace-nowrap">
              Solid Bazzar
            </h1>
          </Link>

          {/* Desktop Search */}
          <div
            className="hidden md:block flex-1 max-w-md relative"
            ref={searchRef}
          >
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search products..."
                className="w-full px-4 py-2 pl-10 pr-8 border border-gray-300 rounded-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-primary-gold transition text-sm"
              />
              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiXCircle size={16} />
                </button>
              )}
            </form>

            {/* Search Dropdown */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                {searchQuery && searchResults.length > 0 && (
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs text-gray-500 font-medium">
                      Search Results
                    </div>
                    {searchResults.map((product) => (
                      <button
                        key={product._id}
                        onClick={() => handleResultClick(product._id)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3"
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden shrink-0 relative">
                          <img
                            src={getProductImage(product)}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) =>
                              ((e.target as HTMLImageElement).src =
                                "/placeholder.jpg")
                            }
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">
                            {product.name}
                          </p>
                          <p className="text-xs text-primary-gold">
                            ৳{product.price}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {!searchQuery && trendingProducts.length > 0 && (
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs text-gray-500 font-medium">
                      Trending Products
                    </div>
                    {trendingProducts.map((product) => (
                      <button
                        key={product._id}
                        onClick={() => handleResultClick(product._id)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-3"
                      >
                        <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden shrink-0 relative">
                          <img
                            src={getProductImage(product)}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) =>
                              ((e.target as HTMLImageElement).src =
                                "/placeholder.jpg")
                            }
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">
                            {product.name}
                          </p>
                          <p className="text-xs text-primary-gold">
                            ৳{product.price}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {searchQuery && searchResults.length === 0 && (
                  <div className="p-4 text-center">
                    <p className="text-gray-500 text-sm">No products found</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`transition font-medium text-sm ${
                  isActive(link.href)
                    ? "text-primary-gold"
                    : "text-gray-700 hover:text-primary-gold"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Mobile Search */}
            <button
              className="md:hidden text-gray-600 hover:text-primary-gold transition"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <FiSearch size={18} />
            </button>

            <Link href="/cart">
              <CartIcon />
            </Link>

            {/* User Section */}
            {!loading && (
              <>
                {user ? (
                  <div className="flex items-center gap-2">
                    {/* 🔥 ADMIN: Dashboard Link | USER: Profile Link */}
                    {userRole === "admin" ? (
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 bg-primary-gold/10 px-3 py-1.5 rounded-md hover:bg-primary-gold/20 transition"
                      >
                        <FiLayout size={18} className="text-primary-gold" />
                        <span className="text-sm font-medium text-gray-700 hidden sm:block">
                          Dashboard
                        </span>
                      </Link>
                    ) : (
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 bg-primary-gold/10 px-2 py-1.5 rounded-md hover:bg-primary-gold/20 transition"
                      >
                        <UserAvatar
                          photoURL={user.photoURL}
                          name={user.displayName}
                        />
                        <span className="text-sm font-medium text-gray-700 hidden sm:block">
                          {getUserName()}
                        </span>
                      </Link>
                    )}

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="text-red-500 hover:text-red-600 transition p-1.5 hover:bg-red-50 rounded-md"
                    >
                      <FiLogOut size={18} />
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="hidden sm:flex items-center bg-primary-gold px-3 py-1.5 rounded-md text-white transition font-medium text-sm"
                  >
                    <FiUser size={14} className="mr-1" />
                    <span>Login</span>
                  </Link>
                )}
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-gray-600 hover:text-primary-gold"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        {isSearchOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-100">
            <form onSubmit={handleSearch} className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 pl-10 pr-8 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-primary-gold transition text-sm"
                autoFocus
              />
              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <FiXCircle size={14} />
                </button>
              )}
            </form>

            <div className="max-h-80 overflow-y-auto space-y-1">
              {searchQuery && searchResults.length > 0 && (
                <>
                  <div className="px-3 py-1 text-xs text-gray-500 font-medium">
                    Search Results
                  </div>
                  {searchResults.map((product) => (
                    <button
                      key={product._id}
                      onClick={() => handleResultClick(product._id)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center gap-3"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded overflow-hidden shrink-0 relative">
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) =>
                            ((e.target as HTMLImageElement).src =
                              "/placeholder.jpg")
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-xs text-primary-gold">
                          ৳{product.price}
                        </p>
                      </div>
                    </button>
                  ))}
                </>
              )}
              {!searchQuery && trendingProducts.length > 0 && (
                <>
                  <div className="px-3 py-1 text-xs text-gray-500 font-medium">
                    Trending Products
                  </div>
                  {trendingProducts.map((product) => (
                    <button
                      key={product._id}
                      onClick={() => handleResultClick(product._id)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center gap-3"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded overflow-hidden shrink-0 relative">
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) =>
                            ((e.target as HTMLImageElement).src =
                              "/placeholder.jpg")
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-xs text-primary-gold">
                          ৳{product.price}
                        </p>
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-100 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block py-2 text-gray-700 hover:text-primary-gold transition"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {!loading && !user && (
              <Link
                href="/login"
                className="block w-full bg-primary-gold text-white py-2 rounded-md text-center mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
