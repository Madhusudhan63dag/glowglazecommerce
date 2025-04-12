import React from 'react'

const Card = ({card}) => {
  return (
    <div>
        <a href="#">
            <div className="card">
                <div className="card-body w-full flex flex-col items-center justify-center p-4 hover:scale-105 transition-transform duration-300 ease-in-out">
                    <div className="relative flex flex-col items-center">
                        <img 
                            src={"https://placehold.co/250x250/000000/FFFFFF/png?text=Product+Image"} 
                            alt={card.name} 
                            className='rounded-tr-[40px] rounded-tl-[40px] w-full object-cover' 
                        />
                        <div className='bg-slate-300 py-5 px-8 relative -top-5 -z-10 rounded-br-[40px] rounded-bl-[40px] w-full text-center'>
                            {card.name}
                        </div>
                    </div>
                </div>
            </div>
        </a>
    </div>
  )
}

export default Card