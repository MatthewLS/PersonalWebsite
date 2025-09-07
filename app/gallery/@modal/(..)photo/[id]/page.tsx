import { supabase } from "@/app/lib/supabaseClient";
import Modal from "./modalClient";

export default async function ImageModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const imageId = (await params).id;
  const { data, error } = await supabase
    .from("images")
    .select("url")
    .eq("id", imageId)
    .single();

  if (error || !data?.url) {
    console.error("Error fetching image:", error);
    return null; // or return a fallback modal
  }
  console.log("modal is called: ", data.url);
  return <Modal imageUrl={data.url} />;
}
