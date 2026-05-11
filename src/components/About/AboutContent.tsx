export default function AboutContent() {
  return (
    <section className="aboutPage">
      <div className="aboutSection">
        <h2>About Asphalt Legends Tracker</h2>
        <p>
          <strong>Asphalt Legends Tracker</strong> is an unofficial fan-made database and progress
          tracking platform for players of <strong>Asphalt Legends</strong>, a mobile and
          multi-platform racing game by Gameloft that launched as Asphalt 9: Legends in 2018, was
          renamed Asphalt Legends Unite in July 2024, and became simply Asphalt Legends in July
          2025 with the release of the Legacy of Speed update.
        </p>
        <p>
          The goal is to turn information that is often scattered across screenshots, spreadsheets,
          patch notes, and community posts into a clean, searchable, consistently structured dataset
          and pair it with tools that help players track and plan their garage progress.
        </p>
      </div>

      <div className="aboutSection">
        <h2>What the platform focuses on</h2>
        <p>
          A structured car database with consistent stats and metadata. Player progress tracking and
          collection insights. Clear presentation that reduces confusion and guesswork. A dataset
          designed to scale as the game continues to update.
        </p>
      </div>

      <div className="aboutSection">
        <h2>Data sources and accuracy</h2>
        <p>
          Data is built using a combination of direct in-game research and observation, structured
          analysis of reference material, and community feedback from experienced players.
        </p>
        <p>
          Community input is valuable but treated as a starting point rather than an automatic
          source of truth. All submissions are reviewed before being incorporated to keep the dataset
          consistent and reliable. Players can submit car data corrections and missing stats directly
          through the moderated submission system built into the platform.
        </p>
      </div>

      <div className="aboutSection">
        <h2>Community input and moderation</h2>
        <p>
          Feedback and feature ideas from the Asphalt Legends community, including Discord and other
          player spaces, help shape the direction of the project.
        </p>
        <p>
          Not every suggestion becomes a feature. Changes are evaluated based on accuracy, impact,
          and long-term maintainability so the platform stays focused. As the project evolves,
          trusted contributors may be able to submit new data or corrections through expanded tools.
          All submissions are reviewed before approval to maintain a single consistent source of
          truth.
        </p>
      </div>

      <div className="aboutSection">
        <h2>Technology</h2>
        <p>
          The platform is built with React and TypeScript on the frontend, Node.js for backend logic
          and APIs, and Firebase for authentication, data storage, and hosting. A moderated car data
          submission system allows players to contribute stats and corrections that are reviewed
          before being applied to the dataset.
        </p>
      </div>

      <div className="aboutSection disclaimer">
        <h2>Disclaimer</h2>
        <p>
          Asphalt Legends Tracker is an unofficial fan project and is not affiliated with or
          endorsed by Gameloft. All trademarks and game content belong to their respective owners.
        </p>
      </div>
    </section>
  );
}