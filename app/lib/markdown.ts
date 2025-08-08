import { marked } from 'marked';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import java from 'highlight.js/lib/languages/java';
import python from 'highlight.js/lib/languages/python';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';

// Registrar lenguajes de resaltado
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('java', java);
hljs.registerLanguage('python', python);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);

/**
 * Convierte contenido Markdown a HTML
 */
export function processMarkdown(markdownContent: string): string {
  try {
    // Configurar marked con resaltado de código básico
    const html = marked.parse(markdownContent, {
      gfm: true,
      breaks: false
    });
    
    // Post-procesar para mejorar el HTML generado
    return postProcessHTML(html as string);
  } catch (error) {
    console.error('Error processing markdown:', error);
    return markdownContent;
  }
}

/**
 * Post-procesa el HTML para añadir estilos y mejorar la presentación
 */
function postProcessHTML(html: string): string {
  return html
    // Mejorar bloques de código
    .replace(/<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g, (match, lang, code) => {
      let highlightedCode = code;
      
      if (lang && hljs.getLanguage(lang)) {
        try {
          highlightedCode = hljs.highlight(code, { language: lang }).value;
        } catch (error) {
          console.error('Error highlighting code:', error);
          highlightedCode = hljs.highlightAuto(code).value;
        }
      } else {
        highlightedCode = hljs.highlightAuto(code).value;
      }

      return `
        <div class="relative my-6">
          <pre class="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm leading-relaxed font-mono shadow-lg"><code class="hljs${lang ? ` language-${lang}` : ''}">${highlightedCode}</code></pre>
          ${lang ? `
            <div class="absolute top-2 right-2 bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded font-mono opacity-75">
              ${lang}
            </div>
          ` : ''}
        </div>
      `;
    })
    // Mejorar bloques de código sin lenguaje específico
    .replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, (match, code) => {
      const highlightedCode = hljs.highlightAuto(code).value;
      return `
        <div class="relative my-6">
          <pre class="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm leading-relaxed font-mono shadow-lg"><code class="hljs">${highlightedCode}</code></pre>
        </div>
      `;
    })
    // Mejorar código inline
    .replace(/<code>([^<]+)<\/code>/g, '<code class="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    // Mejorar headers
    .replace(/<h1>/g, '<h1 class="text-3xl font-bold mb-6 mt-8 text-gray-900 dark:text-white">')
    .replace(/<h2>/g, '<h2 class="text-2xl font-semibold mb-4 mt-6 text-gray-900 dark:text-white">')
    .replace(/<h3>/g, '<h3 class="text-xl font-semibold mb-3 mt-5 text-gray-900 dark:text-white">')
    .replace(/<h4>/g, '<h4 class="text-lg font-semibold mb-2 mt-4 text-gray-900 dark:text-white">')
    .replace(/<h5>/g, '<h5 class="text-base font-semibold mb-2 mt-3 text-gray-900 dark:text-white">')
    .replace(/<h6>/g, '<h6 class="text-sm font-semibold mb-1 mt-2 text-gray-900 dark:text-white">')
    // Mejorar párrafos
    .replace(/<p>/g, '<p class="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">')
    // Mejorar enlaces
    .replace(/<a href="([^"]*)"([^>]*)>/g, (match, href, attrs) => {
      const isExternal = href && (href.startsWith('http://') || href.startsWith('https://')) && !href.includes(process.env.NEXT_PUBLIC_BASE_URL || 'localhost:3000');
      const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      return `<a href="${href}"${attrs} class="text-lime-600 dark:text-lime-400 hover:underline font-medium transition-colors"${target}>`;
    })
    // Mejorar listas
    .replace(/<ul>/g, '<ul class="list-disc list-inside mb-4 space-y-2 pl-4">')
    .replace(/<ol>/g, '<ol class="list-decimal list-inside mb-4 space-y-2 pl-4">')
    .replace(/<li>/g, '<li class="text-gray-700 dark:text-gray-300">')
    // Mejorar blockquotes
    .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-lime-500 pl-4 my-6 italic text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 py-3 rounded-r">')
    // Mejorar tablas
    .replace(/<table>/g, '<div class="overflow-x-auto my-6"><table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg">')
    .replace(/<\/table>/g, '</table></div>')
    .replace(/<thead>/g, '<thead class="bg-gray-50 dark:bg-gray-800">')
    .replace(/<tbody>/g, '<tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">')
    .replace(/<th>/g, '<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">')
    .replace(/<td>/g, '<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">');
}

/**
 * Extrae el primer párrafo del contenido Markdown como extracto
 */
export function extractExcerpt(markdownContent: string, maxLength: number = 160): string {
  try {
    // Remover headers, código y otros elementos especiales
    const cleanContent = markdownContent
      .replace(/^#+ .*/gm, '') // Headers
      .replace(/```[\s\S]*?```/g, '') // Bloques de código
      .replace(/`[^`]*`/g, '') // Código inline
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // Enlaces
      .replace(/[*_]{1,2}([^*_]*)[*_]{1,2}/g, '$1') // Énfasis
      .replace(/^\s*[-*+]\s+/gm, '') // Listas
      .replace(/^\s*\d+\.\s+/gm, '') // Listas numeradas
      .replace(/\n{2,}/g, ' ') // Múltiples saltos de línea
      .replace(/\n/g, ' ') // Saltos de línea simples
      .trim();

    // Tomar el primer párrafo o hasta maxLength caracteres
    const firstParagraph = cleanContent.split(/\s+/).reduce((acc, word) => {
      if (acc.length + word.length + 1 <= maxLength) {
        return acc + (acc ? ' ' : '') + word;
      }
      return acc;
    }, '');

    return firstParagraph + (firstParagraph.length < cleanContent.length ? '...' : '');
  } catch (error) {
    console.error('Error extracting excerpt:', error);
    return markdownContent.substring(0, maxLength) + '...';
  }
}

/**
 * Calcula el tiempo estimado de lectura
 */
export function calculateReadingTime(markdownContent: string): number {
  // Palabras promedio por minuto (español)
  const wordsPerMinute = 200;
  
  // Contar palabras excluyendo código y markdown
  const cleanContent = markdownContent
    .replace(/```[\s\S]*?```/g, '') // Bloques de código
    .replace(/`[^`]*`/g, '') // Código inline
    .replace(/[#*_\[\]()]/g, '') // Caracteres de markdown
    .trim();
    
  const wordCount = cleanContent.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  
  return Math.max(1, readingTime); // Mínimo 1 minuto
}
