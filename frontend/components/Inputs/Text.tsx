import classNames from "classnames";
import React, { forwardRef } from "react"

type TextInputProps = {
  label: string;
  isTransperant?: boolean;
  // any other props you want to pass to the input element
} & React.InputHTMLAttributes<HTMLInputElement>

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, onChange, ...props }: TextInputProps, ref) => {
    const uuid = crypto.randomUUID()
    return (
      <div className={classNames('relative rounded-md shadow-sm w-full transition-all bg-white', 
      { 'bg-transparent': props.isTransperant })}      
      >
        <input
          id={uuid}
          onChange={onChange}
          {...props}
          ref={ref}
          placeholder=" "
          className={classNames(
            "block px-2.5 pb-2.5 pt-4 w-full text-sm  text-gray-900 bg-transparent rounded-lg border-2 bg-white border-gray-300 shadow-sm shadow-neutral-200 appearance-none  focus:outline-transparent focus:ring-0 focus:border-primary-50 peer",
            { "drop-shadow-none border-white/30 bg-transparent text-accent": props.isTransperant },
          )}
        />
        <label
          htmlFor={uuid}
          className="absolute cursor-text text-sm text-gray-400  duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0]   px-2 peer-focus:px-2 peer-focus:text-primary-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-place-holder-shown:text-xs peer-focus:top-4  peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
        >
          {label}
        </label>
      </div>
    )
  },
)

export default TextInput
