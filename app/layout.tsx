import './globals.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import type { Metadata } from 'next';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SocialButtons from './components/SocialButtons';
import { ThemeProvider } from './providers/ThemeProvider';
import { FirebaseAuthProvider } from './providers/FirebaseAuthProvider';
import { usePathname } from 'next/navigation';
import ClientWrapper from './components/ClientWrapper';

export const metadata: Metadata = {
  title: 'TeamsQA - Academia de Automatización',
  description: 'Aprende automatización de pruebas con SerenityBDD, Java, Gradle y Cucumber',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Aprende automatización de pruebas con SerenityBDD, Java, Gradle y Cucumber" />
        <meta property="og:title" content="TeamsQA - Academia de Automatización" />
        <meta property="og:description" content="Aprende automatización de pruebas con SerenityBDD, Java, Gradle y Cucumber" />
        <meta property="og:image" content="/path/to/your/image.jpg" />
        <meta property="og:url" content="https://yourwebsite.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TeamsQA - Academia de Automatización" />
        <meta name="twitter:description" content="Aprende automatización de pruebas con SerenityBDD, Java, Gradle y Cucumber" />
        <meta name="twitter:image" content="/path/to/your/image.jpg" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "TeamsQA",
            "url": "https://yourwebsite.com",
            "logo": "https://yourwebsite.com/path/to/your/logo.png",
            "sameAs": [
              "https://www.facebook.com/yourprofile",
              "https://www.twitter.com/yourprofile",
              "https://www.linkedin.com/yourprofile"
            ]
          })}
        </script>
      </head>
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors font-[Inter]">
        <FirebaseAuthProvider>
          <ThemeProvider>
          <ClientWrapper>
              {children}
            </ClientWrapper>
          </ThemeProvider>
        </FirebaseAuthProvider>
      </body>
    </html>
  );
}