import { AuthProvider } from "./context/AuthContext";
import AppRouter from "./app/router";
import "./styles/variables.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/pages.css";

function App() {
    return (
        <AuthProvider>
            <AppRouter />
        </AuthProvider>
    );
}

export default App;
