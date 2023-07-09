import React, { forwardRef, useImperativeHandle, useState } from "react"
import clsx from "clsx"
export const Toggle = forwardRef(
  (
    { disabled, checked, ...rest }: React.InputHTMLAttributes<HTMLInputElement>,
    ref,
  ) => {
    const [isToggled, setIsToggled] = useState(checked)

    useImperativeHandle(ref, () => ({
      value: isToggled,
    }))

    return (
      <label
        className={clsx(
          "relative inline-flex flex-shrink-0 h-5 w-full border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 ",
          {
            "bg-primary-900": !isToggled,
            "bg-secondary": isToggled,
            "pointer-events-none opacity-90": disabled,
          },
        )}
      >
        <input
          {...rest}
          type="checkbox"
          className="absolute opacity-0 h-0 w-0 peer"
          checked={isToggled}
          onChange={() => !disabled && setIsToggled(!isToggled)}
        />
        <span
          className={clsx(
            "relative inline-block h-4 w-4 peer-focus:bg-neutral-400 active:bg-white hover:bg-neutral-400 rounded-full bg-white shadow transform transition-all ease-in-out duration-270",
            {
              "[inset-inline-start:calc(100%_-_1rem_-_.5px)] ": isToggled,
              "[inset-inline-start:0]": !isToggled,
              "pointer-events-none ": disabled,
            },
          )}
        ></span>
      </label>
    )
  },
)
