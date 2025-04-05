import { useState } from "preact/hooks";
import { Link, useLocation } from "wouter-preact";
import { login } from "../services/authService";
import Message from "../components/Message";
import styles from '../styles/Auth.module.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [, navigate] = useLocation();

  const handleLogin = async (e: Event) => {
    e.preventDefault(); 

    try {
      const user = await login(email, password);
      console.log("Authenticated user:", user);
      navigate("/"); 
    } catch (error) {
      console.error("Error logging:", error);
      setErrorMessage("Failed to authenticate. Please check your credentials.");
      setShowError(true);
    }
  };

  return (
    <main>
        <div class={styles.content}>
        <div class="viewport">
            <h1 class={styles.center}>Sign in</h1>
            <p class={styles.center}>Don't have an account? <Link href="/SignUp">Get started</Link></p>
            <form onSubmit={handleLogin}>
            <label>Email address</label>
            <input
                type="email"
                name="email"
                placeholder="Email"
                aria-label="Email"
                autoComplete="email"
                required
                value={email}
                onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
            />
            <label>Password</label>
            <input
                type="password"
                name="password"
                placeholder="Password"
                aria-label="Password"
                autoComplete="current-password"
                required
                value={password}
                onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
            />
            <button type="submit">Login</button>
            </form>
        </div>
      </div>
      {showError && (
        <Message
          title="Erro no Login"
          message={errorMessage}
          onClose={() => setShowError(false)}
        />
      )}
    </main>
  );
};

export default Login;
