import { useNavigate } from 'react-router-dom';
import Header from '@/components/Shared/header/Header';
import PageTab from '@/components/Shared/Navigation/PageTab';
import Favorites from '@/components/Tracking/Cars/favoritesAndViews/favorites';
import Views from '@/components/Tracking/Cars/favoritesAndViews/views';

import '@/scss/carTracker/index.scss';

export default function FavoritesAndViews() {
  const navigate = useNavigate();

  return (
    <div className="carTrackerPage">
      <PageTab title="Favorites & Views">
        <Header />

        <div className="trackerNavRow">
          <button className="carTrackerBackBtn" onClick={() => navigate(-1)}>
            <span className="navLabelDesktop">Back to Account Progress</span>
            <span className="navLabelMobile">‹ Account Progress</span>
          </button>
        </div>

        <h1 className="trackerPageTitle">Favorites &amp; Views</h1>

        <div className="trackerSummaryBlock">
          <Favorites />
          <Views />
        </div>
      </PageTab>
    </div>
  );
}