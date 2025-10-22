import '@/scss/MiscellaneousStyle/LoadingSpinner.scss';

type LoadingSpinnerProps = {
  message?: string;
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
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
          {message && <span className="spinnerMessage">{message}</span>}
          <span className="dot one">.</span>
          <span className="dot two">.</span>
          <span className="dot three">.</span>
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;