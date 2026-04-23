import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function useScrollAnimation(options = {}) {
  const ref = useRef(null);

  const {
    y = 80,
    duration = 1,
    delay = 0,
    stagger = 0,
    triggerStart = "top 85%",
  } = options;

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      // 🔥 if children exist → animate them
      const elements = stagger
        ? ref.current.children
        : ref.current;

      gsap.from(elements, {
        opacity: 0,
        y: y,
        duration: duration,
        delay: delay,
        stagger: stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: triggerStart,
        },
      });
    }, ref);

    return () => ctx.revert(); // 🔥 clean properly
  }, [y, duration, delay, stagger, triggerStart]);

  return ref;
}