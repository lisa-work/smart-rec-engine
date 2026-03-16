import { useMemo, useState } from 'react'
import supabase from './utils/supabase'
import './App.css'

function App() {
  const [apiStatus, setApiStatus] = useState('Not checked')
  const [supabaseStatus, setSupabaseStatus] = useState('Not checked')

  const browserClientStatus = useMemo(() => {
    const hasUrl = Boolean(import.meta.env.VITE_SUPABASE_URL)
    const hasKey = Boolean(import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY)

    if (!hasUrl || !hasKey) {
      return 'Missing Vite Supabase env variables'
    }

    return supabase ? 'Configured from Vite env' : 'Not configured'
  }, [])

  const readResponseBody = async (response: Response) => {
    const raw = await response.text()
    if (!raw) {
      return null
    }

    try {
      return JSON.parse(raw)
    } catch {
      return { raw }
    }
  }

  const checkFlask = async () => {
    setApiStatus('Checking...')
    try {
      const response = await fetch('/api/health')
      const data = await readResponseBody(response)

      if (!response.ok) {
        const details = data?.message || data?.raw || 'Non-JSON error response from server'
        setApiStatus(`${response.status} - ${details}`)
        return
      }

      setApiStatus(`${response.status} - ${data?.status || 'ok'}`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      setApiStatus(`Error - Cannot reach backend. Start Flask on port 5000. (${message})`)
    }
  }

  const checkSupabase = async () => {
    setSupabaseStatus('Checking...')
    try {
      const response = await fetch('/api/supabase/health')
      const data = await readResponseBody(response)

      if (!response.ok) {
        const details = data?.message || data?.raw || 'Non-JSON error response from server'
        setSupabaseStatus(`${response.status} - ${details}`)
        return
      }

      const statusLabel = data?.supabase_status_code
        ? `${response.status} - Supabase ${data.supabase_status_code}`
        : `${response.status} - ${data?.status || 'ok'}`
      setSupabaseStatus(statusLabel)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      setSupabaseStatus(`Error - Cannot reach backend. Start Flask on port 5000. (${message})`)
    }
  }

  return (
    <main className="container">
      <h1>Smart Rec Engine</h1>
      <p className="subtitle">Flask + Supabase setup check</p>

      <section className="card">
        <h2>Supabase Browser Client</h2>
        <p className="status">{browserClientStatus}</p>
        <p className="hint">Using Vite env variables from the frontend .env file.</p>
      </section>

      <section className="card">
        <h2>Backend API</h2>
        <p className="status">{apiStatus}</p>
        <button onClick={checkFlask}>Check Flask</button>
      </section>

      <section className="card">
        <h2>Supabase Connection</h2>
        <p className="status">{supabaseStatus}</p>
        <button onClick={checkSupabase}>Check Supabase</button>
      </section>
    </main>
  )
}

export default App
