

export interface GetImagesResponse {
	url: string;
	altText: string;
	id : string;
	camera_model?: string;
	lens_model?: string;
	latitude?: number;
	longitude?: number;
	iso?: number;
	shutter_speed?: string;
	aperture?: string;
	created_at: string; // ISO date string
	image_date?: string; // ISO date string 
}