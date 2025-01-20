

export interface ArticleImage {
  articleId: string; // Renamed `article_id` to `articleId`
  imageId: string;   // Renamed `image_id` to `imageId`
}

export interface ArticleImagesResponse {
  articleImages: ArticleImage[];
}