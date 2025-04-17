import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * CSS sınıflarını birleştirmek için yardımcı fonksiyon.
 * Tailwind CSS sınıflarını birleştirirken çakışmaları önler.
 *
 * Kullanımı:
 * cn('text-red-500', condition && 'bg-blue-500', { 'p-4': true })
 *
 * @param inputs CSS sınıfları, koşullu sınıflar veya nesne olarak sağlanabilir
 * @returns Birleştirilmiş ve optimize edilmiş CSS sınıfı dizesi
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 