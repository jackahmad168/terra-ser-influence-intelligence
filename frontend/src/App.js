import './App.css';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';
import Campaigns from './Campaigns';
import Dashboard from './Dashboard';

function AppContent() {
  const { token } = useAuth();

  if (!token) {
    return <Login />;
  }

  return (
    <div className="App">
      <nav className="nav-tabs">
        <button className="nav-tab active">Campaigns</button>
        <button className="nav-tab">Influencers</button>
      </nav>
      <Campaigns />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
