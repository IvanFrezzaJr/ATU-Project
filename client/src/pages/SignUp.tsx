import { useState } from "preact/hooks";
import { Link, useLocation } from "wouter-preact";
import { registerUser } from "../services/authService";
import Message from "../components/Message";
import styles from '../styles/Auth.module.css';

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [, navigate] = useLocation();

  const handleSignUp = async (e: Event) => {
    e.preventDefault(); 

    try {
      const user = await registerUser(name, email, password);
      console.log("Authenticated user:", user);
      navigate("/"); 
    } catch (error) {
      console.error("Error signup:", error);
      setErrorMessage("Failed to authenticate. Please check your credentials.");
      setShowError(true);
    }
  };

  return (
    <main>
        <div class={styles.content}>
        <div class="viewport">
            <h1 class={styles.center}>Sign Up</h1>
            <p class={styles.center}>Have an account? <Link href="/Login">Sign In</Link></p>
            <form onSubmit={handleSignUp}>
            <label>Name</label>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    aria-label="Name"
                    autoComplete="Name"
                    required
                    value={name}
                    onInput={(e) => setName((e.target as HTMLInputElement).value)}
                />
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
                required
                value={password}
                onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
            />
            <label>Confirm Password</label>
            <input
                type="password"
                name="password"
                placeholder="Confirm Password"
                aria-label="Confirm Password"
                required
                value={confirmPassword}
                onInput={(e) => setConfirmPassword((e.target as HTMLInputElement).value)}
            />
            <button type="submit">Sign Up</button>
            </form>
        </div>
      </div>
      {showError && (
        <Message
          title="Error SignUp"
          message={errorMessage}
          onClose={() => setShowError(false)}
        />
      )}
    </main>
  );
};

export default SignUp;
