import { Link } from 'react-router-dom';
import logoTomato from '../assets/logo-tomato.svg';
import iconEmail from '../assets/icon-email.svg';
import iconKey from '../assets/icon-key.svg';
import styles from './login.module.css';

export default function Login() {
  return (
    <div className={styles.screen}>
      <div className={styles.main}>
        <div className={styles.logo}>
          <span className={styles.logoP}>P</span>
          <img src={logoTomato} alt="" className={styles.logoIcon} />
          <span className={styles.logoMotivity}>motivity</span>
        </div>

        <div className={styles.card}>
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <div className={styles.field}>
              <label htmlFor="login-email" className={styles.label}>Login</label>
              <div className={styles.inputWrap}>
                <img src={iconEmail} alt="" className={styles.inputIcon} />
                <input
                  id="login-email"
                  type="email"
                  className={styles.input}
                  placeholder="olivia@untitledui.com"
                  autoComplete="email"
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
                />
              </div>
            </div>

            <div className={styles.linksMargin}>
              <div className={styles.links}>
                <a href="#" className={styles.linkForgot}>Forgot your password?</a>
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
