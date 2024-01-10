import React, { Component, ErrorInfo } from 'react'

interface Props {
  children?: React.ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError() // _error: Error
  : State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error('Uncaught error: ', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div
          className='
      flex
      items-center
      justify-center
      w-screen
      h-screen
      bg-white
    '
        >
          <div className='px-40 py-20 bg-orange rounded-md shadow-xl'>
            <div className='flex flex-col items-center'>
              <h1 className='font-bold text-white text-9xl'>500</h1>

              <h6 className='mb-2 text-2xl font-bold text-center text-white md:text-3xl'>
                <span className='text-white'>Oops!</span> Page went wrong
              </h6>

              <p className='mb-8 text-center text-white md:text-lg'>Something went wrong</p>

              <a
                href='/'
                className=' w-52 h-10 rounded-sm text-center   uppercase bg-white text-orange text-sm hover:shadow-sm flex items-center justify-center'
              >
                Go home
              </a>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
