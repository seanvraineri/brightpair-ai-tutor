import React from 'react';
import katex from "katex";
import "katex/dist/katex.min.css";

// Simplified message formatter with minimal formatting and basic math support
export const formatMessage = (content: string) => {
  // Basic check for math expressions
  const hasMath = content.includes('$');
  
  // Regular text without math expressions
  if (!hasMath) {
    return content.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  }
  
  // Simple math processor - only handles basic dollar sign delimited math
  const segments = content.split(/(\$\$[\s\S]*?\$\$)|(\$[\s\S]*?\$)/g).filter(Boolean);
  
  return segments.map((segment, i) => {
    // Display math (double dollars)
    if (segment.startsWith('$$') && segment.endsWith('$$')) {
      const latex = segment.slice(2, -2).trim();
      try {
        const html = katex.renderToString(latex, {
          displayMode: true,
          throwOnError: false
        });
        return (
          <div key={`math-block-${i}`} className="my-2">
            <span dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        );
      } catch (e) {
        return <div key={`math-block-${i}`}>{segment}</div>;
      }
    }
    
    // Inline math (single dollars)
    if (segment.startsWith('$') && segment.endsWith('$')) {
      const latex = segment.slice(1, -1).trim();
      try {
        const html = katex.renderToString(latex, {
          displayMode: false,
          throwOnError: false
        });
        return <span key={`math-inline-${i}`} dangerouslySetInnerHTML={{ __html: html }} />;
      } catch (e) {
        return <span key={`math-inline-${i}`}>{segment}</span>;
      }
    }
    
    // Regular text
    return segment.split('\n').map((line, j) => (
      <React.Fragment key={`${i}-${j}`}>
        {line}
        {j < segment.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  });
};
