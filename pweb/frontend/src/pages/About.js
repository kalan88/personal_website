import React, { useState } from 'react';

// Reusable ProjectCard component (same as in WebVulture)
const ProjectCard = ({ title, description }) => (
  <div className="bg-gray-700 text-white shadow-md border-2 border-amber-300 p-6 rounded-xl hover:bg-opacity-20 transition-all duration-300 m-4">
    <h2 className="text-2xl font-semibold mb-2 text-amber-200">{title}</h2>
    <p className="text-lg text-amber-100">{description}</p>
  </div>
);

const Object= () => {
  const [showResume, setShowResume] = useState(false);

  const toggleResume = () => {
    setShowResume(!showResume);
  };

  return (
    <div className="min-h-screen bg-gray-800 text-amber-400 p-6 sm:p-12">
      <div className="max-w-6xl mx-auto mt-12">
        <div className="font-serif space-y-8">
          {/* Self Intro Card */}
          <ProjectCard
            title="About Me"
            description="Hi! I'm Kalan Li, a software engineering student at McGill University with a deep interest in cybersecurity, backend development, and building tools that blend utility with creativity. I love working on hands-on projects  and I enjoy tackling challenges that involve low-level systems or secure architecture."
          />

          {/* Toggle Button */}
          <div className="text-center">
            <button
              onClick={toggleResume}
              className="bg-amber-400 text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-amber-500 transition-all duration-300"
            >
              {showResume ? 'Hide Resume' : 'Show Resume'}
            </button>
          </div>

          {/* Conditional Resume Display */}
          {showResume && (
            <div className="bg-gray-700 text-white shadow-md border-2 border-amber-300 p-6 rounded-xl hover:bg-opacity-20 transition-all duration-300 m-4">
              <h2 className="text-2xl font-semibold mb-2 text-amber-200">Resume</h2>
              <p className="text-lg text-amber-100 mb-4">
                Below is my resume. You can view or download it directly from here.
              </p>

              {/* PDF Embed */}
              <object
                data="/CV_Kalan_En.pdf" // Make sure this matches your public folder path
                type="application/pdf"
                width="100%"
                height="800px"
              >
                <p>
                  Your browser does not support embedded PDFs. Please{' '}
                  <a href="/resume.pdf" className="text-amber-400 underline">download it</a>{' '}
                  to view.
                </p>
              </object>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Object;
