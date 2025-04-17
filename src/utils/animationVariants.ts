// Sayfa geçiş animasyonları için varyantlar
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1.0], // cubic-bezier
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  out: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1.0], // cubic-bezier
    },
  },
};

// Alt öğeler için varyantlar (örn: sayfa içindeki bileşenler)
export const childVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
  out: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
}; 