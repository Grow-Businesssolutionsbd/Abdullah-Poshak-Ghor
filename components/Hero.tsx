"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const slides = [
  { id: 1, image: "/herobanner.png", alt: "Hero Banner 1" },
  { id: 2, image: "/herobanner2.png", alt: "Hero Banner 2" },
  { id: 3, image: "/herobannerold.png", alt: "Hero Banner 3" },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden p-2 pb-6">
      {/* Image Slider Container - Full Width & Height */}
      <div className="relative w-full h-[200px] sm:h-[280px] md:h-[400px] lg:h-[550px] xl:h-[850px] ">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              className="object-cover object-center rounded-3xl md:rounded-2xl"
              priority={index === 0}
              sizes="100vw"
              quality={90}
            />
          </div>
        ))}
      </div>

      {/* Navigation Dots - সেন্টার ও নিচে */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 md:gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "w-4 md:w-6 h-1 bg-primary-gold shadow-lg"
                : "w-1.5 h-1.5 bg-primary-gold/50 hover:bg-primary-gold/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
