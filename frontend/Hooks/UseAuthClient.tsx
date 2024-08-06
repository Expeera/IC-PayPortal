// Courtesy of IC-avatar example code
import { ActorSubclass } from "@dfinity/agent" // Importing types and classes from DFINITY's agent package.
import { AuthClient } from "@dfinity/auth-client" // Importing the AuthClient class for handling authentication.
import { canisterId, createActor } from "../declarations/fiat" // Importing the canister ID and actor creation function.
import { _SERVICE } from "../declarations/fiat/fiat.did" // Importing the TypeScript definition of the canister service.
import { useEffect, useState } from "react" // Importing hooks from React for state management and side effects.
import { Principal } from "@dfinity/principal" // Importing the Principal type from DFINITY's principal package.
import { toast } from "react-toastify" // Importing toast notifications for user feedback.

type UseAuthClientProps = {}

export interface Invoice {
  id: number
  owner: Principal
  amount: number
  status: string
  transactionId: string
  paymentLink: string
  paymentMethod: string
  currency: string
  createdAt: number
}

/**
 * Custom hook that manages the authentication state and interactions with the DFINITY canister.
 */
export function useAuthClient(props?: UseAuthClientProps) {
  // State variables to manage authentication, actor, and loading state.
  const [authClient, setAuthClient] = useState<AuthClient>() // AuthClient instance for managing user authentication.
  const [actor, setActor] = useState<ActorSubclass<_SERVICE>>() // Actor instance for interacting with the canister.

  const [isAuthenticated, setIsAuthenticated] = useState<null | boolean>(null) // Tracks if the user is authenticated.
  const [hasLoggedIn, setHasLoggedIn] = useState(false) // Tracks if the user has logged in.
  const [loading, setLoading] = useState(false) // Tracks if an action is in progress.
  const [loadingUser, setLoadingUser] = useState(false) // Tracks if the user information is being loaded.
  const [balance, setBalance] = useState("") // Stores the user's balance (currently unused).
  const [pageView, setPageView] = useState("products") // Tracks the current page view.
  const [productSelected, setProductSelected] = useState("products") // Tracks the currently selected product.

  /**
   * Handles changing the page view and selected product.
   * @param page The page to view.
   * @param productDetails Optional details of the selected product.
   */
  const handlePageView = (page: string, productDetails?: any) => {
    setPageView(page)
    setProductSelected(productDetails)
  }

  /**
   * Initializes the AuthClient instance and checks if the user is authenticated.
   */
  const initializeAuthClient = (): Promise<void> => {
    return AuthClient.create({
      idleOptions: {
        disableDefaultIdleCallback: true,
        disableIdle: true,
      },
    }).then(async (client) => {
      setAuthClient(client)
      if (!isAuthenticated) {
        const isAuthenticated = await client.isAuthenticated()
        setIsAuthenticated(isAuthenticated)
      }
    })
  }

  /**
   * Handles the login process, including setting up the actor and redirecting to the checkout page.
   * @param cb Callback function for handling the post-login redirect.
   */
  const login = (cb: (path: string) => void) => {
    setLoading(true)

    const days = BigInt(1)
    const hours = BigInt(24)
    const nanoseconds = BigInt(3600000000000)
    authClient?.login({
      identityProvider: process.env.II_URL,
      maxTimeToLive: days * hours * nanoseconds,
      onSuccess: async () => {
        cb("/checkout")
        toast.info("Login successful")
        setIsAuthenticated(true)
        setTimeout(() => {
          setHasLoggedIn(true)
        }, 100)
        await initActor() // Initialize the actor after successful login.
      },
      onError: (err) => {
        toast.error("Failed to login, please try again later")
        console.log(err)
        setLoading(false)
      },
    })
  }

  /**
   * Checks if the authenticated user is the owner.
   * @returns A promise that resolves to a boolean indicating if the user is an owner.
   */
  const isOwner = async (): Promise<boolean> => {
    if (!actor) return false
    const checkOwner = await actor.is_owner()
    return checkOwner
  }

  /**
   * Initializes the actor for interacting with the canister, including setting up identity and checking ownership.
   */
  const initActor = async () => {
    try {
      const actor = createActor(canisterId as string, {
        agentOptions: {
          identity: authClient?.getIdentity(),
        },
      })
      setActor(actor)
      const isOwnerVal = await isOwner()
      if (authClient) {
        console.log("address owner", authClient.getIdentity())
      }

      setLoading(true)
      console.log(
        "address owner",
        authClient?.getIdentity().getPrincipal().toString(),
      )
    } catch (error) {
      console.log({ error })
      toast.info("Fetching user failed, please try again later")
    } finally {
      setLoading(false)
    }
  }

  /**
   * Logs out the user, clears local storage, and reinitializes the AuthClient.
   */
  const logout = async () => {
    localStorage.clear()
    sessionStorage.clear()
    setIsAuthenticated(false)
    setActor(undefined)
    setLoadingUser(false)
    initializeAuthClient()
    await authClient.logout()
    toast.info("Logout successful")
  }

  /**
   * Effect hook that runs once on component mount to initialize the AuthClient.
   */
  useEffect(() => {
    initializeAuthClient()
  }, [])

  /**
   * Effect hook that runs when `isAuthenticated` changes to initialize the actor if the user is authenticated.
   */
  useEffect(() => {
    if (isAuthenticated) {
      initActor()
    }
  }, [isAuthenticated])

  // Return the authentication state and functions to be used by components.
  return {
    authClient,
    setAuthClient,
    isAuthenticated,
    loading,
    setIsAuthenticated,
    login,
    logout,
    isOwner,
    actor,
    balance,
    hasLoggedIn,
    loadingUser,
    handlePageView,
  }
}
