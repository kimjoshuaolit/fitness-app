import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Phase = { id: string; name: string; status: string }

export function Phases() {
  const [phases, setPhases] = useState<Phase[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase
      .from('phases')
      .select('*')
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setPhases(data)
      })
  }, [])

  if (error) return <p className="login-error">Query failed: {error}</p>
  if (phases === null) return <p>Loading phases…</p>

  return (
    <section>
      <p>
        ✅ Query returned <strong>{phases.length}</strong> phase
        {phases.length === 1 ? '' : 's'}. Auth + RLS + client are working.
      </p>
      <pre>{JSON.stringify(phases, null, 2)}</pre>
    </section>
  )
}
