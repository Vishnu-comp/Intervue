import React from 'react'
import Star from '../../src/assets/icon/Star.svg';

const InterviewIcon = ({ align = 'center' }) => {
  const alignmentClass = align === 'left' ? 'justify-start' : 'justify-center';

  return (
    <div className={`flex ${alignmentClass} mb-8`}>
      <span className="inline-flex items-center gap-2 px-4 py-1 bg-gradient-to-r from-[#7565D9] to-[#4D0ACD] h-[31px] w-[150px] text-white rounded-full text-sm">
        <img src={Star} alt="star icon" className="w-4 h-4" />
        <p className="font-semibold">Interview Poll</p>
      </span>
    </div>
  )
}

export default InterviewIcon;
