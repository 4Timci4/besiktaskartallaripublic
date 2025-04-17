import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { pageVariants } from '../utils/animationVariants';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

// Sayfa geçiş animasyonları için varyantlar - silinecek, utils'ten import ediliyor
// const pageVariants = {
//   initial: {
//     opacity: 0,
//     y: 20,
//   },
//   in: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       duration: 0.4,
//       ease: [0.25, 0.1, 0.25, 1.0], // cubic-bezier
//       when: "beforeChildren",
//       staggerChildren: 0.1,
//     },
//   },
//   out: {
//     opacity: 0,
//     y: -20,
//     transition: {
//       duration: 0.3,
//       ease: [0.25, 0.1, 0.25, 1.0], // cubic-bezier
//     },
//   },
// };

// Alt öğeler için varyantlar (örn: sayfa içindeki bileşenler) - silinecek, utils'ten import ediliyor
// export const childVariants = {
//   initial: {
//     opacity: 0,
//     y: 20,
//   },
//   in: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       duration: 0.4,
//       ease: [0.25, 0.1, 0.25, 1.0],
//     },
//   },
//   out: {
//     opacity: 0,
//     transition: {
//       duration: 0.3,
//     },
//   },
// };

function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <motion.div
      className={className}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  );
}

export default PageTransition; 