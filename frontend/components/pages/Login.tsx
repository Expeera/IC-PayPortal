import React, { useContext } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { AppContext } from "../../App"

interface loginErrorsInterface {
  email: { message: string }
  password: { message: string }
}

export const Login = () => {
  const { login: connect, isAuthenticated, loading } = useContext(AppContext)
  console.log({
    isAuthenticated,
    lastfrom: sessionStorage.getItem("privateRouteLastFrom"),
  })
  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup
      .string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Password must be atleast 8 alpha-numeric characters with atleast one special character and one capital letter",
      )
      .required(),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) })

  const navigate = useNavigate()
  const lastFrom = sessionStorage.getItem("privateRouteLastFrom") || "/"
  const typedErrors = errors as unknown as loginErrorsInterface

  const onSubmit = async (data: any) => {
    try {
      navigate(lastFrom)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex items-center justify-center h-full w-full gap-x-32 max-w-screen-xl mx-auto">
      <div className="flex flex-col items-center justify-center  h-full general-container min-w-[448px] gap-6 ">
        <div className="h-[237.75px] w-full">
          <img
            src={WalletImg}
            alt="wallet"
            className="w-1/2 mx-auto"
            loading="lazy"
          />
        </div>
        <h1 className="text-2xl font-bold text-white mt-8 tracking-wider uppercase">
          Connect to your wallet
        </h1>
        <button
          type="button"
          onClick={connect}
          className="bg-secondary h-10 font-bold text-backGround  rounded-xl py-2 hover:bg-opacity-90 focus:bg-opacity-90 transition-all active:scale-y-105 w-full mb-[-1rem]"
        >
          Connect Using Identity
        </button>
      </div>
      <div className="lg:inline hidden w-[544px]">
        <img src={Cards} alt="cards" loading="lazy" className="" />
      </div>
    </div>
  )
}
