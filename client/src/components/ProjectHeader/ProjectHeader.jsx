//ProjectHeader.jsx
import React from 'react';

const ProjectHeader = ({ meme }) => {
  return (
    <div className="w-full px-4">
      <div className="flex items-center justify-center gap-4">
        {meme?.logo && (
          <img 
            src={meme.logo}
            alt={meme.projectName || ''}
            className="w-12 h-12 rounded-full bg-gray-800 object-cover"
          />
        )}
        <h1 className="text-2xl font-bold text-white">
          {meme?.projectName || ''}
        </h1>
      </div>
    </div>
  );
};

export default ProjectHeader;