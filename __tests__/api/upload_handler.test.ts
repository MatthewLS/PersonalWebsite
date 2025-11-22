import { createHandler, DbEntryUploadError } from '@/app/api/upload-image/handler';
import vercelUploader from '@/app/api/upload-image/vercelUploader';
import uploadDbImageEntry from '@/app/api/upload-image/uploadDbImageEntry';
import uploadDbImageTags from '@/app/api/upload-image/uploadDbImageTags';
import { NextRequest } from 'next/server';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockUrl = "http://upload-image.com";

// Create test data
const testImageFile = new File(
  ["fake image content"],
  "test-photo.jpg",
  { type: "image/jpeg" }
);

const testKeywords = ["landscape", "sunset", "mountains"];

// Create FormData with all values
const fullFormData = new FormData();
fullFormData.append("latitude", "40.712"); // 40.7128 formatted to 3 decimals
fullFormData.append("longitude", "-74.006"); // -74.0060 formatted to 3 decimals
fullFormData.append("cameraModel", "XT-3");
fullFormData.append("lensModel", "RF 24-70mm f/2.8L IS USM");
fullFormData.append("shutterSpeed", "1/250");
fullFormData.append("iso", "800");
fullFormData.append("aperture", "2.8");
fullFormData.append("image_date", "2024-03-15T14:30:00.000Z");
fullFormData.append("file", testImageFile);
fullFormData.append("alt_text", "A beautiful mountain landscape at sunset");
fullFormData.append("keywords", JSON.stringify(testKeywords));

// blobUploader => blob URL
// dbImageEntryUploader => image row ID
// dbImageTagsUploader => void

let handler = createHandler({
  blobUploader: vercelUploader,
  dbImageEntryUploader: uploadDbImageEntry,
  dbImageTagsUploader: vi.fn().mockResolvedValue(null),
});

describe("POST blob handler", () => {
  it("returns 400 if the file is missing", async () => {
    const form1 = new FormData();
    const req1 = new Request(mockUrl, {
      method: "POST",
      body: form1,
    });
    const res = await handler(req1 as unknown as NextRequest);
    expect(res.status).toBe(400);
  });

  it("returns 200 if the formData correct", async () => {
    const req2 = new Request(mockUrl, {
      method: "POST",
      body: fullFormData,
    });
    const res = await handler(req2 as unknown as NextRequest);
    expect(res.status).toBe(200);
  });

  // it("returns 400 if the file is missing", async () => {
  //   var form3 = new FormData();
  //   form3.append("file", new File(['test'], 'test.jpg', { type: 'image/jpeg' }));
  //   const req3 = new Request(mockUrl, {
  //     method: "POST",
  //     body: form3,
  //   })
  //   const res = await handler(req3 as unknown as NextRequest)
  //   expect(res.status).toBe(400);
  // });
});
