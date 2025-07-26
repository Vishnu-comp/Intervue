import React from "react";

const PollResults = ({ pollResults }) => {
  const totalVotes = Object.values(pollResults).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-2">
      {Object.entries(pollResults).map(([option, votes], index) => {
        const percentage = totalVotes ? ((votes / totalVotes) * 100).toFixed(0) : 0;
        return (
          <div
            key={index}
            className="relative bg-gray-50 border border-gray-200 rounded-lg overflow-hidden"
          >
            {/* Percentage Background Bar */}
            <div
              className="absolute top-0 left-0 h-full bg-[#7765DA] transition-all duration-500"
              style={{ width: `${percentage}%` }}
            ></div>

            {/* Option + Percentage */}
            <div className="relative flex justify-between items-center p-4 z-10">
              <div className="flex items-center">
                <div
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-500 mr-3"
                >
                  {index + 1}
                </div>
                <span className="font-medium text-black">{option}</span>
              </div>
              <span className="text-sm font-semibold text-black">{percentage}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PollResults;
