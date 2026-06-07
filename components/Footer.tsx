"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiMapPin,
  FiPhone,
  FiMail,
  FiSend,
} from "react-icons/fi";
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcPaypal } from "react-icons/fa";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gradient-to-br from-primary-blue/5 via-white to-primary-gold/5 border-t border-gray-200 mt-auto">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {/* Column 1 - Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/icon.png"
                alt="Solid Bazzar"
                width={40}
                height={40}
                className="w-8 h-8 md:w-10 md:h-10"
              />
              <span className="text-lg md:text-xl font-bold text-primary-gold">
                Solid Bazzar
              </span>
            </Link>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
              Your trusted beauty destination in Bangladesh. Premium quality
              products at affordable prices.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-8 h-8 bg-primary-gold/10 rounded-full flex items-center justify-center hover:bg-primary-gold hover:text-white transition group"
              >
                <FiFacebook
                  size={16}
                  className="text-primary-gold group-hover:text-white"
                />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-primary-gold/10 rounded-full flex items-center justify-center hover:bg-primary-gold hover:text-white transition group"
              >
                <FiInstagram
                  size={16}
                  className="text-primary-gold group-hover:text-white"
                />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-primary-gold/10 rounded-full flex items-center justify-center hover:bg-primary-gold hover:text-white transition group"
              >
                <FiTwitter
                  size={16}
                  className="text-primary-gold group-hover:text-white"
                />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-primary-gold/10 rounded-full flex items-center justify-center hover:bg-primary-gold hover:text-white transition group"
              >
                <FiYoutube
                  size={16}
                  className="text-primary-gold group-hover:text-white"
                />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="space-y-4">
            <h3 className="text-base md:text-lg font-bold text-gray-800">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-xs md:text-sm text-gray-600 hover:text-primary-gold transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-xs md:text-sm text-gray-600 hover:text-primary-gold transition"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-xs md:text-sm text-gray-600 hover:text-primary-gold transition"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className="text-xs md:text-sm text-gray-600 hover:text-primary-gold transition"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-xs md:text-sm text-gray-600 hover:text-primary-gold transition"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Contact Info */}
          <div className="space-y-4">
            <h3 className="text-base md:text-lg font-bold text-gray-800">
              Contact Info
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <FiMapPin
                  className="text-primary-gold mt-0.5 flex-shrink-0"
                  size={16}
                />
                <span className="text-xs md:text-sm text-gray-600">
                  Jirantola, Gangni, Mollarhat, Bagerhat, Khulna-9384
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone
                  className="text-primary-gold flex-shrink-0"
                  size={16}
                />
                <a
                  href="tel:+8801797312699"
                  className="text-xs md:text-sm text-gray-600 hover:text-primary-gold transition"
                >
                  +880 1797 312699
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-primary-gold flex-shrink-0" size={16} />
                <a
                  href="mailto:support@solidbazzar.com"
                  className="text-xs md:text-sm text-gray-600 hover:text-primary-gold transition"
                >
                  support@solidbazzar.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 - Newsletter */}
          <div className="space-y-4">
            <h3 className="text-base md:text-lg font-bold text-gray-800">
              Newsletter
            </h3>
            <p className="text-xs md:text-sm text-gray-600">
              Subscribe to get exclusive offers and updates.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold"
              />
              <button
                type="submit"
                className="bg-primary-gold text-white px-3 py-2 rounded-lg hover:bg-highlight transition"
              >
                <FiSend size={16} />
              </button>
            </form>
            {isSubscribed && (
              <p className="text-xs text-green-600">
                Subscribed successfully! 🎉
              </p>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500 text-center">
              © {new Date().getFullYear()} Solid Bazzar. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">Secure Payments:</span>
              <div className="flex gap-2">
                <FaCcVisa size={24} className="text-gray-600" />
                <FaCcMastercard size={24} className="text-gray-600" />
                <FaCcAmex size={24} className="text-gray-600" />
                <FaCcPaypal size={24} className="text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
