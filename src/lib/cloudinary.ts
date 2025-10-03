// Use dynamic import at runtime; avoid static type imports to keep linter happy when deps missing

// Cloudinary SDK will pick up CLOUDINARY_URL automatically.
// This explicit config allows local dev without CLOUDINARY_URL too.
// Prefer environment variable; otherwise use the provided fallback credentials.
const FALLBACK = {
  cloud_name: 'dbynhb8va',
  api_key: '656858295268228',
  api_secret: 'y1rUB4xxJ-9clwvxIjxmAZv0ULs',
}

let cached: any
// Deprecated: we no longer import the cloudinary SDK. Keep function to avoid import errors.
export async function getCloudinary() {
  throw new Error('Cloudinary SDK not used. Use REST upload in API instead.')
}


