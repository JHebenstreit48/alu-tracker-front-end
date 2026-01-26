export default function AboutContent() {
  return (
    <section className="aboutPage">
      <div className="aboutSection">
        <h2>About Asphalt Legends Tracker</h2>
        <p>
          <strong>Asphalt Legends Tracker</strong> is an unofficial, fan-made database and progress
          tracking platform for players of <strong>Asphalt Legends</strong> (previously Asphalt
          Legends Unite and Asphalt 9 Legends).
        </p>
        <p>
          The goal is to turn information that’s often scattered across screenshots, spreadsheets,
          patch notes, and community posts into a clean, searchable, consistently structured dataset—
          and pair it with tools that help players track and plan garage progress.
        </p>
      </div>

      <div className="aboutSection">
        <h2>What the platform focuses on</h2>
        <ul>
          <li>A structured car database with consistent stats and metadata</li>
          <li>Player progress tracking and collection insights</li>
          <li>Clear presentation that reduces confusion and guesswork</li>
          <li>A dataset designed to scale as the game updates</li>
        </ul>
      </div>

      <div className="aboutSection">
        <h2>Data sources and accuracy</h2>
        <p>Data is built using a combination of:</p>
        <ul>
          <li>Direct in-game research and observation</li>
          <li>Structured analysis of reference material</li>
          <li>Community feedback from experienced players</li>
        </ul>
        <p>
          Community input is valuable, but it’s treated as a starting point—not an automatic source
          of truth. Data is reviewed before being incorporated to keep the dataset consistent and
          reliable.
        </p>
      </div>

      <div className="aboutSection">
        <h2>Community input and moderation</h2>
        <p>
          Feedback and feature ideas from the Asphalt Legends community (including Discord and other
          player spaces) help shape the direction of the project.
        </p>
        <p>
          Not every suggestion becomes a feature. Changes are evaluated based on accuracy, impact,
          and long-term maintainability so the platform stays focused.
        </p>
        <p>
          As the project evolves, trusted contributors may be able to submit new data or corrections
          through controlled tools. Submissions are reviewed before approval to maintain a single,
          consistent source of truth.
        </p>
      </div>

      <div className="aboutSection">
        <h2>Technology</h2>
        <ul>
          <li>React + TypeScript (frontend)</li>
          <li>Node.js (backend logic / APIs)</li>
          <li>Firebase (auth, data storage, hosting/functions)</li>
        </ul>
      </div>

      <div className="aboutSection disclaimer">
        <h2>Disclaimer</h2>
        <p>
          Asphalt Legends Tracker is an unofficial fan project and is not affiliated with or endorsed
          by Gameloft. All trademarks and game content belong to their respective owners.
        </p>
      </div>
    </section>
  );
}
