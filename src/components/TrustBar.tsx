
import React from "react";

const TrustBar: React.FC = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-xl font-display font-semibold mb-2">Trusted and Secure</h3>
          <p className="text-gray-600">BrightPair prioritizes your child's safety and data privacy</p>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 mb-3 bg-white rounded-md flex items-center justify-center shadow-sm">
              <svg className="w-12 h-12" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L4 7V15C4 22.1797 9.32031 28.9062 16 30C22.6797 28.9062 28 22.1797 28 15V7L16 2Z" stroke="#52A1F2" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
                <path d="M11 16L15 20L22 13" stroke="#52A1F2" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
              </svg>
            </div>
            <h4 className="font-semibold mb-1">COPPA Compliant</h4>
            <p className="text-sm text-gray-500 text-center">Children's Online Privacy Protection Act</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 mb-3 bg-white rounded-md flex items-center justify-center shadow-sm">
              <svg className="w-12 h-12" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M27 11H5V27H27V11Z" stroke="#52A1F2" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
                <path d="M9 11V7C9 5.93913 9.42143 4.92172 10.1716 4.17157C10.9217 3.42143 11.9391 3 13 3H19C20.0609 3 21.0783 3.42143 21.8284 4.17157C22.5786 4.92172 23 5.93913 23 7V11" stroke="#52A1F2" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
                <path d="M16 19C16.5523 19 17 18.5523 17 18C17 17.4477 16.5523 17 16 17C15.4477 17 15 17.4477 15 18C15 18.5523 15.4477 19 16 19Z" stroke="#52A1F2" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
                <path d="M16 19V22" stroke="#52A1F2" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
              </svg>
            </div>
            <h4 className="font-semibold mb-1">FERPA Compliant</h4>
            <p className="text-sm text-gray-500 text-center">Family Educational Rights and Privacy Act</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 mb-3 bg-white rounded-md flex items-center justify-center shadow-sm">
              <svg className="w-12 h-12" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2L4 7V15C4 22.1797 9.32031 28.9062 16 30C22.6797 28.9062 28 22.1797 28 15V7L16 2Z" stroke="#52A1F2" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="square"/>
                <path d="M12 16L16 20L20 16" stroke="#52A1F2" strokeWidth="2" strokeMiterlimit="10"/>
                <path d="M16 10V18" stroke="#52A1F2" strokeWidth="2" strokeMiterlimit="10"/>
              </svg>
            </div>
            <h4 className="font-semibold mb-1">SOC 2 Certified</h4>
            <p className="text-sm text-gray-500 text-center">Service Organization Control Standards</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
