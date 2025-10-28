/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";
import React, { useMemo } from "react";

interface TextNode {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  underline?: boolean;
  code?: boolean;
}

interface BlockNode {
  type: string;
  children: any[];
  [key: string]: any;
}

type CustomBlocksContent = Array<
  | BlocksContent[number]
  | { type: "hr"; children?: never }
  | { type: "list-item"; children: any[]; value?: number }
>;

export const MarkdownRenderer = ({ content }: { content: string }) => {
  const blocks = useMemo<CustomBlocksContent>(() => {
    const lines = content.split("\n");
    const blocks: CustomBlocksContent = [];
    let currentList: any = null;
    let currentQuote: any = null;
    let currentCodeBlock: any = null;
    let listCounter = 0;
    let currentParagraph: any = null;

    const closeCurrentParagraph = () => {
      if (currentParagraph && currentParagraph.length > 0) {
        blocks.push({
          type: "paragraph",
          children: currentParagraph,
        });
        currentParagraph = null;
      }
    };

    const closeCurrentList = () => {
      if (currentList) {
        blocks.push(currentList);
        currentList = null;
        listCounter = 0;
      }
    };

    const closeCurrentQuote = () => {
      if (currentQuote) {
        blocks.push(currentQuote);
        currentQuote = null;
      }
    };

    const closeCurrentCodeBlock = () => {
      if (currentCodeBlock) {
        blocks.push(currentCodeBlock);
        currentCodeBlock = null;
      }
    };

    const closeAllBlocks = () => {
      closeCurrentParagraph();
      closeCurrentList();
      closeCurrentQuote();
      closeCurrentCodeBlock();
    };

    for (const line of lines) {
      const trimmed = line.trim();
      const rawLine = line;

      if (!trimmed) {
        if (currentCodeBlock) {
          currentCodeBlock.children.push({
            type: "text",
            text: "\n",
          });
        } else {
          closeAllBlocks();
        }
        continue;
      }

      if (trimmed.startsWith("```")) {
        if (currentCodeBlock) {
          closeCurrentCodeBlock();
        } else {
          closeAllBlocks();
          currentCodeBlock = {
            type: "code",
            children: [],
            language: trimmed.substring(3).trim() || "plaintext",
          };
        }
        continue;
      }

      if (currentCodeBlock) {
        currentCodeBlock.children.push({
          type: "text",
          text: rawLine + "\n",
        });
        continue;
      }

      const quoteMatch = rawLine.match(/^(>+)\s?(.*)/);
      if (quoteMatch) {
        const [_, markers, quoteText] = quoteMatch;
        const quoteLevel = markers.length;

        if (!currentQuote || currentQuote.level !== quoteLevel) {
          closeAllBlocks();
          currentQuote = {
            type: "quote",
            level: quoteLevel,
            children: [],
          };
        }

        if (quoteText.trim()) {
          currentQuote.children.push({
            type: "paragraph",
            children: parseInlineFormatting(quoteText),
          });
        }
        continue;
      }

      if (currentQuote) {
        closeCurrentQuote();
      }
      const headingMatch = trimmed.match(/^(#{1,6})\s(.*)/);
      if (headingMatch) {
        closeAllBlocks();
        const level = headingMatch[1].length;
        const text = headingMatch[2];
        blocks.push({
          type: "heading",
          level: level as 1 | 2 | 3 | 4 | 5 | 6,
          children: parseInlineFormatting(text),
        });
        continue;
      }

      // Listas numeradas (suporta 1., 2., etc.)
      const numberedListMatch = trimmed.match(/^(\d+)\.\s(.*)/);
      if (numberedListMatch) {
        closeCurrentParagraph();
        const [, number, text] = numberedListMatch;
        if (!currentList || currentList.format !== "ordered") {
          closeCurrentList();
          currentList = {
            type: "list",
            format: "ordered",
            children: [],
          };
        }
        currentList.children.push({
          type: "list-item",
          children: parseInlineFormatting(text),
          value: parseInt(number, 10),
        });
        continue;
      }

      // Listas com marcadores (-, *, +)
      if (/^[-*+]\s/.test(trimmed)) {
        closeCurrentParagraph();
        if (!currentList || currentList.format !== "unordered") {
          closeCurrentList();
          currentList = {
            type: "list",
            format: "unordered",
            children: [],
          };
        }
        currentList.children.push({
          type: "list-item",
          children: parseInlineFormatting(trimmed.substring(2)),
        });
        continue;
      }
      if (/^(---|\*\*\*|___)\s*$/.test(trimmed)) {
        closeAllBlocks();
        blocks.push({
          type: "hr",
        });
        continue;
      }

      closeCurrentList();
      closeCurrentQuote();

      if (!currentParagraph) {
        currentParagraph = [];
      } else if (currentParagraph.length > 0) {
        // Adiciona quebra de linha entre parágrafos
        currentParagraph.push({
          type: "text",
          text: "\n",
        });
      }

      currentParagraph.push(...parseInlineFormatting(rawLine));
    }

    closeAllBlocks();

    return blocks;
  }, [content]);

  return (
    <div className="markdown-content whitespace-pre-wrap">
      <BlocksRenderer
        content={blocks as unknown as any[]}
        blocks={{
          paragraph: ({ children }) => (
            <p className="mb-4 leading-relaxed whitespace-pre-wrap">
              {children}
            </p>
          ),
          quote: ({ children }) => (
            <blockquote
              className={`
                border-l-4 border-gray-300 pl-4 my-4 italic text-gray-600 
                ml-4
              `}
            >
              {children}
            </blockquote>
          ),
          heading: (props: { children?: React.ReactNode; level?: number }) => {
            const { children, level = 2 } = props;
            const safeLevel = Math.min(Math.max(level, 1), 6);
            const Tag = `h${safeLevel}` as keyof JSX.IntrinsicElements;

            const sizeClasses = [
              "text-3xl",
              "text-2xl",
              "text-xl",
              "text-lg",
              "text-base",
              "text-sm",
            ][safeLevel - 1];

            return React.createElement(
              Tag,
              {
                className: `font-bold my-4 ${sizeClasses}`,
              },
              children
            );
          },
          list: ({ children, format }) => {
            const ListTag = format === "ordered" ? "ol" : "ul";
            return (
              <ListTag
                className={`${
                  format === "ordered" ? "list-decimal" : "list-disc"
                } pl-6 mb-4 space-y-1`}
              >
                {children}
              </ListTag>
            );
          },
          "list-item": ({ children, ...props }: any) => (
            <li
              className="mb-1"
              {...("value" in props ? { value: props.value } : {})}
            >
              {children}
            </li>
          ),
          code: ({ children }) => (
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto my-4">
              <code>{children}</code>
            </pre>
          ),
        }}
        modifiers={{
          bold: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
          italic: ({ children }) => <em className="italic">{children}</em>,
          strikethrough: ({ children }) => (
            <span className="line-through">{children}</span>
          ),
          underline: ({ children }) => (
            <span className="underline">{children}</span>
          ),
          code: ({ children }) => (
            <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
              {children}
            </code>
          ),
        }}
      />
    </div>
  );
};

function parseInlineFormatting(text: string): TextNode[] {
  const result: TextNode[] = [];
  let remaining = text;

  const patterns = [
    {
      regex: new RegExp("```([^`]+)```", "g"),
      type: "code",
    },
    {
      regex: new RegExp("`([^`]+)`", "g"),
      type: "code",
    },

    {
      regex: new RegExp("\\*\\*\\*([^*]+)\\*\\*\\*", "g"),
      type: "bolditalic",
    },

    {
      regex: new RegExp("\\*\\*([^*]+)\\*\\*", "g"),
      type: "bold",
    },

    {
      regex: new RegExp("\\*([^*]+)\\*", "g"),
      type: "italic",
    },

    {
      regex: new RegExp("__([^_]+)__", "g"),
      type: "underline",
    },

    {
      regex: new RegExp("_([^_]+)_", "g"),
      type: "italic",
    },

    {
      regex: new RegExp("~~([^~]+)~~", "g"),
      type: "strikethrough",
    },

    {
      regex: new RegExp("\n", "g"),
      type: "break",
    },
  ];

  let hasMarkup = false;
  let processedParts: any[] = [{ text: remaining }];

  patterns.forEach((pattern) => {
    const newParts: any[] = [];

    processedParts.forEach((part) => {
      // Se já tem formatação, não processa novamente
      if (Object.keys(part).some((k) => k !== "type" && k !== "text")) {
        newParts.push(part);
        return;
      }

      const parts = part.text.split(pattern.regex);
      if (parts.length <= 1) {
        newParts.push(part);
        return;
      }

      hasMarkup = true;
      for (let i = 0; i < parts.length; i++) {
        if (!parts[i]) continue;

        if (i % 2 === 0) {
          newParts.push({ text: parts[i] });
        } else {
          if (pattern.type === "bolditalic") {
            newParts.push({
              text: parts[i],
              bold: true,
              italic: true,
            });
          } else {
            newParts.push({
              text: parts[i],
              [pattern.type]: true,
            });
          }
        }
      }
    });

    processedParts = newParts;
  });

  if (!hasMarkup) {
    // Se não tem formatação, mantém as quebras de linha
    if (text.includes("\n")) {
      return text
        .split("\n")
        .flatMap((line, i) => [
          ...(i > 0 ? [{ type: "text", text: "\n" } as TextNode] : []),
          { type: "text", text: line } as TextNode,
        ])
        .filter((node): node is TextNode => node.text !== "");
    }
    return [{ type: "text", text }];
  }

  return processedParts
    .flatMap((part) => {
      if (part.type === "break") {
        return { type: "text", text: "\n" } as TextNode;
      }
      return {
        type: "text",
        text: part.text,
        bold: part.bold,
        italic: part.italic,
        strikethrough: part.strikethrough,
        underline: part.underline,
        code: part.code,
      } as TextNode;
    })
    .filter((node) => node.text !== "");
}
