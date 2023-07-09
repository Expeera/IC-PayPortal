// big circle component with text and icon

import React from "react"
import { Link } from "react-router-dom"

export const BigCircleLink = ({ Icon, title, description, href }) => {
  return (
    <Link
      to={href}
      className="group rounded-full hover:scale-110 transition-all "
    >
      <div
        className={`flex flex-col h-72 w-72 gap-4  ring-transparent transition-all  items-center justify-center text-center`}
      >
        <div
          className={`group-hover:scale-105 duration-400 flex items-center transition-all justify-center `}
        >
          <Icon
            style={{
              color: "#199B45",
            }}
            className="w-20 h-20 object-cover color-red"
          />
        </div>
        <h1
          className="
                text-white
                group-hover:text-md duration-400
                text-sm font-bold transition-all group-hover:text-primary"
        >
          {title}
        </h1>
        <p
          className="
                    group-hover:underline
                    hover:text-white
                group-hover:text-white-900
                 duration-300 transition-all text-xs text-neutral-500 capitalize p-2"
        >
          {description}
        </p>
      </div>
    </Link>
  )
}
