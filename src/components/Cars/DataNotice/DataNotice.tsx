import { useId } from 'react';
import { Link } from 'react-router-dom';
import { useDataNoticeToggle } from '@/hooks/Cars/useDataNoticeToggle';

const DataNotice = () => {
  const { open, toggle, close, containerRef } = useDataNoticeToggle();
  const popoverId = useId();

  return (
    <div className="dataNotice" ref={containerRef}>
      <button
        type="button"
        className="dataNoticeToggle"
        aria-expanded={open}
        aria-controls={popoverId}
        onClick={toggle}
      >
        <span aria-hidden="true">ⓘ</span> Data still being added
      </button>

      {open && (
        <div id={popoverId} className="dataNoticePopover" role="region" aria-label="About missing car data">
          <p className="dataNoticeTitle">Car data is still being added.</p>
          <p>
            Some cars may be missing obtain methods, blueprints, stats or upgrade stages. This site
            is built and maintained by one person, so new data goes up over time.
          </p>
          <p>
            Spot something missing? Leave a comment on the car&apos;s page, or submit car data.
          </p>
          <div className="dataNoticeLinks">
            <Link to="/car-data-submission" onClick={close}>
              Submit car data
            </Link>
            <Link to="/about" onClick={close}>
              Why is data missing?
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataNotice;