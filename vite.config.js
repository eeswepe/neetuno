import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		VitePWA({
			registerType: "autoUpdate",
			injectRegister: "auto",
			workbox: {
				globPatterns: ["**/*.{js,css,html,ico,png, svg}"],
			},
			manifest: {
				name: "Neetuno - Belajar Topik Keinginanmu",
				short_name: "Neetuno",
				description: "Catat hal yang kamu pelajari dan lacak perkembanganmu",
				theme_color: "#1f2937",
				background_color: "#111827",
				start_url: "/",
				display: "standalone",
			},
			devOptions: {
				enabled: true,
			},
		}),
	],
});
