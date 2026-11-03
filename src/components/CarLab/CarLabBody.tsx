import CarLabTabs from '@/components/CarLab/CarLabTabs';
import Header from '@/components/Shared/header/Header';
import PageTab from '@/components/Shared/Navigation/PageTab';

import '@/scss/carLab/index.scss';

export default function CarLabBody() {
  return (
    <div className="carLab">
      <PageTab title="Car Lab">
        <Header className="carLabHeader" />
        <CarLabTabs />
      </PageTab>
    </div>
  );
}