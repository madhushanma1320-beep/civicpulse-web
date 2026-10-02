const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

// Uploads an image file to Cloudinary and returns its HTTPS URL
export async function uploadImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) throw new Error('Image upload failed')
  const data = await res.json()
  return data.secure_url
}

// Asks Cloudinary for a smaller, compressed version in the best format for the browser
export function optimizedImage(url, width = 600) {
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`)
}