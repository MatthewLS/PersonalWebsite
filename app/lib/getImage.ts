// lib/getImages.ts
import { supabase } from '@/app/lib/supabaseClient';
import { GetImagesResponse } from '@/app/api/get-images/types';

export const getImages = async (
  page: number = 1,
  limit: number = 5
): Promise<GetImagesResponse[]> => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from('images')
    .select('*')
    .order('upload_date', { ascending: false })
    .range(from, to);

  if (error) {
    console.error(error);
    return [];
  }
  return data as GetImagesResponse[];
};
