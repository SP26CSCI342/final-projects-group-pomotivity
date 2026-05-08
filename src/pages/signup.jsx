import { Link, useNavigate } from 'react-router-dom';
import logoTomato from '../assets/logo-tomato.svg';
import iconUser from '../assets/icon-user.svg';
import iconEmail from '../assets/icon-email-alt.svg';
import iconLock from '../assets/icon-lock.svg';
import iconConfirm from '../assets/icon-confirm.svg';
import styles from './signup.module.css';

export default function SignUp() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/');
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
                  type="email"
                  className={styles.input}
                  placeholder="jane@example.com"
                  autoComplete="email"
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
