import React, { useState, useEffect } from 'react'
import JiraAuthLoading from './components/JiraAuthLoading'

function App() {
  const [authData, setAuthData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Parse URL parameters for OAuth callback
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const state = urlParams.get('state')
    const error = urlParams.get('error')
    const errorDescription = urlParams.get('error_description')

    if (error) {
      setError({
        type: error,
        description: errorDescription || 'Authentication failed'
      })
    } else if (code && state) {
      setAuthData({
        code,
        state,
        timestamp: new Date().toISOString()
      })
    }
  }, [])

  return (
    <div className="App">
      <JiraAuthLoading 
        authData={authData}
        error={error}
        onRedirect={(data) => {
          // Handle redirect to VS Code
          const vscodeUrl = `vscode://extension/your-extension-id/auth-callback?${new URLSearchParams(data).toString()}`
          window.location.href = vscodeUrl
        }}
      />
    </div>
  )
}

export default App