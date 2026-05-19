import { useState } from 'react';
import type {
  BpsMap, StatBlockMap, StatBlockArrMap, StageInputMap,
  StringKeyMap, NestedStringMap, DeepStringMap,
  DeltasMap, ImportDeltasMap, CorrectionMap,
} from '@/hooks/CarDataSubmission/useCarSeedFields/types';

export function useCarSeedFieldsState() {
  const [bpsMap,          setBpsMap]          = useState<BpsMap>({});
  const [stockMap,        setStockMap]        = useState<StatBlockMap>({});
  const [goldMap,         setGoldMap]         = useState<StatBlockMap>({});
  const [maxMap,          setMaxMap]          = useState<StatBlockArrMap>({});
  const [stageInputMap,   setStageInputMap]   = useState<StageInputMap>({});
  const [costMap,         setCostMap]         = useState<StringKeyMap>({});
  const [xpMap,           setXpMap]           = useState<StringKeyMap>({});
  const [importCostMap,   setImportCostMap]   = useState<NestedStringMap>({});
  const [importXpMap,     setImportXpMap]     = useState<NestedStringMap>({});
  const [importReqMap,    setImportReqMap]    = useState<DeepStringMap>({});
  const [stageDeltasMap,  setStageDeltasMap]  = useState<DeltasMap>({});
  const [importDeltasMap, setImportDeltasMap] = useState<ImportDeltasMap>({});
  const [correctionMode,  setCorrectionMode]  = useState<CorrectionMap>({});

  return {
    bpsMap,          setBpsMap,
    stockMap,        setStockMap,
    goldMap,         setGoldMap,
    maxMap,          setMaxMap,
    stageInputMap,   setStageInputMap,
    costMap,         setCostMap,
    xpMap,           setXpMap,
    importCostMap,   setImportCostMap,
    importXpMap,     setImportXpMap,
    importReqMap,    setImportReqMap,
    stageDeltasMap,  setStageDeltasMap,
    importDeltasMap, setImportDeltasMap,
    correctionMode,  setCorrectionMode,
  };
}