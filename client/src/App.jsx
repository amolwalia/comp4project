import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import LoadingScreen from './components/LoadingScreen';
import ViewportFrame from './components/ViewportFrame';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <LoadingScreen label="Checking your session..." />;
  }

  return (
    <main className="app-shell">
      <ViewportFrame>{user ? <Dashboard /> : <AuthScreen />}</ViewportFrame>
    </main>
  );
}
