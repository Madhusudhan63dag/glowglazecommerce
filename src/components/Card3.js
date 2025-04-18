import React from 'react'

const Card3 = ({ card }) => {
  return (
    <div className="flex flex-col items-center p-2">
      <img src={card.url} alt={card.title} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain mb-2 sm:mb-3" />
      <h3 className="text-center text-xs sm:text-sm md:text-base font-medium text-gray-800 truncate w-full">{card.title}</h3>
    </div>
  )
}

export default Card3