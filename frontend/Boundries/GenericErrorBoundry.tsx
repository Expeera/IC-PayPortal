import React, { Component, ErrorInfo, ReactNode } from "react"
import { toast } from "react-toastify"
interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

class GenericErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // toast.error("Something went wrong")
    console.error("Uncaught error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return <></>
    }

    return this.props.children
  }
}

export { GenericErrorBoundary }
