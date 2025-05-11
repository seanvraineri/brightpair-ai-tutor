
import { FC } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

type Props = { latex: string };

const PrettyMath: FC<Props> = ({ latex }) => {
  // Normalize common raw text patterns to LaTeX
  let processedLatex = latex;
  
  // Check if content is already wrapped in LaTeX delimiters
  const needsWrapping = !processedLatex.includes('$$') && 
                       !processedLatex.includes('\\[') &&
                       !processedLatex.includes('\\begin{');
  
  // Handle quadratic formula and other common mathematical patterns
  if (latex.includes('x^2') || latex.includes('ax^2') || latex.includes('frac') || latex.includes('=')) {
    // Convert x^2 to x^{2} for proper exponent formatting
    processedLatex = processedLatex.replace(/([a-zA-Z])(\^)(\d+)/g, '$1^{$3}');
    
    // Convert fractions like (-b +- sqrt(b^2-4ac))/2a to proper LaTeX
    if (processedLatex.includes('sqrt') && !processedLatex.includes('\\sqrt')) {
      processedLatex = processedLatex.replace(/sqrt\(([^)]+)\)/g, '\\sqrt{$1}');
    }
    
    // Add spacing around operators for better readability
    processedLatex = processedLatex
      .replace(/([a-zA-Z0-9}])([\+\-])/g, '$1 $2 ')
      .replace(/([\+\-])([a-zA-Z0-9\\{])/g, '$1 $2');
      
    // Convert plain 'frac' to '\frac' for proper fraction display
    if (processedLatex.includes('frac') && !processedLatex.includes('\\frac')) {
      processedLatex = processedLatex.replace(/frac/g, '\\frac');
    }
    
    // Replace special symbols with LaTeX commands
    processedLatex = processedLatex
      .replace(/neq/g, '\\neq')
      .replace(/\+\-/g, '\\pm')
      .replace(/\</g, '\\lt')
      .replace(/\>/g, '\\gt');
  }

  // If the content isn't already in a LaTeX display format and contains math symbols, wrap it
  if (needsWrapping && (processedLatex.includes('=') || 
                        processedLatex.includes('^') || 
                        processedLatex.includes('\\frac'))) {
    processedLatex = `${processedLatex}`;
  }

  try {
    const html = katex.renderToString(processedLatex, {
      displayMode: true,
      output: "html",
      throwOnError: false
    });

    return (
      <div className="flex justify-center my-2">
        <div
          className="
            bg-white dark:bg-neutral-900
            px-4 py-2
            overflow-x-auto
            max-w-full
            font-tutor
          "
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    );
  } catch (error) {
    console.error("KaTeX rendering error:", error);
    // Fallback for when KaTeX fails
    return (
      <div className="flex justify-center my-2">
        <div className="bg-brightpair-50 px-4 py-2 rounded overflow-x-auto max-w-full font-tutor text-brightpair-700">
          {latex}
        </div>
      </div>
    );
  }
};

export default PrettyMath;
