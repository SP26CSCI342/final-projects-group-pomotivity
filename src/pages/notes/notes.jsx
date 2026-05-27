import iconFolderPlus from '../../assets/icon-folder-plus.svg';
import iconFolderMinus from '../../assets/icon-folder-minus.svg';
import iconFile from '../../assets/icon-file.svg';
import iconFilePlus from '../../assets/icon-file-plus.svg';
import iconClock from '../../assets/icon-clock-sm.svg';
import styles from './notes.module.css';

const fileTree = [
  { type: 'folder-plus', label: 'CSCI 447', nested: false },
  { type: 'folder-minus', label: 'Japanese', nested: false },
  { type: 'file', label: 'Lesson 1', nested: true },
  { type: 'file', label: 'Lesson 2', nested: true },
  { type: 'file', label: 'Lesson 3', nested: true },
  { type: 'file', label: 'Lesson 4', nested: true },
  { type: 'folder-minus', label: 'Project 1', nested: false },
  { type: 'file', label: 'Overview', nested: true },
  { type: 'file', label: 'Check-in 1', nested: true },
  { type: 'file', label: 'Japanese Notes', nested: false },
  { type: 'file-plus', label: 'New Note...', nested: false },
];

const iconFor = {
  'folder-plus': iconFolderPlus,
  'folder-minus': iconFolderMinus,
  'file': iconFile,
  'file-plus': iconFilePlus,
};

export default function Notes() {
  return (
    <section className={styles.notes}>
      <div className={styles.fileDir}>
        {fileTree.map((item, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.fileItem} ${item.nested ? styles.fileItemNested : ''}`}
          >
            <img src={iconFor[item.type]} alt="" className={styles.fileIcon} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className={styles.content}>
        <header className={styles.headerRow}>
          <div className={styles.headerMeta}>
            <h2 className={styles.heading}>Japanese Notes</h2>
            <div className={styles.subhead}>
              <img src={iconClock} alt="" className={styles.subheadIcon} />
              <span className={styles.subheadText}>Last edited: 2hr 31min ago</span>
            </div>
          </div>

          <div className={styles.progressCard}>
            <div>
              <p className={styles.progressLabel}>Goal Progress</p>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: '50%' }} />
              </div>
            </div>
            <span className={styles.progressPercent}>50%</span>
          </div>
        </header>

        <article className={styles.card}>
          <header className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Reading Practice</h3>
          </header>
          <p className={styles.japaneseText}>
            東京は日本の首都であり、世界で最も人口の多い都市圏の一つです。歴史的な寺院と近代的な高層ビルが混在しており、独特の文化を形成しています。春には桜が咲き誇り、多くの観光客が訪れます。
          </p>
          <p className={styles.translationText}>
            Tokyo is the capital of Japan and one of the most populous metropolitan areas in the
            world. It forms a unique culture with a mix of historical temples and modern
            skyscrapers. In spring, cherry blossoms bloom, attracting many tourists.
          </p>
        </article>
      </div>
    </section>
  );
}
