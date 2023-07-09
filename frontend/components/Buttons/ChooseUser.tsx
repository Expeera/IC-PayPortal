import React from "react"
import User from "../../assets/user.png"
import { Link } from "react-router-dom"

export const ChooseUser = ({ to, label }: any) => {
  return (
    <Link
      to={to}
      className="bg-box cursor-pointer bg-no-repeat px-[14px] pt-[11rem] pb-8 relative min-w-[22rem] min-h-[20rem]  "
    >
      <img src={User} alt="user" className="mt-[-16rem] mx-auto w-[248px] h-[260px]" loading="lazy" />
      <h6 className="m-5 font-semibold text-secondary text-2xl">{label}</h6>
    </Link>
  )
}
