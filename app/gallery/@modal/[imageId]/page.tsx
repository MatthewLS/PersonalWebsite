import { supabase } from "@/app/lib/supabaseClient";
import ModalClient from "./modalClient";

export default async function ImageModal({
  params,
}: {
  params: Promise<{ imageId: string }>;
}) {
  const imageId = (await params).imageId;
  const { data, error } = await supabase
    .from("images")
    .select("url")
    .eq("id", imageId)
    .single();

  if (error || !data?.url) {
    console.error("Error fetching image:", error);
    return null; // or return a fallback modal
  }

  return <ModalClient imageUrl={data.url} />;
}
