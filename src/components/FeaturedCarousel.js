'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const features = [
  {
    id: 1,
    image: '/images/slider/sporting-clay-banner.jpg',
    title: 'Sporting Clays',
    description: 'Experience our challenging sporting clays courses',
    link: '/activities',
    color: '#009f1e'
  },
  {
    id: 2,
    image: '/images/slider/spfy-classes.jpg',
    title: 'Safety & Training',
    description: 'Professional instruction for all skill levels',
    link: '/training',
    color: '#238213'
  },
  {
    id: 3,
    image: '/images/slider/rifle-slider.jpg',
    title: 'Rifle Ranges',
    description: 'Precision shooting from 100 to 600 yards',
    link: '/facilities',
    color: '#47963a'
  },
  {
    id: 4,
    image: '/images/slider/cowboy-slider.jpg',
    title: 'Cowboy Action',
    description: 'Step back in time with period firearms',
    link: '/activities/cowboy-action-shooting',
    color: '#009f1e'
  }
];

export default function FeaturedCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const feature = features[currentSlide];

  return (
    <div className="relative bg-gray-800 rounded-xl shadow-2xl shadow-black/50 overflow-hidden border-4 border-[#009f1e]/20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Image Side */}
        <div className="relative h-64 md:h-80">
          {features.map((feat, index) => (
            <div
              key={feat.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={feat.image}
                alt={feat.title}
                fill
                className="object-contain"
                priority={index === 0}
                quality={85}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            </div>
          ))}
        </div>

        {/* Content Side */}
        <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-8 md:p-12 flex flex-col justify-center">
          <div className="space-y-6">
            {/* Title & Description */}
            <div>
              <h3 
                className="text-3xl md:text-4xl font-bold mb-3 transition-all duration-500"
                style={{ color: feature.color, textShadow: `0 0 20px ${feature.color}40` }}
              >
                {feature.title}
              </h3>
              <p className="text-gray-300 text-lg">
                {feature.description}
              </p>
            </div>

            {/* CTA Button */}
            <Link
              href={feature.link}
              className="inline-block px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 hover:shadow-lg text-white"
              style={{ backgroundColor: feature.color }}
            >
              Learn More →
            </Link>

            {/* Dot Navigation */}
            <div className="flex gap-2 pt-4">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentSlide ? 'w-8 bg-gray-700' : 'w-2 bg-gray-400 hover:bg-gray-600'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Decorative Element */}
          <div 
            className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-10"
            style={{ backgroundColor: feature.color }}
          />
        </div>
      </div>
    </div>
  );
}
