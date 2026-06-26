// Insert Cloudinary transforms into a delivery URL so we serve appropriately
// sized, auto-format/quality images instead of the full-resolution original.
// No-op for non-Cloudinary URLs.
export function cloudinaryThumb(url, width) {
  if (!url || !url.includes("/image/upload/")) return url;
  return url.replace(
    "/image/upload/",
    `/image/upload/f_auto,q_auto,w_${width}/`
  );
}
