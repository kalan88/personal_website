import React from 'react';
import '../css/index.css';

const WebVulture = () => {
  return (
    <div className="min-h-screen bg-gray-800 text-amber-400 p-6 sm:p-12">
      {/* Project Overview Content */}
      <div className="max-w-4xl mx-auto mt-12">
        <div className="space-y-8 font-serif">
          <ProjectCard  
            title="WEBVULTURE"
            description="A user-friendly web vulnerability scanning tool that automates SQL injection testing on websites."
          />
          {/* Adding the ProjectCard with a link and video */}
          <ProjectCard
            title="Demo Video"
            description="Visit the WebVulture GitHub repository or watch our introduction video to learn more."
            link="https://github.com/nokcha0/WebVulture"
            videoUrl="https://www.youtube.com/embed/oK-saO5h9wY"
          />
          <ProjectCard
            title="Inspiration"
            description="Current SQL injection tools, such as sqlmap, are CLI-based and require technical expertise, including integration with tools like Burp Suite. WEBVULTURE addresses these challenges by simplifying pentesting."
          />
          <ProjectCard
            title="What it Does"
            description="WEBVULTURE crawls websites, identifies SQL injection points, mimics human-like interactions with Selenium, and assesses vulnerabilities."
          />
          <ProjectCard
            title="How We Built It"
            description="Frontend: React (JS) and Vite, Backend: Python w/ FastAPI, Selenium, sqlmap, beautifulsoup."
          />
          <ProjectCard
            title="Challenges"
            description="Mimicking human interaction, avoiding bot detection, and handling asynchronous communication from backend to frontend using SSE."
          />
          <ProjectCard
            title="Accomplishments"
            description="Successfully implemented website crawling, injectable form and query detection, bot detection avoidance, and real-time display of terminal outputs."
          />
          <ProjectCard
            title="What's Next"
            description="Plans include more features and attack methods (XSS, CSRF, SSRF) and making the tool even more customizable."
          />
          <ProjectCard
            title="Disclaimer"
            description="The tool is for educational purposes only and must be used on websites you own or have permission to test. Unauthorized use is punishable by law."
          />
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({ title, description, link, videoUrl }) => (
  <div className="bg-gray-700 text-white shadow-md border-2 border-amber-300 p-6 rounded-xl hover:bg-opacity-20 transition-all duration-300 m-4">
    <h2 className="text-2xl font-semibold mb-2 text-amber-200">{title}</h2>
    <p className="text-lg text-amber-100">{description}</p>

    {/* Conditionally render link if provided */}
    {link && (
      <div className="mt-4">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-400 hover:underline"
        >
          Visit the WebVulture GitHub Repository
        </a>
      </div>
    )}

    {/* Conditionally render video if provided */}
    {videoUrl && (
      <div className="mt-4">
        <iframe
          width="100%"
          height="480"
          src={videoUrl}
          title="WebVulture Introduction"
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    )}
  </div>
);

export default WebVulture;
