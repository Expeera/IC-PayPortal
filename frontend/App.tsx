/*
 * Import necessary dependencies and components.
 */
import React, { useState } from "react" // Core React library and useState hook.
import { BrowserRouter, Route, Routes } from "react-router-dom" // React Router for client-side routing.
import { DefaultLayout } from "./components/Layouts/Default" // Default layout component for wrapping pages.
import { ToastContainer } from "react-toastify" // Toast notifications container.
import { Authenticated } from "./Guards/Authenticated" // A guard component to protect routes.
import "react-toastify/dist/ReactToastify.css" // Toastify CSS for notifications.
import { AuthClient } from "@dfinity/auth-client" // DFINITY AuthClient for authentication.
import { useAuthClient } from "./Hooks/UseAuthClient" // Custom hook to manage authentication.
import { ActorSubclass } from "@dfinity/agent" // DFINITY ActorSubclass type.
import { _SERVICE } from "./declarations/fiat/fiat.did" // TypeScript definition for the Fiat canister service.
import Form from "./components/pages/Form" // Form page component for handling checkout.
import Success from "./components/pages/Success" // Success page component for payment success.
import Admin from "./components/pages/Admin" // Admin page component for administrative tasks.
import Cancel from "./components/pages/Cancel" // Cancel page component for payment cancellation.
import "bootstrap/dist/css/bootstrap.min.css" // Bootstrap CSS for styling.
import MyInvoices from "./components/pages/MyInvoices" // Page component to display user invoices.

/*
 * Define the interface for the application's state, which includes various properties related to authentication,
 * loading state, and actor management.
 */
interface AppStateInterface {
  authClient?: AuthClient // Optional AuthClient instance for managing user authentication.
  loading: boolean // Boolean to indicate loading state.
  setAuthClient?: React.Dispatch<React.SetStateAction<AuthClient | undefined>> // Optional setter for AuthClient.
  isAuthenticated?: boolean | null // Optional boolean indicating if the user is authenticated.
  setIsAuthenticated?: React.Dispatch<React.SetStateAction<boolean | null>> // Optional setter for authentication state.
  login: (cb: (path: string) => void) => void // Login function that accepts a callback to handle redirects.
  logout: () => void // Logout function to clear authentication.
  handlePageView: (page: string, productDetails?: any) => void // Function to handle page views, possibly with product details.
  actor?: ActorSubclass<_SERVICE> // Optional DFINITY actor subclass for interacting with a canister service.
  isOwner?: () => boolean | Promise<boolean> // Optional function to check if the authenticated user is an owner.
}

/*
 * Define the initial application state with default values.
 */
const INITIAL_APP_STATE: AppStateInterface = {
  isAuthenticated: false, // Default to not authenticated.
  loading: false, // Default loading state to false.
  login: () => {}, // Default login function as a no-op.
  logout: () => {}, // Default logout function as a no-op.
  handlePageView: () => {}, // Default page view handler as a no-op.
  actor: undefined, // Default actor to undefined.
  isOwner: async () => false, // Default owner check to always return false.
}

/*
 * Create a React context with the initial application state.
 * This context will be used to provide and consume app-wide state.
 */
export const AppContext =
  React.createContext<AppStateInterface>(INITIAL_APP_STATE)

/*
 * Main App component responsible for rendering the application's routes and managing global state.
 */
function App() {
  /*
   * Destructure values from the useAuthClient hook, which manages authentication and actor state.
   */
  const {
    handlePageView, // Function to handle page views.
    authClient, // DFINITY AuthClient instance.
    setAuthClient, // Setter for AuthClient instance.
    isAuthenticated, // Boolean indicating if the user is authenticated.
    setIsAuthenticated, // Setter for authentication state.
    login, // Function to log the user in.
    logout, // Function to log the user out.
    actor, // DFINITY actor for interacting with the canister service.
    loading, // Boolean indicating if the app is in a loading state.
    isOwner, // Function to check if the user is an owner.
  } = useAuthClient()

  /*
   * Render the main application component with routing and global state provider.
   */
  return (
    <AppContext.Provider
      value={{
        handlePageView, // Provide page view handler.
        authClient, // Provide AuthClient instance.
        setAuthClient, // Provide setter for AuthClient.
        isAuthenticated, // Provide authentication state.
        loading, // Provide loading state.
        setIsAuthenticated, // Provide setter for authentication state.
        login, // Provide login function.
        logout, // Provide logout function.
        isOwner, // Provide owner check function.
        actor, // Provide DFINITY actor.
      }}
    >
      <div className="App">
        {/* Define the main router and routes for the application. */}
        <BrowserRouter>
          <Routes>
            <Route path="/auth/login" element={<DefaultLayout />} />{" "}
            {/* Route for login page. */}
            <Route
              path="stripe/success/:invoiceNo"
              element={<Success />}
            />{" "}
            {/* Route for Stripe payment success. */}
            <Route path="stripe/cancel/:invoiceNo" element={<Cancel />} />{" "}
            {/* Route for Stripe payment cancellation. */}
            <Route
              path="paypal/success/:invoiceNo"
              element={<Success />}
            />{" "}
            {/* Route for PayPal payment success. */}
            <Route path="paypal/cancel/:invoiceNo" element={<Cancel />} />{" "}
            {/* Route for PayPal payment cancellation. */}
            <Route path="/checkout" element={<Form />} />{" "}
            {/* Route for checkout form. */}
            <Route path="/my-invoices" element={<MyInvoices />} />{" "}
            {/* Route to display user invoices. */}
            <Route path="/admin" element={<Admin />} />{" "}
            {/* Route for admin dashboard. */}
            <Route
              path="/"
              element={
                <Authenticated>
                  {" "}
                  {/* Protected route that requires authentication. */}
                  <DefaultLayout />{" "}
                  {/* Render the default layout if authenticated. */}
                </Authenticated>
              }
            ></Route>
          </Routes>
        </BrowserRouter>
        <ToastContainer /> {/* Container for toast notifications. */}
      </div>
    </AppContext.Provider>
  )
}

export default React.memo(App) // Export the App component with React.memo for performance optimization.
