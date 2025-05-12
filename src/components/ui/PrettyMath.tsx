import { FC } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

type Props = { 
  latex: string;
  displayMode?: boolean;
};

const PrettyMath: FC<Props> = ({ latex, displayMode = true }) => {
  // Normalize common raw text patterns to LaTeX
  let processedLatex = latex;
  
  // Check if content is already wrapped in LaTeX delimiters
  const hasDelimiters = processedLatex.includes('$$') || 
                       processedLatex.includes('\\[') ||
                       processedLatex.includes('\\begin{') ||
                       (processedLatex.startsWith('$') && processedLatex.endsWith('$'));
  
  // Handle markdown-style headings (convert to plain text for rendering)
  if (processedLatex.startsWith('#')) {
    // Remove the heading markers for proper math rendering
    processedLatex = processedLatex.replace(/^#+\s+/, '');
  }
  
  // If the input contains math symbols but no LaTeX formatting, apply it
  if (!hasDelimiters && (
      latex.includes('x^') || 
      latex.includes('y^') || 
      latex.includes('z^') || 
      latex.includes('ax^2') || 
      latex.includes('frac') || 
      latex.includes('sqrt') || 
      latex.includes('\\int') ||
      latex.includes('\\sum') ||
      latex.includes('\\lim') ||
      (latex.includes('=') && (latex.includes('^') || latex.includes('_')))
    )) {
    // Convert single-character exponents like x^2 to x^{2} for proper exponent formatting
    processedLatex = processedLatex.replace(/([a-zA-Z])(\^)(\d+)/g, '$1^{$3}');
    
    // Convert multi-character exponents like x^(n+1) to x^{n+1}
    processedLatex = processedLatex.replace(/([a-zA-Z])(\^)\(([^)]+)\)/g, '$1^{$3}');
    
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
      processedLatex = processedLatex.replace(/frac\(([^,]+),([^)]+)\)/g, '\\frac{$1}{$2}');
      processedLatex = processedLatex.replace(/frac/g, '\\frac');
    }
    
    // Handle common fractions with slashes (a/b) - convert to \frac{a}{b}
    processedLatex = processedLatex.replace(/(\d+)\/(\d+)/g, '\\frac{$1}{$2}');
    
    // Replace special symbols with LaTeX commands
    processedLatex = processedLatex
      .replace(/neq/g, '\\neq')
      .replace(/\+\-/g, '\\pm')
      .replace(/\</g, '\\lt')
      .replace(/\>/g, '\\gt')
      .replace(/<=|≤/g, '\\leq')
      .replace(/>=|≥/g, '\\geq')
      .replace(/inf|∞/g, '\\infty')
      .replace(/alpha|α/g, '\\alpha')
      .replace(/beta|β/g, '\\beta')
      .replace(/gamma|γ/g, '\\gamma')
      .replace(/delta|δ/g, '\\delta')
      .replace(/theta|θ/g, '\\theta')
      .replace(/pi|π/g, '\\pi')
      .replace(/sigma|σ/g, '\\sigma')
      .replace(/omega|ω/g, '\\omega');
  }

  // Process single dollar delimiters
  if (processedLatex.startsWith('$') && processedLatex.endsWith('$') && processedLatex.length > 2) {
    processedLatex = processedLatex.slice(1, -1);
  }

  // Process double dollar delimiters
  if (processedLatex.startsWith('$$') && processedLatex.endsWith('$$') && processedLatex.length > 4) {
    processedLatex = processedLatex.slice(2, -2);
  }

  try {
    const html = katex.renderToString(processedLatex, {
      displayMode: displayMode,
      output: "html",
      throwOnError: false,
      strict: false
    });

    return (
      <div className={`${displayMode ? 'flex justify-center my-2' : 'inline-block'}`}>
        <div
          className={`
            overflow-x-auto
            max-w-full
            font-tutor
            ${displayMode ? 'equation-block bg-brightpair-50/20 border-l-2 border-brightpair px-4 py-2 rounded' : ''}
          `}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    );
  } catch (error) {
    console.error("KaTeX rendering error:", error);
    // Fallback for when KaTeX fails
    return (
      <div className={`${displayMode ? 'flex justify-center my-2' : 'inline-block'}`}>
        <div className="bg-brightpair-50 px-4 py-2 rounded-md overflow-x-auto max-w-full font-tutor text-brightpair-700">
          {latex}
        </div>
      </div>
    );
  }
};

export default PrettyMath;
