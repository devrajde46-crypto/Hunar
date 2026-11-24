import { Inter } from "next/font/google";
import fs from "fs";
import path from "path";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * Expected Display Font: Freudian
 * Expected Location: frontend/public/fonts/Freudian.woff2 (or Freudian-Bold.woff2)
 * Expected Format: WOFF2 (Web Open Font Format 2.0)
 *
 * If the font file is absent, Next.js build continues without failure
 * and the CSS display font gracefully falls back to system bold sans-serif.
 */
const candidateFontNames = [
  "Freudian.woff2",
  "Freudian-Bold.woff2",
  "Freudian.woff",
  "Freudian.ttf",
];

let freudianVar = "";
try {
  const fontsDir = path.join(process.cwd(), "public", "fonts");
  if (fs.existsSync(fontsDir)) {
    const matchedFile = candidateFontNames.find((name) =>
      fs.existsSync(path.join(fontsDir, name))
    );
    if (matchedFile) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const localFont = require("next/font/local");
      const loaded = (localFont.default || localFont)({
        src: `../public/fonts/${matchedFile}`,
        variable: "--font-freudian",
        display: "swap",
      });
      freudianVar = loaded.variable || "";
    }
  }
} catch {
  freudianVar = "";
}

export const freudianVariable = freudianVar;
