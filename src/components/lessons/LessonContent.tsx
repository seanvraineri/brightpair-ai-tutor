import React from "react";
import PrettyMath from "@/components/ui/PrettyMath";

interface LessonContentProps {
  content: string;
  className?: string;
}

const LessonContent: React.FC<LessonContentProps> = ({ content, className = "" }) => {
  // Split the content by math delimiters
  const renderContent = () => {
    if (!content) return null;
    
    // Check if the content contains any math expressions
    const hasMath = 
      content.includes('$') || 
      content.includes('\\frac') || 
      content.includes('\\sqrt') ||
      content.includes('\\int') ||
      content.includes('\\sum') ||
      content.includes('\\lim') ||
      (content.includes('=') && 
        (content.includes('^') || 
         content.includes('_')));
         
    if (!hasMath) {
      // Simple text content - no math
      return (
        <div className={`${className} lesson-text-content`}>
          {content.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < content.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      );
    }
    
    // For content with math expressions, we need to handle different cases:
    
    // Case 1: The entire content is a single math expression
    if ((content.startsWith('$') && content.endsWith('$')) || 
        (content.startsWith('$$') && content.endsWith('$$'))) {
      const isDisplayMath = content.startsWith('$$');
      return <PrettyMath latex={content} displayMode={isDisplayMath} />;
    }
    
    // Case 2: Content has inline math expressions ($...$) or display math expressions ($$...$$)
    // Split the content by math delimiters and render each part
    const segments = content.split(/(\$\$[\s\S]*?\$\$)|(\$[^\$]*?\$)/g).filter(Boolean);
    
    return (
      <div className={`${className} lesson-content`}>
        {segments.map((segment, index) => {
          // Handle display math ($$...$$)
          if (segment.startsWith('$$') && segment.endsWith('$$')) {
            return (
              <div key={`math-block-${index}`} className="my-4">
                <PrettyMath latex={segment} displayMode={true} />
              </div>
            );
          }
          
          // Handle inline math ($...$)
          if (segment.startsWith('$') && segment.endsWith('$')) {
            return (
              <span key={`math-inline-${index}`}>
                <PrettyMath latex={segment} displayMode={false} />
              </span>
            );
          }
          
          // Handle regular text
          return (
            <span key={`text-${index}`}>
              {segment.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < segment.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </span>
          );
        })}
      </div>
    );
  };
  
  return renderContent();
};

export default LessonContent; 