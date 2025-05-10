
import React from 'react';

// Enhanced format message with improved handling of mathematics and formatting
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
        // Format inline LaTeX expressions: \( ... \) or $ ... $
        if (line.includes('\\(') || line.includes('$') || line.includes('\\frac') || line.includes('\\sqrt')) {
          // Simple check for inline math - this is a basic implementation
          // In a real app, you would use a proper LaTeX renderer like KaTeX or MathJax
          return (
            <div key={`${i}-${j}`} className="math-content py-1 font-serif">
              {line}
            </div>
          );
        }
        
        // Highlight equations or formulas with special styling
        else if (line.match(/^\d*[+\-*/=][^a-zA-Z]*$/) || line.match(/\\[a-zA-Z]/)) {
          return (
            <div key={`${i}-${j}`} className="bg-brightpair-50 px-3 py-1.5 rounded my-1.5 font-mono text-brightpair-700 overflow-x-auto">
              {line}
            </div>
          );
        }
        
        // Special handling for quadratic formula or other equations with fractions/roots
        else if (line.includes('sqrt') || line.includes('frac')) {
          return (
            <div key={`${i}-${j}`} className="bg-brightpair-50 px-3 py-1.5 rounded my-1.5 font-mono text-brightpair-700 overflow-x-auto">
              {line}
            </div>
          );
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
    // Highlight equations or formulas with special styling
    if (line.match(/^\d*[+\-*/=][^a-zA-Z]*$/) || line.includes('\\(') || line.includes('\\)') || 
        line.includes('\\frac') || line.includes('\\sqrt')) {
      return (
        <div key={i} className="bg-brightpair-50 px-3 py-1.5 rounded my-1.5 font-mono text-brightpair-700 overflow-x-auto">
          {line}
        </div>
      );
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
