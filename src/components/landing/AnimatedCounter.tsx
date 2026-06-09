import React, { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  value: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState('0');
  const containerRef = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          animateValue();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [value]);

  const animateValue = () => {
    // Parse value, suffixes and prefixes
    // 2M+ -> prefix = "", num = 2, suffix = "M+"
    // 100+ -> prefix = "", num = 100, suffix = "+"
    // 99.2% -> prefix = "", num = 99.2, suffix = "%"
    // <1s -> prefix = "<", num = 1, suffix = "s"
    let prefix = '';
    let suffix = '';
    let numericString = '';

    if (value.startsWith('<')) {
      prefix = '<';
      numericString = value.slice(1);
    } else {
      numericString = value;
    }

    // Extract numbers (including decimals)
    const match = numericString.match(/^([0-9.]+)(.*)$/);
    let targetNum = 0;
    if (match) {
      targetNum = parseFloat(match[1]);
      suffix = match[2];
    } else {
      // Fallback if no match
      setDisplayValue(value);
      return;
    }

    const duration = 1500; // ms
    const startTime = performance.now();
    const isDecimal = match[1].includes('.');

    const update = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutQuad)
      const easeProgress = progress * (2 - progress);
      const current = easeProgress * targetNum;

      let formatted = '';
      if (isDecimal) {
        formatted = current.toFixed(1);
      } else {
        formatted = Math.floor(current).toString();
      }

      setDisplayValue(`${prefix}${formatted}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setDisplayValue(value); // Ensure exact target string at the end
      }
    };

    requestAnimationFrame(update);
  };

  return <span ref={containerRef}>{displayValue}</span>;
};
