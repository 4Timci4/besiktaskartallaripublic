import { useState, useCallback } from 'react';

interface ValidationRules {
  [key: string]: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string | number | boolean | unknown) => boolean;
  };
}

interface ValidationErrors {
  [key: string]: string;
}

export const useFormValidation = (rules: ValidationRules) => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = useCallback((data: { [key: string]: string | number | boolean | unknown }) => {
    const newErrors: ValidationErrors = {};

    Object.keys(rules).forEach((field) => {
      const value = data[field];
      const fieldRules = rules[field];

      if (fieldRules.required && !value) {
        newErrors[field] = 'Bu alan zorunludur';
      } else if (value) {
        const stringValue = String(value);
        if (fieldRules.minLength && stringValue.length < fieldRules.minLength) {
          newErrors[field] = `Minimum ${fieldRules.minLength} karakter olmalıdır`;
        }
        if (fieldRules.maxLength && stringValue.length > fieldRules.maxLength) {
          newErrors[field] = `Maksimum ${fieldRules.maxLength} karakter olmalıdır`;
        }
        if (fieldRules.pattern && !fieldRules.pattern.test(stringValue)) {
          newErrors[field] = 'Geçersiz format';
        }
        if (fieldRules.custom && !fieldRules.custom(value)) {
          newErrors[field] = 'Geçersiz değer';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [rules]);

  return { errors, validate, setErrors };
};