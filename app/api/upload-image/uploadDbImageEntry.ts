import { supabase } from "@/app/lib/supabaseClient";
import { PostgrestError } from "@supabase/supabase-js";
import { Database } from '@/app/types/supabase';
import { DbEntryUploadError } from "./handler";

type ImageRow = Database['public']['Tables']['images']['Row'];

export default async function uploadDbImageEntry(entry: ImageRow): Promise<string> {
  const { data, error } = await supabase
    .from('images')
    .insert(entry)
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    throw new DbEntryUploadError('Failed to insert ImageRow to Supabase', error);
  }
  return data.id;
}