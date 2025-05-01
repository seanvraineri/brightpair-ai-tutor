
import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Logo: React.FC<LogoProps> = ({ className = "", size = "md" }) => {
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-12",
  };
  
  return (
    <div className={`font-display font-bold flex items-center ${className}`}>
      <img 
        src="/lovable-uploads/7f63bfa0-be25-4a8a-ad89-6492e4b629e1.png" 
        alt="BrightPair Owl Logo" 
        className={`${sizeClasses[size]} mr-2`}
      />
      <span className={`${size === "sm" ? "text-xl" : size === "md" ? "text-2xl" : "text-4xl"}`}>
        <span className="text-brightpair">Bright</span>
        <span className="text-gray-800">Pair</span>
      </span>
    </div>
  );
};

export default Logo;
