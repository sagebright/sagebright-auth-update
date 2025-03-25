
import React from 'react';

const HowItWorks = () => {
  return (
    <section className="py-20 bg-white" id="how">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-headline font-dmSans font-bold mb-6">
            <span className="whitespace-normal md:whitespace-nowrap">We listen. We shape Sage. You set the pace.</span>
          </h2>
          <p className="text-body font-sans text-gray-600">
            You don't have to change how you onboard. We work with your existing HR systems and materials, then bring everything to life through Sage. Here's how it works:
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-0 bottom-0 left-4 sm:left-1/2 w-0.5 bg-sagebright-green/20 transform -translate-x-1/2"></div>
            
            {/* Step 1 */}
            <div className="relative mb-16">
              <div className="flex flex-col sm:flex-row items-start">
                <div className="flex items-center justify-center z-10 w-8 h-8 bg-sagebright-green rounded-full text-white font-bold mb-4 sm:mb-0 sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2">
                  1
                </div>
                <div className="sm:w-1/2 sm:pr-12 sm:text-right ml-10 sm:ml-0">
                  <h3 className="text-xl font-dmSans font-semibold mb-2">Intake & Design</h3>
                  <p className="text-gray-600 font-sans">
                    We learn how you want Sage to feel — tone, voice, style.
                  </p>
                </div>
                <div className="hidden sm:block sm:w-1/2 sm:pl-12"></div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="relative mb-16">
              <div className="flex flex-col sm:flex-row items-start">
                <div className="flex items-center justify-center z-10 w-8 h-8 bg-sagebright-green rounded-full text-white font-bold mb-4 sm:mb-0 sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2">
                  2
                </div>
                <div className="hidden sm:block sm:w-1/2 sm:pr-12"></div>
                <div className="sm:w-1/2 sm:pl-12 ml-10 sm:ml-0">
                  <h3 className="text-xl font-dmSans font-semibold mb-2">Integration</h3>
                  <p className="text-gray-600 font-sans">
                    We connect to your tools — HRIS, knowledge bases, checklists, etc.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="relative mb-16">
              <div className="flex flex-col sm:flex-row items-start">
                <div className="flex items-center justify-center z-10 w-8 h-8 bg-sagebright-green rounded-full text-white font-bold mb-4 sm:mb-0 sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2">
                  3
                </div>
                <div className="sm:w-1/2 sm:pr-12 sm:text-right ml-10 sm:ml-0">
                  <h3 className="text-xl font-dmSans font-semibold mb-2">Training & Test</h3>
                  <p className="text-gray-600 font-sans">
                    We build a custom Sage and test it with your team.
                  </p>
                </div>
                <div className="hidden sm:block sm:w-1/2 sm:pl-12"></div>
              </div>
            </div>
            
            {/* Step 4 */}
            <div className="relative">
              <div className="flex flex-col sm:flex-row items-start">
                <div className="flex items-center justify-center z-10 w-8 h-8 bg-sagebright-green rounded-full text-white font-bold mb-4 sm:mb-0 sm:absolute sm:left-1/2 sm:transform sm:-translate-x-1/2">
                  4
                </div>
                <div className="hidden sm:block sm:w-1/2 sm:pr-12"></div>
                <div className="sm:w-1/2 sm:pl-12 ml-10 sm:ml-0">
                  <h3 className="text-xl font-dmSans font-semibold mb-2">Launch & Learn</h3>
                  <p className="text-gray-600 font-sans">
                    You roll it out, and we keep learning to improve it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
