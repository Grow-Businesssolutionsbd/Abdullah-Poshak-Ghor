"use client";

import Image from "next/image";
import {
  Headphones,
  HelpCircle,
  Info,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const wallets = [
  {
    name: "Bkash Personal",
    logo: "/bkash.png",
  },
  {
    name: "Nagad Personal",
    logo: "/nagad.png",
  },
  {
    name: "Upay Personal",
    logo: "/upay.png",
  },
  
  {
    name: "Ok Wallet Personal",
    logo: "/okwallet.png",
  },
];

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // URL থেকে টোটাল টাকা নেওয়া
    const amount = searchParams.get('amount');
    if (amount) {
      setTotalAmount(Number(amount));
    } else {
      // যদি amount না থাকে, তবে localStorage থেকে নেওয়া
      const storedTotal = localStorage.getItem('checkoutTotal');
      if (storedTotal) {
        setTotalAmount(Number(storedTotal) + 60); // ডেলিভারি চার্জ যোগ করা (60)
      }
    }
  }, [searchParams]);

  const handleClose = () => {
    router.back();
  };

  const handlePayment = (walletName: string) => {
  console.log(`Payment selected: ${walletName}, Amount: ${totalAmount}`);

  // wallet name ছোট হাতের করা
  const wallet = walletName.toLowerCase();

  // bKash page এ redirect
  if (wallet.includes("bkash")) {
    router.push(`/bkash-verify?amount=${totalAmount}`);
    return;
  }

  // Nagad page
  if (wallet.includes("nagad")) {
    router.push(`/nagad-verify?amount=${totalAmount}`);
    return;
  }

  // Upay page
  if (wallet.includes("upay")) {
    router.push(`/upay-verify?amount=${totalAmount}`);
    return;
  }

  // Ok Wallet page
  if (wallet.includes("ok wallet")) {
    router.push(`/okwallet-verify?amount=${totalAmount}`);
    return;
  }

  // fallback
  alert(`You selected ${walletName}`);
};
  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-sm border border-gray-200 p-6 relative">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute right-5 top-5 text-gray-400 hover:text-gray-600"
        >
          <X size={28} />
        </button>

        {/* Header */}
        <div className="flex items-start gap-5">
          {/* Store Logo */}
          <div className="w-28 h-28 rounded-full border-2 border-blue-300 overflow-hidden flex items-center justify-center bg-white">
            <Image
              src="/icon.png"
              alt="store"
              width={90}
              height={90}
              className="object-cover"
            />
          </div>

          {/* Right Content */}
          <div className="flex-1">
            <h1 className="text-5xl font-semibold text-[#5d7598]">
              Solid Bazzar
            </h1>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-6">
              <button className="flex items-center gap-2 border border-blue-200 rounded-2xl px-6 py-4 text-[#7f93b3] text-2xl hover:bg-blue-50">
                <Headphones size={28} />
                সহায়তা
              </button>

              <button className="flex items-center gap-2 border border-blue-200 rounded-2xl px-6 py-4 text-[#7f93b3] text-2xl hover:bg-blue-50">
                <HelpCircle size={28} />
                প্রশ্নাবলী
              </button>

              <button className="flex items-center gap-2 border border-blue-200 rounded-2xl px-6 py-4 text-[#7f93b3] text-2xl hover:bg-blue-50">
                <Info size={28} />
                বিস্তারিত
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 rounded-xl overflow-hidden flex">
          <button className="flex-1 bg-[#0057d9] text-white py-4 text-2xl font-semibold">
            মোবাইল ব্যাংকিং
          </button>

          <button className="flex-1 bg-[#0057d9] text-white py-4 text-2xl font-semibold border-l border-blue-400">
            ইন্টারন্যাশনাল
          </button>
        </div>

        {/* Wallet Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {wallets.map((wallet, index) => (
            <div
              key={index}
              onClick={() => handlePayment(wallet.name)}
              className="border border-gray-300 rounded-2xl overflow-hidden hover:shadow-md transition cursor-pointer"
            >
              <div className="h-40 flex items-center justify-center bg-white">
                <Image
                  src={wallet.logo}
                  alt={wallet.name}
                  width={130}
                  height={70}
                  className="object-contain"
                />
              </div>

              <div className="border-t border-gray-200 py-4 text-center text-2xl font-medium">
                {wallet.name}
              </div>
            </div>
          ))}
        </div>

        {/* Pay Button */}
        <button 
          className="w-full mt-10 bg-[#b7ccef] hover:bg-[#9fbce9] transition text-[#0057d9] text-4xl font-bold py-6 rounded-2xl"
        >
          Pay {totalAmount} BDT
        </button>
      </div>
    </div>
  );
}