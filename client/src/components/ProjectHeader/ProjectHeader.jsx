// ProjectHeader.jsx
import React from 'react';

const ProjectHeader = ({ meme }) => {
  return (
    <div className="w-full px-4 pb-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-center gap-3">
          {meme?.logo && (
            <img
              src={meme.logo}
              alt={meme.projectName || ''}
              className="w-12 h-12 rounded-full bg-[#1E1E22] object-cover border border-[#FFD700]/10"
            />
          )}
          <div className="text-center">
            <h1 className="text-2xl font-serif text-white">
              {meme?.projectName || ''}
            </h1>
            <p className="text-sm text-gray-400">
              {meme?.projectDetails?.network || ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
