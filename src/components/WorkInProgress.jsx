import styles from './WorkInProgress.module.css';

export default function WorkInProgress({ pageName }) {
  return (
    <section className={styles.wip}>
      <button type="button" className={styles.backButton}>
        <svg
          className={styles.backIcon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        <span>Back</span>
      </button>

      <div className={styles.body}>
        <div className={styles.glyph} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <span className={styles.label}>Work in Progress</span>
        <h1 className={styles.title}>{pageName}</h1>
        <p className={styles.description}>
          This page isn't ready yet. We're still designing and implementing it — check back
          soon.
        </p>
      </div>
    </section>
  );
}
