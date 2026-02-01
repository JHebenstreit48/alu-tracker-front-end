import React from "react";
import { Car } from "@/types/shared/car";
import { Blueprints } from "@/types/CarDetails";

import BlueprintsTableStatic from "@/components/CarDetails/Tables/Blueprints/BlueprintsTableStatic";
import BlueprintsTableTracker from "@/components/CarDetails/Tables/Blueprints/BlueprintsTableTracker";

interface Props {
  car: Car & Blueprints;
  trackerMode?: boolean;
}

const BlueprintsTable: React.FC<Props> = ({ car, trackerMode }) => {
  if (!trackerMode) return <BlueprintsTableStatic car={car} />;
  return <BlueprintsTableTracker car={car} />;
};

export default BlueprintsTable;