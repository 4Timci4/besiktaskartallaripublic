import supabase from '../utils/supabase';

console.log('Test başladı...');

(async () => {
  try {
    const { data, error } = await supabase.from('activities').select('count');
    
    if (error) {
      console.error('Hata:', error.message);
    } else {
      console.log('Başarılı!', data);
    }
  } catch (e) {
    console.error('Yakalanan hata:', e);
  }
})(); 