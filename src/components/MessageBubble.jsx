import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { CheckCircle, Copy } from 'lucide-react';

const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  // Verifica si el contenido del mensaje es válido
  if (!message || typeof message.content !== "string") {
    return null;
  }

  // Función para procesar y limpiar el contenido del mensaje, especialmente para código
  const processContent = (content) => {
    let processed = content;

    // 1. Eliminar etiquetas <think> y </think> y formatear el contenido en cursiva
    processed = processed.replace(
      /<think>(.*?)<\/think>/g,
      '<em class="think-content">\$1</em>'
    );

    // Reemplazar secuencias de escape comunes
    processed = processed.replace(/\\n/g, "\n");
    processed = processed.replace(/\\"/g, '"');
    processed = processed.replace(/\\'/g, "'");
    processed = processed.replace(/\\\\/g, "\\");

    // Detectar bloques de código con marcadores mal formados
    processed = processed.replace(/```(\w+)\\n/g, "```\$1\n");
    processed = processed.replace(/```(\w+)\s*\n/g, "```\$1\n");

    // Arreglar bloques de código con backticks incorrectos
    processed = processed.replace(
      /`(\w+)\s*\n([\s\S]*?)\n\s*`/g,
      "```$1\n$2\n```"
    );

    // Detectar múltiples backticks (```) que no son parte de un bloque de código
    processed = processed.replace(/```{1,}/g, (match) => {
      if (match === "```") return match;
      return "```";
    });

    // Limpiar marcadores de lenguaje extraños
    processed = processed.replace(/```\s*(\w+)\s*/g, "```\$1\n");

    // Asegurarse de que cada bloque de código abierto tenga su cierre
    let codeBlockCount = (processed.match(/```/g) || []).length;
    if (codeBlockCount % 2 !== 0) {
      processed += "\n```";
    }

    return processed;
  };

  const processedContent = processContent(message.content);

  // Extraer el contenido del bloque de código
  const codeBlockMatch = processedContent.match(/```[\s\S]*?```/);
  const codeBlockContent = codeBlockMatch ? codeBlockMatch[0].replace(/```/g, '').trim() : "";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`p-3 rounded-lg shadow-md text-sm break-words
              max-w-[95%] sm:max-w-[85%] md:max-w-[70%] lg:max-w-[80%] overflow-x-auto
            ${
              isUser
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-gray-900 self-start"
            }`}
      >
        <div className="font-medium mb-1">{isUser ? "Tú" : "Asistente"}</div>
        <div className="markdown-content relative">
          {codeBlockContent && ( // Muestra el botón de copiar solo si hay contenido de código
            <CopyToClipboard
              text={codeBlockContent}
              onCopy={() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              <button className="absolute top-0 right-0 m-8 bg-gray-1 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline text-xs">
                {copied ? <CheckCircle size={16} className="inline-block mr-1" /> : <Copy size={16} className="inline-block mr-1" />}
                {copied ? "Copiado!" : "Copiar"}
              </button>
            </CopyToClipboard>
          )}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    language={match[1]}
                    PreTag="div"
                    className="rounded-lg overflow-hidden text-xs my-2"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-gray-700 text-white px-1 py-0.5 rounded" {...props}>
                    {children}
                  </code>
                );
              },
              p: ({ children }) => <p className="mb-2">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-5 mb-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-5 mb-2">{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
              h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
              h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
              h3: ({ children }) => <h3 className="text-base font-bold mb-1">{children}</h3>,
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-gray-400 pl-2 italic my-2">
                  {children}
                </blockquote>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-2">
                  <table className="min-w-full bg-white border border-gray-300">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => <thead className="bg-gray-100">{children}</thead>,
              tbody: ({ children }) => <tbody>{children}</tbody>,
              tr: ({ children }) => <tr>{children}</tr>,
              th: ({ children }) => (
                <th className="border border-gray-300 px-2 py-1 text-left font-semibold">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-gray-300 px-2 py-1">{children}</td>
              ),
              em: ({ className, children }) => {
                if (className === "think-content") {
                  return <em style={{ fontStyle: "italic" }}>{children}</em>;
                }
                return <em>{children}</em>;
              },
            }}
          >
            {processedContent}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
