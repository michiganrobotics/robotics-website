// Create a singleton for the image globbing
export class ImageGlobber {
    private static instance: ImageGlobber;
    private images: Record<string, () => Promise<{ default: ImageMetadata }>>;
  
    private constructor() {
      this.images = import.meta.glob<{ default: ImageMetadata }>('/src/content/**/*.{jpeg,jpg,png,gif}');
    }
  
    public static getInstance(): ImageGlobber {
      if (!ImageGlobber.instance) {
        ImageGlobber.instance = new ImageGlobber();
      }
      return ImageGlobber.instance;
    }
  
    public async getImage(imagePath: string | undefined): Promise<ImageMetadata | null> {
      if (!imagePath) return null;
      
      try {
        const normalizedPath = `/src/content${imagePath.replace('../content', '')}`;
        if (normalizedPath in this.images) {
          const image = await this.images[normalizedPath]();
          return image.default;
        }
        return null;
      } catch (error) {
        console.error('Error in getImage:', error);
        return null;
      }
    }
  }