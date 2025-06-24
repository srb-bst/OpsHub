import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GreenScape Professional",
    short_name: "GreenScape",
    description: "Professional Landscaping Management System",
    start_url: "/",
    display: "standalone",
    background_color: "#f9fafb",
    theme_color: "#22c55e",
    orientation: "landscape-primary",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["business", "productivity"],
    screenshots: [
      {
        src: "/screenshot-wide.png",
        sizes: "1024x768",
        type: "image/png",
        form_factor: "wide",
      },
    ],
  }
}
