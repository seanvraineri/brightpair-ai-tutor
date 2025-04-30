
import React from "react";
import { Check, X } from "lucide-react";

interface ComparisonFeature {
  name: string;
  traditional: boolean | string;
  chatgpt: boolean | string;
  brightpair: boolean | string;
}

const features: ComparisonFeature[] = [
  {
    name: "Personalized to learning style",
    traditional: "Maybe",
    chatgpt: false,
    brightpair: true,
  },
  {
    name: "AI trained on your child",
    traditional: false,
    chatgpt: false,
    brightpair: true,
  },
  {
    name: "Real-time availability",
    traditional: false,
    chatgpt: true,
    brightpair: true,
  },
  {
    name: "Progress tracking",
    traditional: "Sometimes",
    chatgpt: false,
    brightpair: true,
  },
  {
    name: "Motivation customization",
    traditional: false,
    chatgpt: false,
    brightpair: true,
  },
  {
    name: "Parent dashboard",
    traditional: "Rare",
    chatgpt: "None",
    brightpair: true,
  },
  {
    name: "Cost",
    traditional: "$500–$1,000/month",
    chatgpt: "Free",
    brightpair: "$50/month + optional tutoring",
  },
];

const ComparisonSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 px-4 bg-gray-50">
      <div className="container max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold font-display text-center mb-12">
          How BrightPair Compares to Other Options
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full shadow-lg rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-white border-b">
                <th className="p-4 text-left font-display">Feature</th>
                <th className="p-4 text-center font-display">Traditional Tutors</th>
                <th className="p-4 text-center font-display">ChatGPT Only</th>
                <th className="p-4 text-center bg-brightpair-50 font-display text-brightpair-700">
                  BrightPair
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition-colors`}
                >
                  <td className="p-4 border-t">{feature.name}</td>
                  <td className="p-4 text-center border-t">
                    {typeof feature.traditional === "boolean" ? (
                      feature.traditional ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      )
                    ) : (
                      feature.traditional
                    )}
                  </td>
                  <td className="p-4 text-center border-t">
                    {typeof feature.chatgpt === "boolean" ? (
                      feature.chatgpt ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      )
                    ) : (
                      feature.chatgpt
                    )}
                  </td>
                  <td className="p-4 text-center border-t bg-brightpair-50">
                    {typeof feature.brightpair === "boolean" ? (
                      feature.brightpair ? (
                        <Check className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      )
                    ) : (
                      feature.brightpair
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
