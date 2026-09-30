import CustomerApp from './CustomerApp';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <CustomerApp />
    </AuthProvider>
  );
}
