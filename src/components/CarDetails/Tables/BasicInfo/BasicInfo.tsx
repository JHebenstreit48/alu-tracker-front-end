import React from "react";
import { Car } from "@/types/shared/car";

import BasicInfoStatic from "@/components/CarDetails/Tables/BasicInfo/BasicInfoStatic";
import BasicInfoTracker from "@/components/CarDetails/Tables/BasicInfo/BasicInfoTracker";

interface Props {
  car: Car;
  trackerMode?: boolean;
  forceOwned?: boolean;
}

const BasicInfo: React.FC<Props> = ({ car, trackerMode, forceOwned }) => {
  if (!trackerMode) return <BasicInfoStatic car={car} />;
  return <BasicInfoTracker car={car} forceOwned={forceOwned} />;
};

export default BasicInfo;