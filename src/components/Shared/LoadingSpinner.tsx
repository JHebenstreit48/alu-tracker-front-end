import "@/scss/MiscellaneousStyle/LoadingSpinner.scss";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="spinnerContainer">
      <div className="spinnerWrapper">
        <img
          src="/assets/tireSpinner.png"
          alt="Spinning tire"
          className="tireImage"
        />
        <div className="smokeTrail" />
        <p className="loadingText">
          Reving up the engines
          <span className="dot one">.</span>
          <span className="dot two">.</span>
          <span className="dot three">.</span>
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
