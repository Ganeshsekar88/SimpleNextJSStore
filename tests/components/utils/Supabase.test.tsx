describe('Supabase utilities', () => {
  const mockUpload = jest.fn();
  const mockGetPublicUrl = jest.fn();
  const mockRemove = jest.fn();
  const mockFrom = jest.fn();

  const mockSupabaseUrl = 'https://dummy-project.supabase.co';
  const mockSupabaseKey = 'dummy-supabase-key';

  let supabase: typeof import('@/utils/supabase').supabase;
  let uploadImage: typeof import('@/utils/supabase').uploadImage;
  let deleteImage: typeof import('@/utils/supabase').deleteImage;

  beforeAll(() => {
    jest.resetModules();

    process.env.SUPABASE_URL = mockSupabaseUrl;
    process.env.SUPABASE_KEY = mockSupabaseKey;

    jest.doMock('@supabase/supabase-js', () => ({
      createClient: jest.fn(() => ({
        storage: {
          from: mockFrom,
        },
      })),
    }));

    /*
     * Load utils/supabase only after the Supabase dependency
     * has been mocked.
     */
    const supabaseUtils = require('@/utils/supabase');

    supabase = supabaseUtils.supabase;
    uploadImage = supabaseUtils.uploadImage;
    deleteImage = supabaseUtils.deleteImage;
  });

  beforeEach(() => {
    /*
     * Reset only the operation mocks.
     *
     * We don't use jest.clearAllMocks() because createClient()
     * runs when utils/supabase.ts is initially imported.
     */
    mockUpload.mockReset();
    mockGetPublicUrl.mockReset();
    mockRemove.mockReset();
    mockFrom.mockReset();

    mockFrom.mockReturnValue({
      upload: mockUpload,
      getPublicUrl: mockGetPublicUrl,
      remove: mockRemove,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  afterAll(() => {
    jest.dontMock('@supabase/supabase-js');
  });

  describe('supabase client', () => {
    it('initializes the Supabase client', () => {
      expect(supabase).toBeDefined();
      expect(supabase.storage).toBeDefined();
    });
  });

  describe('uploadImage', () => {
    it('uploads the image with a timestamped filename', async () => {
      const image = new File(['image content'], 'photo.jpg', {
        type: 'image/jpeg',
      });

      const timestamp = 1234567890;

      jest.spyOn(Date, 'now').mockReturnValue(timestamp);

      mockUpload.mockResolvedValue({
        data: {
          path: `${timestamp}-photo.jpg`,
        },
        error: null,
      });

      mockGetPublicUrl.mockReturnValue({
        data: {
          publicUrl: 'https://example.com/photo.jpg',
        },
      });

      const result = await uploadImage(image);

      expect(mockFrom).toHaveBeenCalledWith('my-bucket');

      expect(mockUpload).toHaveBeenCalledWith(
        `${timestamp}-photo.jpg`,
        image,
        {
          cacheControl: '3600',
        }
      );

      expect(mockGetPublicUrl).toHaveBeenCalledWith(
        `${timestamp}-photo.jpg`
      );

      expect(result).toBe('https://example.com/photo.jpg');
    });

    it('throws the Supabase error when the upload fails', async () => {
      const image = new File(['image content'], 'photo.jpg', {
        type: 'image/jpeg',
      });

      mockUpload.mockResolvedValue({
        data: null,
        error: {
          message: 'Upload failed',
        },
      });

      await expect(uploadImage(image)).rejects.toThrow(
        'Upload failed'
      );
    });

    it('throws a fallback error when upload returns no data or error', async () => {
      const image = new File(['image content'], 'photo.jpg', {
        type: 'image/jpeg',
      });

      mockUpload.mockResolvedValue({
        data: null,
        error: null,
      });

      await expect(uploadImage(image)).rejects.toThrow(
        'Image upload failed'
      );
    });

    it('uses the original image name in the generated filename', async () => {
      const image = new File(['image content'], 'profile.png', {
        type: 'image/png',
      });

      const timestamp = 987654321;

      jest.spyOn(Date, 'now').mockReturnValue(timestamp);

      mockUpload.mockResolvedValue({
        data: {
          path: `${timestamp}-profile.png`,
        },
        error: null,
      });

      mockGetPublicUrl.mockReturnValue({
        data: {
          publicUrl: 'https://example.com/profile.png',
        },
      });

      await uploadImage(image);

      expect(mockUpload).toHaveBeenCalledWith(
        `${timestamp}-profile.png`,
        image,
        {
          cacheControl: '3600',
        }
      );
    });
  });

  describe('deleteImage', () => {
    it('extracts the filename from the URL and removes the image', async () => {
      const url =
        'https://example.supabase.co/storage/v1/object/public/my-bucket/123456-photo.jpg';

      mockRemove.mockResolvedValue({
        data: ['123456-photo.jpg'],
        error: null,
      });

      const result = await deleteImage(url);

      expect(mockFrom).toHaveBeenCalledWith('my-bucket');

      expect(mockRemove).toHaveBeenCalledWith([
        '123456-photo.jpg',
      ]);

      expect(result).toEqual({
        data: ['123456-photo.jpg'],
        error: null,
      });
    });

    it('throws an error when the URL does not contain an image name', () => {
      const url = 'https://example.com/';

      expect(() => deleteImage(url)).toThrow('Invalid URL');

      expect(mockRemove).not.toHaveBeenCalled();
    });

    it('returns the result from Supabase remove', async () => {
      const url = 'https://example.com/storage/photo.jpg';

      const supabaseResponse = {
        data: ['photo.jpg'],
        error: null,
      };

      mockRemove.mockResolvedValue(supabaseResponse);

      const result = await deleteImage(url);

      expect(result).toEqual(supabaseResponse);
    });
  });
});