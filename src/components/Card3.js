import React from 'react'

const Card3 = ({ card }) => {
  return (
    <div className="flex flex-col items-center">
      <img src={card.url} alt={card.title} className="w-24 h-24 object-contain mb-3" />
      <h3 className="text-center font-medium text-gray-800">{card.title}</h3>
    </div>
  )
}

export default Card3