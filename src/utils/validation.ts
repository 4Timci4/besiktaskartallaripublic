export const validationRules = {
  activities: {
    title: {
      required: true,
      minLength: 3,
      maxLength: 100
    },
    date: {
      required: true,
      custom: (value: string) => {
        const date = new Date(value);
        return !isNaN(date.getTime());
      }
    },
    description: {
      required: true,
      minLength: 10,
      maxLength: 1000
    },
    image: {
      required: true,
      pattern: /^https?:\/\/.+/i
    }
  },
  gallery: {
    title: {
      required: true,
      minLength: 3,
      maxLength: 100
    },
    description: {
      required: true,
      minLength: 10,
      maxLength: 500
    },
    category: {
      required: true
    },
    image: {
      required: true,
      pattern: /^https?:\/\/.+/i
    }
  }
};

export const errorMessages = {
  required: 'Bu alan zorunludur',
  minLength: (min: number) => `Minimum ${min} karakter olmalıdır`,
  maxLength: (max: number) => `Maksimum ${max} karakter olmalıdır`,
  pattern: {
    url: 'Geçerli bir URL giriniz'
  },
  date: 'Geçerli bir tarih giriniz',
  generic: 'Bir hata oluştu. Lütfen tekrar deneyiniz.'
};