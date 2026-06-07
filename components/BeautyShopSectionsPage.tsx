"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  ChevronRight,
  CreditCard,
  Truck,
  Shield,
  RefreshCw,
  Zap,
  Gift,
  Sparkles,
  Star,
  ArrowRight,
  Globe,
} from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faWhatsapp } from "@fortawesome/free-brands-svg-icons";

import { Product } from "@/types";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";

// ===== Section Component =====
const Section = ({
  title,
  icon,
  products: sectionProducts,
  bgColor = "white",
  onViewAll,
}: {
  title: string;
  icon: React.ReactNode;
  products: Product[];
  bgColor?: "white" | "gradient";
  onViewAll: () => void;
}) => (
  <section
    className={`py-12 md:py-20 transition-all duration-300 ${
      bgColor === "gradient"
        ? "bg-gradient-to-br from-indigo-50/50 via-white to-orange-50/50"
        : "bg-white"
    }`}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-row justify-between items-end mb-8 md:mb-12 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2.5 md:gap-3 mb-2">
            <div className="p-2 bg-orange-50 rounded-xl text-orange-600 shadow-xs ring-1 ring-orange-100">
              {icon}
            </div>
            <h2 className="text-xl md:text-3xl font-extrabold tracking-tight text-slate-800">
              {title}
            </h2>
          </div>
        </div>
        <button
          onClick={onViewAll}
          className="group flex items-center gap-1.5 text-orange-600 hover:text-white font-bold transition-all bg-orange-50 hover:bg-orange-600 px-4 py-2 rounded-full text-xs md:text-sm shadow-xs hover:shadow-md"
        >
          View All
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {sectionProducts.length > 0 ? (
          sectionProducts.slice(0, 4).map((product) => (
            <div key={product._id || product.id} className="h-full">
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-slate-400 text-sm bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            No products available right now.
          </div>
        )}
      </div>
    </div>
  </section>
);

// ক্যাটাগরির জন্য কালার জেনারেটর
const categoryColors = [
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-pink-600",
  "from-emerald-500 to-teal-600",
  "from-pink-500 to-rose-600",
  "from-orange-500 to-red-600",
  "from-amber-500 to-yellow-600",
  "from-cyan-500 to-blue-600",
  "from-lime-500 to-green-600",
  "from-violet-500 to-purple-600",
  "from-rose-500 to-pink-600",
];

export default function MegaEcommercePage() {
  const router = useRouter();
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dynamicCategories, setDynamicCategories] = useState<
    Array<{ name: string; count: number; image: string; color: string }>
  >([]);

  // ডিফল্ট ইমেজ ফাংশন (প্রথমে ডিক্লেয়ার করুন)
  const getDefaultImageForCategory = (category: string) => {
    const defaultImages: Record<string, string> = {
      Electronics:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=400&auto=format&fit=crop",
      Fashion:
        "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=400&auto=format&fit=crop",
      "Home & Living":
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=400&auto=format&fit=crop",
      Beauty:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=400&auto=format&fit=crop",
      Sports:
        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=400&auto=format&fit=crop",
      "Toys & Kids":
        "https://images.unsplash.com/photo-1558060370-d644479a6d0b?q=80&w=400&auto=format&fit=crop",
      Accessories:
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=400&auto=format&fit=crop",
      Grocery:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop",
    };
    return (
      defaultImages[category] ||
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=400&auto=format&fit=crop"
    );
  };

  // প্রোডাক্ট থেকে ইউনিক ক্যাটাগরি বের করা (এখন আগে ডিক্লেয়ার করা হয়েছে)
  const generateCategories = (products: Product[]) => {
    const categoryMap = new Map<
      string,
      { name: string; count: number; image: string }
    >();

    products.forEach((product) => {
      const categoryName = product.category || "Uncategorized";
      if (!categoryMap.has(categoryName)) {
        categoryMap.set(categoryName, {
          name: categoryName,
          count: 0,
          image: product.image || getDefaultImageForCategory(categoryName),
        });
      }
      const existing = categoryMap.get(categoryName)!;
      existing.count++;
      categoryMap.set(categoryName, existing);
    });

    const categories = Array.from(categoryMap.values()).map((cat, index) => ({
      ...cat,
      color: categoryColors[index % categoryColors.length],
    }));

    setDynamicCategories(categories);
  };

  // MongoDB থেকে লাইভ প্রোডাক্ট ডেটা ফেচ করা
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          const activeProducts = data.filter(
            (p: Product) => p.status === "Active",
          );
          setDbProducts(activeProducts);
          generateCategories(activeProducts);
        }
      } catch (error) {
        console.error("Error fetching homepage products:", error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  const trendingProducts = dbProducts
    .filter((p) => (p.rating ?? 5) >= 4.2)
    .slice(0, 8);
  const specialDeals = dbProducts
    .filter((p) => p.discount && p.discount > 10)
    .slice(0, 8);
  const newProducts = [...dbProducts].reverse().slice(0, 8);
  const bestSellers = dbProducts
    .filter((p) => p.stock && p.stock < 100)
    .slice(0, 8);

  const goToShopPage = () => router.push("/shop");

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 antialiased">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white shadow-inner">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.15),transparent_45%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/10 shadow-sm">
              <span className="text-base">🚀</span>
              <span className="text-xs md:text-sm font-semibold tracking-wide uppercase text-orange-400">
                Mega E‑commerce – All in One Hub
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight leading-tight">
              Shop Everything,{" "}
              <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                One Place
              </span>
            </h1>

            <p className="text-base md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
              Discover top-tier Electronics, Fashion, Home Decor, Beauty
              essentials, and Sports gear at unbeatable wholesale prices.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-14">
              <button
                onClick={goToShopPage}
                className="group w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-orange-500/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-base"
              >
                <ShoppingBag className="w-5 h-5" />
                Shop Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={goToShopPage}
                className="w-full sm:w-auto border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white hover:text-slate-900 px-8 py-4 rounded-full font-bold transition-all text-base"
              >
                View Hot Offers
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-white/10 max-w-3xl mx-auto">
              {[
                { num: "500+", label: "Premium Brands" },
                { num: `${dbProducts.length}+`, label: "Live Items" },
                { num: "98%", label: "Happy Customers" },
                { num: "100+", label: "Cities Covered" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="text-center p-2 rounded-xl bg-white/2"
                >
                  <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent">
                    {stat.num}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DYNAMIC CATEGORIES SECTION */}
      {dynamicCategories.length > 0 && (
        <section className="py-14 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-10 md:mb-14">
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-slate-500 mt-2 text-sm md:text-base">
              {dynamicCategories.length} different categories to explore
            </p>
            <div className="h-1 w-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mt-4" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {dynamicCategories.slice(0, 10).map((category, index) => (
              <div
                key={index}
                onClick={() =>
                  router.push(
                    `/shop?category=${encodeURIComponent(category.name)}`,
                  )
                }
                className="group relative bg-white rounded-2xl p-5 flex flex-col items-center justify-center transition-all duration-300 cursor-pointer border border-slate-100 shadow-sm hover:shadow-xl hover:border-orange-100"
              >
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center overflow-hidden shadow-inner border border-slate-100 relative mb-4">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="80px"
                    className="object-cover rounded-full transition-transform duration-500 group-hover:scale-110"
                    unoptimized
                  />
                </div>
                <p className="text-sm font-bold text-slate-700 text-center group-hover:text-orange-600 transition-colors line-clamp-1">
                  {category.name}
                </p>
                <span className="mt-1 inline-block px-2.5 py-0.5 text-[11px] font-medium bg-slate-50 text-slate-500 rounded-full group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                  {category.count} Items
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* DYNAMIC PRODUCT SECTIONS */}
      {loading ? (
        <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-semibold animate-pulse">
            Loading Curated Products...
          </p>
        </div>
      ) : (
        <>
          {trendingProducts.length > 0 && (
            <Section
              title="Trending Now"
              icon={<Zap className="w-5 h-5" />}
              products={trendingProducts}
              onViewAll={goToShopPage}
            />
          )}
          {specialDeals.length > 0 && (
            <Section
              title="Special Deals"
              icon={<Gift className="w-5 h-5" />}
              products={specialDeals}
              bgColor="gradient"
              onViewAll={goToShopPage}
            />
          )}
          {newProducts.length > 0 && (
            <Section
              title="New Arrivals"
              icon={<Sparkles className="w-5 h-5" />}
              products={newProducts}
              onViewAll={goToShopPage}
            />
          )}
          {bestSellers.length > 0 && (
            <Section
              title="Best Sellers"
              icon={<Star className="w-5 h-5 text-amber-500 fill-amber-500" />}
              products={bestSellers}
              bgColor="gradient"
              onViewAll={goToShopPage}
            />
          )}
        </>
      )}

      {/* FEATURES */}
      <section className="py-14 md:py-20 bg-white border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                icon: Truck,
                title: "Cash on Delivery",
                desc: "Pay securely at your doorstep",
              },
              {
                icon: Shield,
                title: "100% Original",
                desc: "Guaranteed authentic products",
              },
              {
                icon: RefreshCw,
                title: "Easy Return",
                desc: "Hassle-free 7 days policy",
              },
              {
                icon: CreditCard,
                title: "Secure Payment",
                desc: "Encrypted & multi-layered protection",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group p-5 text-center transition-all duration-300"
              >
                <div className="w-14 h-14 bg-slate-50 group-hover:bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 group-hover:border-orange-100 transition-all transform group-hover:scale-105">
                  <feature.icon className="w-6 h-6 text-slate-700 group-hover:text-orange-600 transition-colors" />
                </div>
                <h3 className="text-sm md:text-base font-bold text-slate-800 mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONNECT WITH US */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-indigo-50/20 to-orange-50/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl md:text-4xl font-extrabold text-slate-800 mb-3 tracking-tight">
            Connect With Us 🌐
          </h2>
          <p className="text-sm md:text-base text-slate-600 max-w-lg mx-auto">
            Stay updated with exclusive product drops, mid-season flash sales,
            and customer rewards.
          </p>
          <div className="h-1 w-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mx-auto mt-4 mb-10" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <a
              href="https://facebook.com/yourpage"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-blue-600/20 justify-center text-sm md:text-base"
            >
              <FontAwesomeIcon icon={faFacebook} className="w-5 h-5" />
              <span>Facebook</span>
            </a>
            <a
              href="https://wa.me/8801234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-emerald-600/20 justify-center text-sm md:text-base"
            >
              <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
              <span>WhatsApp</span>
            </a>
            <a
              href="https://yourwebsite.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-slate-800/20 justify-center text-sm md:text-base"
            >
              <Globe className="w-5 h-5" />
              <span>Official Site</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
