import clsx from "clsx"
import React from "react"
import EXPLogo from "../../assets/exp_logo.svg"

interface Props {
  className?: string
}

const Logo = ({ className }: Props) => {
  return (
    <div className={clsx("flex items-center", className)}>
      <div className="mr-1.5">
        <img src={EXPLogo} />
      </div>
      <div>{/* <img src="/assets/exp_logo_txt.svg" /> */}</div>

      <h1
        className="text-white"
        style={{
          fontSize: "23px",
        }}
      >
        Expeera
      </h1>
    </div>
  )
}

export default Logo
