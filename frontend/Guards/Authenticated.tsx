/*
    @params:{Component:ReactNode}
    an hoc component that checks if the user is authenticated
    otherwise will redirect him to login page
*/

import { AppContext } from "../App"
import React, { useContext } from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"

export const Authenticated = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useContext(AppContext)

  // if the user has refreshed the page or visited the guard directly get him out of here
  const navigate = useNavigate()
  if (!children) {
    navigate("/")
  }

  const { state: LocationState, pathname } = useLocation()

  sessionStorage.setItem("privateRouteLastFrom", pathname)
  console.log(loading)
  if (loading) return <></>

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/auth/login" state={LocationState} />
  )
}
