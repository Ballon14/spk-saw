import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
    title: "Sistem Pendukung Keputusan - Metode SAW",
    description:
        "Sistem pendukung keputusan menggunakan metode Simple Additive Weighting (SAW)",
}

export default function RootLayout({ children }) {
    return (
        <html lang="id">
            <body className={inter.className}>{children}</body>
        </html>
    )
}
