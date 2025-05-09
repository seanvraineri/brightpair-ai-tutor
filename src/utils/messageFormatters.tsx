
import React from 'react';

// Format message with improved handling of formatting
export const formatMessage = (content: string) => {
  // Check if the content might contain code blocks
  if (content.includes('```')) {
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
      
      // Process non-code segments normally
      return segment.split('\n').map((line, j) => {
        // Highlight equations or formulas with special styling
        if (line.match(/^\d*[+\-*/=][^a-zA-Z]*$/)) {
          return (
            <div key={`${i}-${j}`} className="bg-brightpair-50 px-2 py-1 rounded my-1 font-mono text-brightpair-700">
              {line}
            </div>
          );
        }
        // Highlight numbered steps with emphasis
        else if (line.match(/^\d+[\.\)].*$/)) {
          return (
            <div key={`${i}-${j}`} className="font-medium">
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
    if (line.match(/^\d*[+\-*/=][^a-zA-Z]*$/)) {
      return (
        <div key={i} className="bg-brightpair-50 px-2 py-1 rounded my-1 font-mono text-brightpair-700">
          {line}
        </div>
      );
    }
    // Highlight numbered steps with emphasis
    else if (line.match(/^\d+[\.\)].*$/)) {
      return (
        <div key={i} className="font-medium">
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
