import React from "react";
import PrettyMath from "@/components/ui/PrettyMath";

interface FlashcardContentProps {
  content: string;
  className?: string;
}

const FlashcardContent: React.FC<FlashcardContentProps> = ({ content, className = "" }) => {
  // Check if content contains math expressions (signified by $ or typical math symbols)
  const containsMath = 
    content.includes('$') || 
    content.includes('^') || 
    content.includes('\\frac') || 
    content.includes('\\sqrt') ||
    content.includes('\\int') ||
    content.includes('\\sum') ||
    content.includes('\\lim') ||
    (content.includes('=') && 
      (content.includes('^') || 
       content.includes('_') || 
       content.includes('sqrt') || 
       content.includes('frac')));

  // If the content has math expressions, parse and render them with PrettyMath
  if (containsMath) {
    // If the content is wrapped in dollars, we need to handle it appropriately
    const isInlineMath = content.startsWith('$') && content.endsWith('$') && !content.startsWith('$$');
    const isDisplayMath = content.startsWith('$$') && content.endsWith('$$');
    
    if (isInlineMath || isDisplayMath) {
      return (
        <div className={`${className} flashcard-content`}>
          <PrettyMath latex={content} displayMode={isDisplayMath} />
        </div>
      );
    }
    
    // For mixed content (text and math), we'll need to split and render separately
    // For now, handle the simpler case of content that contains math but isn't properly delimited
    return (
      <div className={`${className} flashcard-content`}>
        <PrettyMath latex={content} displayMode={false} />
      </div>
    );
  }
  
  // If no math expressions, render as regular text
  return (
    <div className={`${className} flashcard-content`}>
      {content.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index < content.split('\n').length - 1 && <br />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default FlashcardContent; 