import { OG_SIZE, renderOgImage } from "@/lib/ogImage";

export const alt = "PlayByMood: insert mood to continue";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage();
}
