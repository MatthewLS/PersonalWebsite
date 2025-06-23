import { createHandler } from './app/api/upload-image/handler';
import { NextRequest } from 'next/server';
import { vi } from 'vitest';

const mockExif ={ latitude: 1,
                  longitude: 2,
                  Model: "X-T3",
                  LensModel: "XF35mmF2 R WR",
                  ISO: 500,
                  ExposureTime: 0.004,
                  DateTimeOriginal: '2025-04-19T18:47:02.000Z',
                  FNumber: 11
                };
const mockUrl = 'https://fake.blob/photo.jpg';

const handler = createHandler({
  exifParser: vi.fn().mockResolvedValue(mockExif),
  uploader: vi.fn().mockResolvedValue(mockUrl),
  db: {
    insert: vi.fn().mockResolvedValue({ data: {}, error: null }),
  },
});

// Create a mocked NextRequest and call handler(req) in your test
const nextRequest = new NextRequest(mockUrl, {
  method: 'POST',
  body: JSON.stringify({ foo: 'bar' }),
  headers: {
    'Content-Type': 'application/json',
  },
});

describe("POST handler", () => {
  it("returns 400 if the alt_text and file is missing", async () => {
    const form1 = new FormData();
    const req1 = new Request(mockUrl, {
      method: "POST",
      body: form1,
    });
    const res = await handler(req1 as unknown as NextRequest);
    expect(res.status).toBe(400);
  });

  it("returns 400 if the alt_text is missing", async () => {
    var form2 = new FormData();
    form2.append('alt_text', "test");
    const req2 = new Request(mockUrl, {
      method: "POST",
      body: form2,
    });
    const res = await handler(req2);
    expect(res.status).toBe(400);
  });

  it("returns 400 if the file is missing", async () => {
    var form3 = new FormData();
    form3.append("file", new File(['test'], 'test.jpg', { type: 'image/jpeg'}));
    const req3 = new Request(mockUrl, {
      method: "POST",
      body: form3,
    })
    const res = await handler(req3)
    expect(res.status).toBe(400);
  });

  
});
