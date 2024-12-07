import React from 'react'
import { testimonials } from '../constants/constants'

const Testimonial = () => {
  return (
    <div className="bg-white py-10">
          <h2 className="text-3xl font-bold mb-8 text-center">
            What Our Clients Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-10">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.clientName}
                className="bg-gray-100 p-6 rounded-lg shadow-md"
              >
                <p className="text-lg italic mb-4">{testimonial.quote}</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.clientName}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-bold">{testimonial.clientName}</p>
                    <p className="text-sm text-gray-600">
                      {testimonial.clientTitle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
  )
}

export default Testimonial