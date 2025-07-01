import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/upload-image/route';
import { NextRequest, NextResponse } from 'next/server';
import * as blobModule from '@vercel/blob';
import { supabase } from '@/app/lib/supabaseClient';

vi.mock('@vercel/blob');
vi.mock('@/app/lib/supabaseClient');

console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);


describe('POST /api/upload-image', () => {
  const mockFileContent = new Uint8Array([1, 2, 3, 4]);
  const mockFile = {
    name: 'test.jpg',
    webkitRelativePath: 'photos',
    arrayBuffer: async () => mockFileContent.buffer,
  } as unknown as File;

  const mockFormData = {
    get: vi.fn(),
  };

  const mockRequest = {
    formData: async () => mockFormData,
  } as unknown as NextRequest;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should upload file and insert to DB successfully', async () => {
    // Setup formData.get mocks
    mockFormData.get.mockImplementation((key: string) => {
      switch (key) {
        case 'file': return mockFile;
        case 'alt_text': return 'A photo';
        case 'latitude': return '12.345';
        case 'longitude': return '-98.765';
        case 'cameraModel': return 'Canon';
        case 'lensModel': return 'EF 50mm';
        case 'shutterSpeed': return '1/100';
        case 'iso': return '200';
        case 'aperture': return '2.8';
        case 'date': return '2023-01-01';
        default: return null;
      }
    });

    // Mock blob upload
    (blobModule.put as any).mockResolvedValue({
      url: 'https://fakeurl.com/photos/test.jpg',
    });

    // Mock supabase insert success
    (supabase.from as any).mockReturnValue({
      insert: vi.fn().mockResolvedValue({ data: {}, error: null }),
    });

    const response = await POST(mockRequest);

    expect(blobModule.put).toHaveBeenCalledWith(
      'photos/test.jpg',
      expect.any(Buffer),
      { access: 'public' }
    );

    expect(supabase.from).toHaveBeenCalledWith('images');
    expect(response).toBeInstanceOf(NextResponse);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.photo.alt_text).toBe('A photo');
    expect(json.photo.url).toBe('https://fakeurl.com/photos/test.jpg');
  });

  it('should handle supabase insert error gracefully', async () => {
    mockFormData.get.mockImplementation((key: string) => {
      if (key === 'file') return mockFile;
      if (key === 'alt_text') return 'Photo';
      return null;
    });

    (blobModule.put as any).mockResolvedValue({
      url: 'https://fakeurl.com/photos/test.jpg',
    });

    (supabase.from as any).mockReturnValue({
      insert: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }),
    });

    const response = await POST(mockRequest);
    expect(response).toBeInstanceOf(NextResponse);

    const json = await response.json();
    expect(json.error).toBe('Failed to save photo to database');
  });

  it('should handle blob upload failure and continue', async () => {
    mockFormData.get.mockImplementation((key: string) => {
      if (key === 'file') return mockFile;
      if (key === 'alt_text') return 'Photo';
      return null;
    });

    (blobModule.put as any).mockRejectedValue(new Error('Upload failed'));

    (supabase.from as any).mockReturnValue({
      insert: vi.fn().mockResolvedValue({ data: {}, error: null }),
    });

    const response = await POST(mockRequest);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.photo.url).toBe(null);
  });
});
