
import React, { useState } from 'react';
import '../css/index.css';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-800 text-amber-400 p-6 sm:p-12">
      {/* About Section with Full Page Height */}
      <About />

      {/* Projects Section */}
      <div className="max-w-4xl mx-auto mt-12"> {/* Added margin top for spacing */}
        <div className="space-y-8 font-serif">
          <ProjectCard  
            title="To-do List:"
            description="A to-do list implemented with MongoDB."
          />
          <ProjectCard
            title="WebVulture: "
            description="A web-based UI for SQLMap that simplifies SQL injection testing for security professionals and researchers. Users can customize attack parameters and view results directly in the browser."
          />
          <ProjectCard
            title=" - : "
            description="-."
          />
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({ title, description }) => (
  <div className="bg-gray-700 text-white shadow-md border-2 border-amber-300 p-6 rounded-xl hover:bg-opacity-20 transition-all duration-300 m-4">
    <h2 className="text-2xl font-semibold mb-2 text-amber-200">{title}</h2>
    <p className="text-lg text-amber-100">{description}</p>
  </div>
);

const About = () => {
  const [glowStyle, setGlowStyle] = useState({});

  // Calculate distance and update glow effect
  const handleMouseMove = (e) => {
    const element = e.target.getBoundingClientRect();
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Calculate distance from element center
    const centerX = element.left + element.width / 2;
    const centerY = element.top + element.height / 2;
    const distance = Math.sqrt(
      (mouseX - centerX) ** 2 + (mouseY - centerY) ** 2
    );

    // Map the distance to glow intensity
    const maxDistance = Math.max(window.innerWidth, window.innerHeight) / 2;
    const intensity = Math.min(1 - distance / maxDistance, 1);

    // Set the text glow effect based on distance
    setGlowStyle({
      textShadow: `0 0 ${40 * intensity}px rgba(255, 215, 0, ${intensity})`,
    });
  };

  return (
    <div
      className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-6 font-serif text-amber-400"
      onMouseMove={handleMouseMove}
    >
      <p
        className="text-lg text-center block m-4"
        style={glowStyle}
      >
        Just a personal website with some of my projects.
      </p>
    </div>
  );
};


export default Home;
