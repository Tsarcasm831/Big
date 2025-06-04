// New file to handle image loading with a fallback
export function loadImageWithFallback(url, fallbackUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      // If not already using the fallback, update the src to fallback URL
      if (fallbackUrl && img.src !== fallbackUrl) {
        console.warn(`Failed to load image: ${url}. Switching to fallback.`);
        img.src = fallbackUrl;
      } else {
        reject(new Error(`Failed to load image and fallback: ${url}`));
      }
    };
    img.src = url;
  });
}