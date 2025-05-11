
import { FC } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

type Props = { latex: string };

const PrettyMath: FC<Props> = ({ latex }) => {
  // Normalize common raw text patterns to LaTeX
  let processedLatex = latex;
  
  // Convert common quadratic equation patterns
  if (latex.includes('x^2') || latex.includes('ax^2') || latex.includes('frac')) {
    // Handle quadratic formula special cases that aren't in LaTeX format yet
    
    // Convert x^2 to x^{2}
    processedLatex = processedLatex.replace(/([a-zA-Z])(\^)(\d+)/g, '$1^{$3}');
    
    // Convert fractions like (-b +- sqrt(b^2-4ac))/2a to proper LaTeX
    if (processedLatex.includes('sqrt') && !processedLatex.includes('\\sqrt')) {
      processedLatex = processedLatex.replace(/sqrt\(([^)]+)\)/g, '\\sqrt{$1}');
    }
    
    // Add spacing around operators for readability
    processedLatex = processedLatex
      .replace(/([a-zA-Z0-9}])([\+\-])/g, '$1 $2 ')
      .replace(/([\+\-])([a-zA-Z0-9\\{])/g, '$1 $2');
      
    // Convert plain 'frac' to '\frac'
    if (processedLatex.includes('frac') && !processedLatex.includes('\\frac')) {
      processedLatex = processedLatex.replace(/frac/g, '\\frac');
    }
  }

  try {
    const html = katex.renderToString(processedLatex, {
      displayMode: true,
      output: "html",          // KaTeX outputs an <span class="katex">
      throwOnError: false
    });

    return (
      <div className="flex justify-center my-4">
        <div
          className="
            bg-white dark:bg-neutral-900
            shadow-md rounded-lg
            px-6 py-4
            overflow-x-auto
            max-w-full
            font-['Merriweather',serif]
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
        <div className="bg-brightpair-50 px-4 py-2 rounded shadow-sm overflow-x-auto max-w-full font-['Merriweather',serif] text-brightpair-700">
          {latex}
        </div>
      </div>
    );
  }
};

export default PrettyMath;
