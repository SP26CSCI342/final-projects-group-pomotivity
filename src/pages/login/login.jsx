import { Link, useNavigate } from 'react-router-dom';
import logoTomato from '../../assets/logo-tomato.svg';
import iconEmail from '../../assets/icon-email.svg';
import iconKey from '../../assets/icon-key.svg';
import styles from './login.module.css';
import { useEffect, useState } from 'react';
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Already logged in? skip the form and jump straight to /profile.
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if(savedToken) {
      navigate("/profile");
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      const message = "Username and password are required.";
      setError(message);
      toast.error(message);
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        const message = data.error || "Login failed.";
        setError(message);
        toast.error(message);
        return;
      }

      localStorage.setItem("User", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      toast.success(data.message || `Welcome back, ${data.user.firstName}!`);
      navigate("/");
    } catch (err) {
      console.error(err);
      const message = "Network error. Is the server running?";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className={styles.screen}>
      <div className={styles.main}>
        <div className={styles.logo}>
          <span className={styles.logoP}>P</span>
          <img src={logoTomato} alt="" className={styles.logoIcon} />
          <span className={styles.logoMotivity}>motivity</span>
        </div>

        <div className={styles.card}>
          {error && <p className='Form-error'>{error}</p>}
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="login-email" className={styles.label}>Login</label>
              <div className={styles.inputWrap}>
                <img src={iconEmail} alt="" className={styles.inputIcon} />
                <input
                  id="login-email"
                  type="text"
                  className={styles.input}
                  placeholder="olivia@untitledui.com"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="login-password" className={styles.label}>Password</label>
              <div className={styles.inputWrap}>
                <img src={iconKey} alt="" className={`${styles.inputIcon} ${styles.inputIconKey}`} />
                <input
                  id="login-password"
                  type="password"
                  className={styles.input}
                  placeholder="st4nl00n@4eva"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
            </div>

            <div className={styles.linksMargin}>
              <div className={styles.links}>
                <p className={styles.linkForgot}>No account?</p>
                <Link to="/signup" className={styles.linkSignup}>Sign up</Link>
              </div>
            </div>

            <div className={styles.submitMargin}>
              <button type="submit" className={styles.submit}>Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;