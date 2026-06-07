'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { FiStar } from 'react-icons/fi';

const reviews = [
  {
    name: 'Fatima Akter',
    text: 'So সুন্দর product! I love it 😍 The lipstick shade is absolutely gorgeous!',
    rating: 5
  },
  {
    name: 'Nusrat Jahan',
    text: 'Dhaka তে ২ দিনে ডেলিভারি পেয়েছি! Product quality অসাধারণ 💖',
    rating: 5
  },
  {
    name: 'Sadia Rahman',
    text: 'Best beauty store! Affordable prices and 100% genuine. Already ordered 3 times!',
    rating: 5
  },
  {
    name: 'Tasnim Haque',
    text: 'Cash on Delivery option টা খুবই convenient! Products are amazing quality ✨',
    rating: 5
  },
  {
    name: 'Mim Sultana',
    text: 'Face serum টা use করার পর skin একদম glow করছে! Must try product 🌟',
    rating: 5
  }
];

export default function Reviews() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">💬 গ্রাহক রিভিউ</h2>
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 }
          }}
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="bg-pink-50 p-6 rounded-lg text-center">
                <div className="flex justify-center mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <FiStar key={i} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-3">"{review.text}"</p>
                <p className="font-semibold text-pink-600">- {review.name}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}