import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from "react-hot-toast";
import logoTomato from '../../assets/logo-tomato.svg';
import iconUser from '../../assets/icon-user.svg';
import iconEmail from '../../assets/icon-email-alt.svg';
import iconLock from '../../assets/icon-lock.svg';
import iconConfirm from '../../assets/icon-confirm.svg';
import styles from './signup.module.css';

export default function SignUp() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateInputs = () => {
    if (!firstName) {
      return "First name must not be empty.";
    }
    if (!lastName) {
      return "Last name must not be empty.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }
    if (!password || password.length < 8) {
      return "Password must be at least 8 characters.";
    }
    if (password !== confirm) {
      return "The passwords do not match."
    }
    return "";
  }

  const handleSubmit = async (event) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

    event.preventDefault();
    setError("");

    const validationError = validateInputs();
    if(validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    try {
      const response = await fetch(`${base_url}/api/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({firstName, lastName, email, password}),
      });

      const data = await response.json();
      if(!response.ok) {
        const message = data.error || "Signup failed.";
        setError(message);
        toast.error(message);
        return;
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      toast.success(data.message || "Signup successful.");
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
      <div className={styles.container}>
        <div className={styles.logo}>
          <span>P</span>
          <img src={logoTomato} alt="" className={styles.logoIcon} />
          <span>motivity</span>
        </div>

        <div className={styles.card}>
          {error && <p className="form-error">{error}</p>}
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="signup-first" className={styles.label}>First Name</label>
                <div className={styles.inputWrap}>
                  <img src={iconUser} alt="" className={styles.inputIcon} />
                  <input
                    id="signup-first"
                    type="text"
                    className={styles.input}
                    placeholder="Jane"
                    autoComplete="given-name"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label htmlFor="signup-last" className={styles.label}>Last Name</label>
                <div className={styles.inputWrap}>
                  <img src={iconUser} alt="" className={styles.inputIcon} />
                  <input
                    id="signup-last"
                    type="text"
                    className={styles.input}
                    placeholder="Doe"
                    autoComplete="family-name"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="signup-email" className={styles.label}>Email</label>
              <div className={styles.inputWrap}>
                <img src={iconEmail} alt="" className={`${styles.inputIcon} ${styles.iconEmail}`} />
                <input
                  id="signup-email"
                  type="text"
                  className={styles.input}
                  placeholder="jane@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="signup-password" className={styles.label}>Password</label>
              <div className={styles.inputWrap}>
                <img src={iconLock} alt="" className={`${styles.inputIcon} ${styles.iconLock}`} />
                <input
                  id="signup-password"
                  type="password"
                  className={styles.input}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
            </div>

            <div className={`${styles.field} ${styles.confirmField}`}>
              <label htmlFor="signup-confirm" className={styles.label}>Confirm Password</label>
              <div className={styles.inputWrap}>
                <img src={iconConfirm} alt="" className={`${styles.inputIcon} ${styles.iconConfirm}`} />
                <input
                  id="signup-confirm"
                  type="password"
                  className={styles.input}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(event) => setConfirm(event.target.value)}
                />
              </div>
            </div>

            <button type="submit" className={styles.submit}>Sign Up</button>
          </form>
        </div>

        <p className={styles.footer}>
          Already have an account?
          <Link to="/login" className={styles.footerLink}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
