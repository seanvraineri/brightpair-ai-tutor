import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

export default function ChatMarkdown({ md }: { md: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        // This renders the Markdown content with our desired styling
        div: ({ node, ...props }) => (
          <div 
            className="prose prose-sm dark:prose-invert max-w-none" 
            {...props} 
          />
        )
      }}
    >
      {md}
    </ReactMarkdown>
  );
} 