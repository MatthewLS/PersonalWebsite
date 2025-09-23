import { supabase } from "@/app/lib/supabaseClient";
import { TagUploadError } from "./handler";

interface TagNode {
  name: string;
  children: Map<string, TagNode>;
}

/**
 * Uploads hierarchical tags to the database and links them to a specified image.
 *
 * This function parses the provided list of tag strings into a hierarchical structure,
 * recursively inserts each tag into the database (ensuring parent-child relationships),
 * and associates all uploaded tags with the given image ID.
 *
 * - Tags are upserted into the 'tags' table, avoiding duplicates based on name and parent.
 * - Throws a `TagUploadError` if any database operation fails.
 * - If the `tags` array is empty, the function returns immediately.
 *
 * @param imageId - The unique identifier of the image to link tags to.
 * @param tags - An array of tag strings representing hierarchical subjects.
 * 
 * @throws {TagUploadError} If a tag fails to be inserted or linked in the database.
 */
export const uploadDbImageTags = async (imageId: string, tags: string[]) => {
  if (tags.length === 0) return;

  const root = parseHierarchicalSubjects(tags);
  const uploadedTagIds: string[] = [];

  const insertTagRecursive = async (node: TagNode, parentId: string | null = null): Promise<void> => {
    let currentParentId = parentId;

    // Only insert if this isn't the root node
    if (node.name !== "root") {
      const { data, error } = await supabase
        .from('tags')
        .upsert({ name: node.name, parent_id: parentId }, { onConflict: 'name,parent_id' })
        .select()
        .single();

      if (error) {
        console.error('Supabase tag insert error:', error);
        throw new TagUploadError('Failed to save tag to database', error);
      }

      if (!data) {
        throw new TagUploadError('Tag insert did not return a valid ID', error);
      }

      uploadedTagIds.push(data.id);
      currentParentId = data.id;
    }

    // Recursively insert all children
    for (const child of node.children.values()) {
      await insertTagRecursive(child, currentParentId);
    }
  };

  // Start the recursive insertion from the root
  await insertTagRecursive(root);

  // Link the uploaded tags to the image
  await linkTagsToImage(imageId, uploadedTagIds);
  console.log(`Tags uploaded for image ${imageId}`);
};

function parseHierarchicalSubjects(hierarchical: string[]): TagNode {
  const root: TagNode = { name: "root", children: new Map() };

  const insertPath = (path: string[]) => {
    let node = root;
    for (const part of path) {
      if (!node.children.has(part)) {
        node.children.set(part, { name: part, children: new Map() });
      }
      node = node.children.get(part)!;
    }
  };

  for (const item of hierarchical) {
    const parts = item.split("|").map((p) => p.trim());
    insertPath(parts);
  }

  return root;
};

const linkTagsToImage = async (imageId: string, tagIds: string[]) => {
  const { error } = await supabase
    .from('image_tags')
    .insert(tagIds.map(tagId => ({ image_id: imageId, tag_id: tagId })));

  if (error) throw new TagUploadError("failed to link image to associated tags", error);
};

export default uploadDbImageTags;