/*
 * Import canister definitions like this:
 */
import React, { useState } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { DefaultLayout } from "./components/Layouts/Default"
import { ToastContainer } from "react-toastify"
import { Authenticated } from "./Guards/Authenticated"
import { Login } from "./components/pages/Login"
import "react-toastify/dist/ReactToastify.css"
import { AuthClient } from "@dfinity/auth-client"
import { useAuthClient } from "./Hooks/UseAuthClient"
import { ActorSubclass } from "@dfinity/agent"
import { _SERVICE } from "./declarations/fiat/fiat.did"
import Form from "./components/pages/Form"
import Success from "./components/pages/Success"
import Admin from "./components/pages/Admin"
import Cancel from "./components/pages/Cancel"
import "bootstrap/dist/css/bootstrap.min.css"
import MyInvoices from "./components/pages/MyInvoices"
import Header from "./components/Header"

interface AppStateInterface {
  authClient?: AuthClient
  loading: boolean
  setAuthClient?: React.Dispatch<AuthClient>
  isAuthenticated?: boolean | null
  setIsAuthenticated?: React.Dispatch<React.SetStateAction<boolean | null>>
  login: () => void
  logout: () => void
  handlePageView:()=>void
  actor: ActorSubclass<_SERVICE>
  isOwner?: () => boolean | Promise<boolean>
}
const INITIAL_APP_STATE = {
  isAuthenticated: false,
  loading: false,
  user: null,
  login: () => {},
  logout: () => {},
  handlePageView: () => {},
  isOwner: async () => {},
  nftActor: undefined,
  ledgerActor: undefined,
}


export const AppContext =
  React.createContext<AppStateInterface>(INITIAL_APP_STATE)

// @todo take all the strings to a seperate file and import them here
// @todo take the routing logic out of the app component
function App() {
  
  const {
    handlePageView,
    authClient,
    setAuthClient,
    isAuthenticated,
    setIsAuthenticated,
    login,
    logout,
    actor,
    loading,
    isOwner,
  } = useAuthClient()

  return (
    <AppContext.Provider
      value={{
        handlePageView,
        authClient,
        setAuthClient,
        isAuthenticated,
        loading,
        setIsAuthenticated,
        login,
        logout,
        isOwner,
        actor,
      }}
    >
      <div className="App">
        {/* fixed loader that wouldnt appear unless loading is true also , it is fixed spinner with primary color  */}
        <BrowserRouter>
          <Routes>
            <Route path="/auth/login" element={<DefaultLayout />} />
            {/* <Route
                path="login"
                element={!isAuthenticated ? <Login /> : <DefaultLayout />}
              ></Route>
            </Route> */}
            <Route path="stripe/success/:invoiceNo" element={<Success />} />
            <Route path="stripe/cancel/:invoiceNo" element={<Cancel />} />

            <Route path="paypal/success/:invoiceNo" element={<Success />} />
            <Route path="paypal/cancel/:invoiceNo" element={<Cancel />} />

            <Route path="/checkout" element={ <Form />} />
            <Route path="/my-invoices" element={<MyInvoices />} />
            <Route path="/admin" element={<Admin />} />
            <Route
              path="/"
              element={
                <Authenticated>
                        {/* <Header handlePageView={handlePageView} /> */}

                  <DefaultLayout />
                </Authenticated>
              }
            ></Route>
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </div>
    </AppContext.Provider>
  )
}

export default React.memo(App)