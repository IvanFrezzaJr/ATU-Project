/** @jsxImportSource preact */
import { useState } from "preact/hooks";
import { Link, useLocation } from "wouter-preact";

import { FormField } from "../components/FormField";
import { GlobalMessage } from "../components/GlobalMessage";
import { useFormErrors } from "../hooks/useFormErrors";
import { validateEmail, validatePassword } from "../utils/validators";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import styles from "../styles/Auth.module.css";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [, navigate] = useLocation();
  const { login: loginContext } = useAuth();

  const { errors, setFieldError, clearFieldError, setErrors } = useFormErrors<typeof form>();
  const [globalMessage, setGlobalMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBlur = (field: string) => {
    let error = "";
    if (field === "email") error = validateEmail(form.email) || "";
    if (field === "password") error = validatePassword(form.password) || "";

    error ? setFieldError(field as keyof typeof form, error) : clearFieldError(field as keyof typeof form);
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    const emailErr = validateEmail(form.email);
    const passwordErr = validatePassword(form.password);

    if (emailErr || passwordErr) {
      setErrors({
        email: emailErr || "",
        password: passwordErr || "",
      });
      setGlobalMessage({ type: "error", text: "Error validating the form." });
      return;
    }

    try {
      const user = await login(form.email, form.password);
      console.log("Authenticated user:", user);
      await loginContext(form.email, form.password);
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Login error:", error.message);
        setGlobalMessage({ type: "error", text: error.message });
      } else {
        console.error("Unknown error:", error);
        setGlobalMessage({ type: "error", text: "Unknown error when logging in." });
      }
    }
  };

  return (
    <main>
      <div class={styles.content}>
        <div class="viewport">
          <h1 class={styles.center}>Sign In</h1>
          <p class={styles.center}>
            Don't have an account? <Link href="/SignUp" aria-label="Create an account">Create one</Link>
          </p>

          {globalMessage && (
            <GlobalMessage
              type={globalMessage.type}
              message={globalMessage.text}
              onClose={() => setGlobalMessage(null)}
            />
          )}

          <form onSubmit={handleSubmit}>
            <FormField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={() => handleBlur("email")}
              error={errors.email}
              aria-label="Enter your email address"
            />
            <FormField
              label="Senha"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              onBlur={() => handleBlur("password")}
              error={errors.password}
              aria-label="Enter your password"
            />

            <button type="submit" aria-label="Submit login form">Entrar</button>
          </form>
        </div>
      </div>
    </main>
  );
}
