import React, { useState, useEffect, useRef } from 'react'

const Card = ({card}) => {
  const [fontSize, setFontSize] = useState('');
  const textRef = useRef(null);

  // Calculate font size based on text length
  useEffect(() => {
    if (card && card.name) {
      const nameLength = card.name.length;
      if (nameLength > 30) {
        setFontSize('text-[10px] sm:text-xs md:text-sm');
      } else if (nameLength > 20) {
        setFontSize('text-xs sm:text-sm md:text-base');
      } else {
        setFontSize('text-xs sm:text-sm md:text-base font-medium sm:font-semibold');
      }
    }
  }, [card]);

  return (
    <div className="w-full">
        <a href="#">
            <div className="card">
                <div className="card-body w-full flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 hover:scale-105 transition-transform duration-300 ease-in-out">
                    <div className="relative flex flex-col items-center w-full">
                        <img 
                            src={"https://placehold.co/250x250/000000/FFFFFF/png?text=Product+Image"} 
                            alt={card.name} 
                            className='rounded-tr-[20px] sm:rounded-tr-[30px] md:rounded-tr-[40px] 
                                      rounded-tl-[20px] sm:rounded-tl-[30px] md:rounded-tl-[40px] 
                                      w-full object-cover' 
                        />
                        <div className='bg-slate-300 py-2 sm:py-3 md:py-5 px-2 sm:px-4 md:px-8 
                                       relative -top-3 sm:-top-4 md:-top-5 -z-10 
                                       rounded-br-[20px] sm:rounded-br-[30px] md:rounded-br-[40px] 
                                       rounded-bl-[20px] sm:rounded-bl-[30px] md:rounded-bl-[40px] 
                                       w-full text-center'>
                            <div className="relative group">
                                <span 
                                    ref={textRef}
                                    className={`${fontSize} inline-block w-full truncate`}
                                    title={card.name} // Native HTML tooltip
                                >
                                    {card.name}
                                </span>
                                
                                {/* Custom tooltip that appears on hover (better styled than native) */}
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded 
                                                opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap
                                                max-w-[200px] overflow-hidden text-ellipsis hidden sm:block z-10">
                                    {card.name}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    </div>
  )
}

export default Card