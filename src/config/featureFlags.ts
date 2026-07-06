import { isMockMode } from '../services/mockMode';

export const isBatchAnalysisEnabled = (): boolean =>
  isMockMode() || import.meta.env.VITE_ENABLE_BATCH_ANALYSIS === 'true';

