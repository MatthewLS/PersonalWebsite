import { POST } from './route';
import { put } from '@vercel/blob';
import { createClient } from '@supabase/supabase-js';
import { describe, it, expect, vi } from 'vitest';
import { NextRequest } from 'next/server';

// Mock Blob Storage
vi.mock('@vercel/blob', () => ({
  put: vi.fn(),
}));

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: () => ({
      insert: vi.fn(() => ({ data: { id: 1 }, error: null })),
    }),
  })),
}));

describe('Photo Upload API', () => {
  it('uploads a photo and saves metadata', async () => {
    // Create a mock FormData
    const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt_text', 'A nice photo');

    const req = new NextRequest('http://localhost', { method: 'POST', body: formData });

    // Mock Blob upload
    (put as any).mockResolvedValue({ url: 'https://example.com/test.jpg' });

    const response = await POST(req);

    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.photo.alt_text).toBe('A nice photo');
    expect(json.photo.imageUrl).toBe('https://example.com/test.jpg');
  });
});
