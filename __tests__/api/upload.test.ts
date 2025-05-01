import { createHandler } from './handler';
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
var nextRequest = NextRequest()

describe("POST handler", () => {
  it("returns 400 if the alt_text or file is missing", () => {
    var mockReq = {
      formData: async () => new Map(),
    } as unknown as NextRequest;

    const handler = createHandler({
      exifParse: vi.fn(),
      uploader: vi.fn(),
      db: {insert: vi.fn()},
    });

    var res = await handler(mockReq);
    expect(res.status).toBe(400);

    mockReq = new FormData();
    mockReq.append('alt_text' : "test")
    res = await handler(mockReq);
    expect(res.status).toBe(400);

    mockReq = new FormData();
    mockReq.append("file", new File(['test'], 'test.jpg', { type: 'image/jpeg'}));
    res = await handler(mockReq);
    expect(res.status).toBe(400);
  });

  if("inserts co")
});
