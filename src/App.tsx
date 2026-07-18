import { useAuth } from "./lib/AuthContext";
import { LoginForm } from "./components/LoginForm";
import { Phases } from "./components/Phases";
import { supabase } from "./lib/supabase";
import { WeightForm } from "./components/WeightForm";
import { WeightChart } from "./components/WeightChart";
import "./App.css";

function App() {
  const { session, loading } = useAuth();

  if (loading) return null;
  if (!session) return <LoginForm />;

  return (
    <main className="app-main">
      <p>Signed in as {session.user.email}</p>
      <button type="button" onClick={() => supabase.auth.signOut()}>
        Sign out
      </button>
      <Phases />
      <WeightForm />
      <WeightChart />
    </main>
  );
}

export default App;
