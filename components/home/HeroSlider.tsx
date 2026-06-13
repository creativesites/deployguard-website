"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { cn, buildWhatsAppUrl } from "@/lib/utils";

const SLIDES = [
  {
    id: 1,
    number: "01",
    label: "Excavators",
    title: "Efficiency in the Smallest of Spaces",
    subtitle: "Source verified Komatsu, Hitachi, and Caterpillar units for high-precision projects.",
    image: "/images/hero/excavator.jpg",
    link: "/inventory?category=excavators",
  },
  {
    id: 2,
    number: "02",
    label: "Generators",
    title: "Reliable Power Solutions",
    subtitle: "Professional grade Denyo and Airman generators ready for global deployment.",
    image: "/images/hero/generator.jpg",
    link: "/inventory?category=generators",
  },
  {
    id: 3,
    number: "03",
    label: "Export Logistics",
    title: "Global Export Support",
    subtitle: "10+ years experience shipping heavy machinery to Africa, Middle East, and Asia.",
    image: "/images/hero/global.avif",
    link: "/about",
  },
  {
    id: 4,
    number: "04",
    label: "Machinery Sourcing",
    title: "Custom Sourcing Solutions",
    subtitle: "Access Japan's largest auction networks to find your exact specification.",
    image: "/images/DSC00373.jpg.webp", // Reusing an existing high-quality image
    link: "/contact",
  },
];

export function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);

  const startAutoplay = useCallback(() => {
    if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    autoplayTimer.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
  }, []);

  useEffect(() => {
    if (!isPaused) {
      startAutoplay();
    }
    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    };
  }, [isPaused, startAutoplay]);

  const handleManualSelect = (index: number) => {
    setActiveIndex(index);
    // Restart timer on manual interaction
    startAutoplay();
  };

  const whatsappUrl = buildWhatsAppUrl(
    "Hello Kenki Trader! We are looking for high-performance heavy machinery from Japan."
  );

  return (
    <section 
      className="relative h-[90vh] min-h-[700px] w-full overflow-hidden bg-navy-950"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="flex h-full w-full">
        {SLIDES.map((slide, index) => {
          const isActive = activeIndex === index;
          
          return (
            <div
              key={slide.id}
              onClick={() => handleManualSelect(index)}
              className={cn(
                "group relative h-full cursor-pointer overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]",
                isActive ? "flex-[10] cursor-default" : "flex-[1] hover:flex-[1.2]"
              )}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] ease-linear scale-110"
                style={{ 
                  backgroundImage: `url(${slide.image})`,
                  transform: isActive ? "scale(1)" : "scale(1.1)"
                }}
              />
              
              {/* Overlays */}
              <div className={cn(
                "absolute inset-0 transition-opacity duration-700",
                isActive ? "bg-navy-950/40" : "bg-navy-950/70"
              )} />
              
              {/* Side Strip Overlay (only for inactive) */}
              {!isActive && (
                <div className="absolute inset-0 border-r border-white/5 bg-gradient-to-b from-transparent via-transparent to-navy-950/40" />
              )}

              {/* Panel Indicators (Numbers & Labels) */}
              <div className={cn(
                "absolute top-12 left-1/2 z-20 -translate-x-1/2 transition-all duration-500",
                isActive ? "left-12 translate-x-0" : ""
              )}>
                <div className="flex flex-col items-center gap-2">
                  <span className={cn(
                    "text-xl font-bold tracking-tighter opacity-80",
                    isActive ? "text-white text-2xl" : "text-white"
                  )}>
                    {slide.number}
                  </span>
                  {!isActive && (
                    <div className="h-20 w-[1px] bg-white/20 my-2" />
                  )}
                  <span className={cn(
                    "whitespace-nowrap text-xs font-black uppercase tracking-[0.2em] [writing-mode:vertical-lr] transition-all",
                    isActive ? "hidden" : "text-white"
                  )}>
                    {slide.label}
                  </span>
                </div>
              </div>

              {/* Expanded Content */}
              <div className={cn(
                "relative z-10 flex h-full items-center px-12 md:px-24 transition-all duration-700",
                isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12 pointer-events-none"
              )}>
                <div className="max-w-4xl">
                  {/* <span className="mb-4 inline-block text-xs font-black uppercase tracking-[0.4em] text-gold-500">
                    Kenki Trader Japan
                  </span> */}
                  <h1 className="mb-6 text-display-md font-display font-extrabold text-white md:text-display-xl lg:text-display-2xl leading-[1.1] tracking-tight">
                    {slide.title}
                  </h1>
                  {/* <p className="mb-10 max-w-2xl text-lg font-medium text-navy-50 md:text-xl">
                    {slide.subtitle}
                  </p> */}
                  <div className="absolute bottom-24 left-24 flex flex-col gap-5 sm:flex-row">
                    <Link
                      href={slide.link}
                      className="group inline-flex items-center justify-center gap-3 rounded-full bg-gold-500 px-10 py-5 text-sm font-black uppercase tracking-widest text-navy-950 shadow-gold-glow transition-all hover:bg-white hover:scale-[1.05]"
                    >
                      See More
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-3 rounded-full border border-white/30 bg-white/5 px-10 py-5 text-sm font-black uppercase tracking-widest text-white backdrop-blur-md transition-all hover:bg-white/10"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Inquiry
                    </a>
                  </div>
                </div>
              </div>

              {/* Bottom Label (only for active) */}
              {isActive && (
                <div className="absolute bottom-12 left-24 z-20 hidden md:block">
                  <div className="flex items-center gap-6">
                    <div className="h-[2px] w-12 bg-gold-500" />
                    <span className="text-sm font-bold uppercase tracking-[0.3em] text-white/60">
                      {slide.label}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Industrial Side Progress */}
      <div className="absolute bottom-12 right-12 z-30 flex flex-col items-center gap-4">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              handleManualSelect(i);
            }}
            className={cn(
              "h-1 transition-all duration-500 ease-out",
              activeIndex === i ? "w-12 bg-gold-500" : "w-6 bg-white/20 hover:bg-white/40"
            )}
          />
        ))}
      </div>
      
      {/* Branding Headline (matching SANY's bottom headline) */}
      <div className="absolute bottom-[-20%] left-0 right-0 py-8 text-center pointer-events-none">
          <h2 className="text-display-lg font-display font-black text-navy-950/20 uppercase tracking-[0.25em]">
            Quality Changes the World
          </h2>
      </div>
    </section>
  );
}
