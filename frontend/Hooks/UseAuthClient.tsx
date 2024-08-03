//courtesy of ic-avatar example code
import { ActorSubclass, Actor, HttpAgent } from "@dfinity/agent"
import { AuthClient } from "@dfinity/auth-client"
import { canisterId, createActor } from "../declarations/fiat"

import { _SERVICE } from "../declarations/fiat/fiat.did"
import react, { useEffect, useState } from "react"
import { Principal } from "@dfinity/principal"
import { toast } from "react-toastify"
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

export function useAuthClient(props?: UseAuthClientProps) {
  const [authClient, setAuthClient] = useState<AuthClient>()
  const [actor, setActor] = useState<ActorSubclass<_SERVICE>>()
  const [isAuthenticated, setIsAuthenticated] = useState<null | boolean>(null)
  const [loading, setLoading] = useState(false)

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
        console.log("setIsAuthenticated", isAuthenticated)
      }
    })
  }
  const login = (cb) => {
    setLoading(true)

    const days = BigInt(1)
    const hours = BigInt(24)
    const nanoseconds = BigInt(3600000000000)
    console.log(isAuthenticated, "isauthhhhh")

    authClient?.login({
      identityProvider: process.env.II_URL,
      maxTimeToLive: days * hours * nanoseconds,
      onSuccess: async () => {
        if (!isAuthenticated) {
          console.log("here2")
          cb("/checkout")
          toast.info("Login successful")
          setIsAuthenticated(true)
          await initActor()
        }
      },
      onError: (err) => {
        toast.error("failed to login , please try again later")
        console.log(err)
        setLoading(false)
      },
    })
  }

  const isOwner = async () => {
    if (!actor) return false

    const checkOwner = await actor.is_owner()
    console.log("checkOwner: ", {
      checkOwner,
    })
    return checkOwner
  }

  const initActor = async () => {
    console.log({ auth: await authClient.isAuthenticated() })
    try {
      const actor = createActor(canisterId as string, {
        agentOptions: {
          identity: authClient?.getIdentity(),
        },
      })
      setActor(actor)
      if (authClient) {
        console.log("aaaaaaa", authClient?.getIdentity())
      }

      setLoading(true)
      console.log(
        "aaaaaaaaaaaa",
        authClient?.getIdentity().getPrincipal().toString(),
      )
    } catch (error) {
      console.log({ error })
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    localStorage.clear()
    sessionStorage.clear()
    setIsAuthenticated(false)
    setActor(undefined)
    initializeAuthClient()
    await authClient.logout()
    toast.info("Logout successful")
  }

  useEffect(() => {
    initializeAuthClient()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      initActor()
    }
  }, [isAuthenticated])

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
  }
}
