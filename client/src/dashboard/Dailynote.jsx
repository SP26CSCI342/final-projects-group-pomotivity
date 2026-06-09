import iconNote from '../assets/icon-note.svg'
import styles from '../pages/dashboard/dashboard.module.css';

export default function DailyNote({ body, onChange}){
    
    return (
                <article className={styles.article}>
                  <div className={styles.articleHeader}>
                    <img src={iconNote} alt="" className={styles.articleHeaderIcon} />
                    <h3 className={styles.articleHeaderTitle}>Daily note</h3>
                  </div>
                  <div className={styles.articleBody}>
                    <textarea className={styles.articleParagraph} value={body} onChange={(e) => onChange(e.target.value)} placeholder="What's on your mind today?"/>
                  </div>
                </article>
    )
}