import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NutriCoach AI — Tu Nutricionista Personal',
  description: 'Asistente de nutrición y entrenamiento personalizado para Alan Bonavita. Powered by Claude AI.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
