import { useState } from "react";
import styles from "./NoteEditor.module.css";
 
const iconClip = "https://www.figma.com/api/mcp/asset/6aacfda3-ca0c-4eb7-a176-cf179fb7ca9c";
const iconSave = "https://www.figma.com/api/mcp/asset/286dbdbe-53ef-47d8-9a61-19c5d97f7fb2";
const iconBook = "https://www.figma.com/api/mcp/asset/f4851901-2b14-4889-b868-97597e8e3019";
 
const DEFAULT_VOCABULARY = [
  { japanese: "首都", reading: "shuto", meaning: "capital" },
  { japanese: "人口", reading: "jinkou", meaning: "population" },
  { japanese: "寺院", reading: "jiin", meaning: "temple" },
  { japanese: "観光客", reading: "kankoukyaku", meaning: "tourist" },
];
 
export default function NoteEditor({
  title = "Reading Practice",
  japaneseText = "東京は日本の首都であり、世界で最も人口の多い都市圏の一つです。歴史的な寺院と近代的な高層ビルが混在しており、独特の文化を形成しています。春には桜が咲き誇り、多くの観光客が訪れます。",
  translationText = "Tokyo is the capital of Japan and one of the most populous metropolitan areas in the world. It forms a unique culture with a mix of historical temples and modern skyscrapers. In spring, cherry blossoms bloom, attracting many tourists.",
  vocabulary = DEFAULT_VOCABULARY,
  onClip,
  onSave,
}) {
  const [clipped, setClipped] = useState(false);
  const [saved, setSaved] = useState(false);
 
  const handleClip = () => {
    setClipped(true);
    setTimeout(() => setClipped(false), 1500);
    onClip?.();
  };
 
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    onSave?.();
  };
 
  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${clipped ? styles.btnActive : ""}`}
            onClick={handleClip}
            aria-label="Clip note"
          >
            <img src={iconClip} alt="" className={styles.btnIcon} />
            <span>{clipped ? "Clipped!" : "Clip"}</span>
          </button>
          <button
            className={`${styles.btn} ${saved ? styles.btnActive : ""}`}
            onClick={handleSave}
            aria-label="Save note"
          >
            <img src={iconSave} alt="" className={styles.btnIcon} />
            <span>{saved ? "Saved!" : "Save"}</span>
          </button>
        </div>
      </div>
 
      {/* Japanese text */}
      <div className={styles.japaneseBlock}>
        <p className={styles.japaneseText}>{japaneseText}</p>
      </div>
 
      {/* Translation */}
      <div className={styles.translationBlock}>
        <p className={styles.translationText}>{translationText}</p>
      </div>
 
      {/* Vocabulary Table */}
      <div className={styles.vocabCard}>
        <div className={styles.vocabHeading}>
          <span className={styles.vocabIconWrap}>
            <img src={iconBook} alt="" className={styles.vocabIcon} />
          </span>
          <h3 className={styles.vocabTitle}>Key Vocabulary</h3>
        </div>
 
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeaderRow}>
              <th className={styles.th}>Japanese</th>
              <th className={styles.th}>Reading</th>
              <th className={styles.th}>Meaning</th>
            </tr>
          </thead>
          <tbody>
            {vocabulary.map((row, i) => (
              <tr key={i} className={styles.tableRow}>
                <td className={`${styles.td} ${styles.tdJapanese}`}>{row.japanese}</td>
                <td className={styles.td}>{row.reading}</td>
                <td className={styles.td}>{row.meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}