
import React from 'react';

// Format message with improved handling of formatting
export const formatMessage = (content: string) => {
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
