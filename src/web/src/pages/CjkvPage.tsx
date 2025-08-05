import { useState } from "react";
import styles from "./CjkvPage.module.css";

export default function CjkvPage() {
  const [inputValue, setInputValue] = useState("");

  const mapping = {
    "a--d": "会",
    "va--d": "绘",
    "a--dl": "刽",
    "ha--d": "荟",
    "ma--d": "桧",
    "a--": "亽一",
    "a-": "亽",
    "--": "二",
    "--d": "云",
    d: "厶",
    a: "人",
    "-": "一",
  };

  const getOutputChar = () => {
    const input = inputValue.toLowerCase();
    return mapping[input] || "?";
  };

  const getOutputColor = () => {
    const input = inputValue.toLowerCase();
    return mapping[input] ? "#10b981" : "#fbbf24";
  };

  return (
    <div className={styles.container}>
      <div className={styles.floatingElements}>
        {["汉", "字", "输", "入", "法", "快", "速", "准", "确"].map(
          (char, i) => (
            <div
              key={i}
              className={styles.floatingChar}
              style={{
                left: `${10 + i * 10}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 2}s`,
              }}
            >
              {char}
            </div>
          )
        )}
      </div>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div>
            <h1 className={styles.heroTitle}>Type Chinese at the Speed of Thought</h1>
            <p className={styles.heroSubtitle}>
              Finally, an input method that doesn't make you wait. Break free
              from the frustrating hunt-and-peck of traditional Chinese typing.
            </p>
          </div>

          <div className={styles.painPoint}>
            <h3>You know the feeling...</h3>
            <p>
              Thinking in Chinese but typing at 15 WPM. Scrolling through
              endless character suggestions. Breaking your flow every few
              seconds. Your thoughts move faster than your fingers can follow.
            </p>
          </div>

          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>⚡</div>
              <h3>FAST</h3>
              <p>3x faster than traditional methods</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🎯</div>
              <h3>ACCURATE</h3>
              <p>Zero ambiguity, perfect precision</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🚀</div>
              <h3>UNIQUE</h3>
              <p>Revolutionary stroke-based approach</p>
            </div>
          </div>

          <div className={styles.typingDemo}>
            <h3 className={styles.demoTitle}>See How It Works</h3>
            <div className={styles.demoStep}>
              <span className={styles.demoChar}>会</span>
              <span className={styles.demoArrow}>→</span>
              <span style={{ color: "#a1a1aa" }}>⿱人⿱二厶</span>
              <span className={styles.demoArrow}>→</span>
              <span className={styles.demoKeys}>a--d</span>
            </div>
            <div className={styles.demoExplanation}>
              Character → Strokes → Keys → Done
            </div>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Ready to Transform Your Chinese Typing?</h2>

        <button className={styles.btnPrimary}>Download App</button>
      </section>

      <section className={styles.demoSection}>
        <div className={styles.interactiveDemo}>
          <h3 className={styles.demoInteractiveTitle}>Try It Right Here</h3>
          <div className={styles.demoInputContainer}>
            <input
              type="text"
              placeholder="Type: a--d"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={styles.demoInput}
            />
            <span className={styles.demoOutput} style={{ color: getOutputColor() }}>
              {getOutputChar()}
            </span>
          </div>
          <p className={styles.demoHint}>Try typing different stroke patterns</p>
        </div>
      </section>
    </div>
  );
}
