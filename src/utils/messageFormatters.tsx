
import React from 'react';
import katex from "katex";
import "katex/dist/katex.min.css";
import PrettyMath from '@/components/ui/PrettyMath';

// Enhanced format message with improved KaTeX math rendering
export const formatMessage = (content: string) => {
  // Check for LaTeX-style math expressions
  const hasLatex = content.includes('\\(') || content.includes('\\[') || 
                  content.includes('$') || content.includes('\\frac') ||
                  content.includes('\\sqrt');

  // Handle code blocks and LaTeX formatting
  if (content.includes('```') || hasLatex) {
    // Split by code block markers
    const segments = content.split(/(```[\s\S]*?```)/g);
    
    return segments.map((segment, i) => {
      // Check if segment is a code block
      if (segment.startsWith('```') && segment.endsWith('```')) {
        // Extract language (if specified) and code content
        const codeContent = segment.slice(3, -3).trim();
        const firstLineBreak = codeContent.indexOf('\n');
        const language = firstLineBreak > 0 ? codeContent.slice(0, firstLineBreak).trim() : '';
        const code = firstLineBreak > 0 ? codeContent.slice(firstLineBreak + 1).trim() : codeContent;
        
        return (
          <pre key={i} className="bg-gray-100 p-2 rounded my-2 overflow-x-auto">
            {language && <div className="text-xs text-gray-500 mb-1">{language}</div>}
            <code className="font-mono text-sm">{code}</code>
          </pre>
        );
      }
      
      // Process LaTeX-style math expressions
      let lines = segment.split('\n');
      return lines.map((line, j) => {
        // Process display math mode with double dollar signs
        if (line.includes('$$')) {
          const parts = line.split(/(\\$\\$[\s\S]*?\\$\\$)/g);
          return (
            <React.Fragment key={`${i}-${j}`}>
              {parts.map((part, k) => {
                if (part.startsWith('$$') && part.endsWith('$$')) {
                  const latex = part.slice(2, -2).trim();
                  return <PrettyMath key={`math-${k}`} latex={latex} />;
                }
                return part;
              })}
              {j < segment.split('\n').length - 1 && <br />}
            </React.Fragment>
          );
        }
        
        // Format inline LaTeX expressions: \( ... \) or $ ... $
        if (line.includes('\\(') || line.includes('$') || line.includes('\\frac') || line.includes('\\sqrt')) {
          // Extract potential LaTeX expressions
          const mathRegex = /(\\\(.*?\\\))|(\$[^$\n]+?\$)/g;
          const parts = line.split(mathRegex);
          
          return (
            <div key={`${i}-${j}`} className="py-1">
              {parts.map((part, k) => {
                // Check if part is LaTeX expression
                if ((part && part.startsWith('\\(') && part.endsWith('\\)')) || 
                    (part && part.startsWith('$') && part.endsWith('$'))) {
                  const latex = part.startsWith('\\(') 
                    ? part.slice(2, -2).trim() 
                    : part.slice(1, -1).trim();
                  
                  try {
                    const html = katex.renderToString(latex, {
                      displayMode: false,
                      throwOnError: false
                    });
                    return <span key={`inline-math-${k}`} dangerouslySetInnerHTML={{ __html: html }} />;
                  } catch (e) {
                    return <span key={`inline-math-${k}`} className="text-red-500">{part}</span>;
                  }
                }
                return part;
              })}
              {j < segment.split('\n').length - 1 && <br />}
            </div>
          );
        }
        
        // Special handling for equations with fancy formatting
        else if (line.match(/\\begin\{(equation|align|gather|eqnarray)\*?\}/) || 
                 line.match(/\\[\w]+\{/) ||
                 line.includes('\\[') ||
                 line.includes('\\]')) {
          try {
            const html = katex.renderToString(line, {
              displayMode: true,
              throwOnError: false
            });
            
            return (
              <div key={`${i}-${j}`} className="flex justify-center my-4">
                <div className="bg-white shadow-md rounded-lg px-6 py-4 overflow-x-auto max-w-full">
                  <div dangerouslySetInnerHTML={{ __html: html }} />
                </div>
              </div>
            );
          } catch (e) {
            // Fall back to standard formatting if KaTeX fails
            return (
              <div key={`${i}-${j}`} className="bg-brightpair-50 px-3 py-1.5 rounded my-1.5 font-mono text-brightpair-700 overflow-x-auto">
                {line}
                {j < segment.split('\n').length - 1 && <br />}
              </div>
            );
          }
        }
        
        // Highlight equations or formulas with special styling
        else if (line.match(/^\d*[+\-*/=][^a-zA-Z]*$/)) {
          try {
            const html = katex.renderToString(line, {
              displayMode: true,
              throwOnError: false
            });
            
            return (
              <div key={`${i}-${j}`} className="flex justify-center my-2">
                <div className="bg-brightpair-50 px-4 py-2 rounded shadow-sm overflow-x-auto max-w-full">
                  <div dangerouslySetInnerHTML={{ __html: html }} />
                </div>
              </div>
            );
          } catch (e) {
            return (
              <div key={`${i}-${j}`} className="bg-brightpair-50 px-3 py-1.5 rounded my-1.5 font-mono text-brightpair-700 overflow-x-auto">
                {line}
                {j < segment.split('\n').length - 1 && <br />}
              </div>
            );
          }
        }
        
        // Highlight numbered steps with emphasis
        else if (line.match(/^\d+[\.\)].*$/)) {
          return (
            <div key={`${i}-${j}`} className="font-medium my-1">
              {line}
              {j < segment.split('\n').length - 1 && <br />}
            </div>
          );
        }
        
        // Regular text
        return (
          <React.Fragment key={`${i}-${j}`}>
            {line}
            {j < segment.split('\n').length - 1 && <br />}
          </React.Fragment>
        );
      });
    });
  }

  // Original behavior for content without code blocks
  return content.split('\n').map((line, i) => {
    // Try to handle math expressions
    if (line.match(/^\d*[+\-*/=][^a-zA-Z]*$/) || 
        line.includes('\\(') || line.includes('\\)') || 
        line.includes('\\frac') || line.includes('\\sqrt') ||
        line.includes('$')) {
      
      try {
        const html = katex.renderToString(line, {
          displayMode: true,
          throwOnError: false
        });
        
        return (
          <div key={i} className="flex justify-center my-2">
            <div className="bg-brightpair-50 px-4 py-2 rounded shadow-sm overflow-x-auto max-w-full">
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          </div>
        );
      } catch (e) {
        return (
          <div key={i} className="bg-brightpair-50 px-3 py-1.5 rounded my-1.5 font-mono text-brightpair-700 overflow-x-auto">
            {line}
            {i < content.split('\n').length - 1 && <br />}
          </div>
        );
      }
    }
    
    // Highlight numbered steps with emphasis
    else if (line.match(/^\d+[\.\)].*$/)) {
      return (
        <div key={i} className="font-medium my-1">
          {line}
          {i < content.split('\n').length - 1 && <br />}
        </div>
      );
    }
    
    // Regular text
    return (
      <React.Fragment key={i}>
        {line}
        {i < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    );
  });
};
