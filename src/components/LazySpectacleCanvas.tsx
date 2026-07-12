import { lazy, Suspense } from 'react';
import type { SpectacleCanvasProps } from './SpectacleCanvas';

const SpectacleCanvas = lazy(() => import('./SpectacleCanvas'));

export default function LazySpectacleCanvas(props: SpectacleCanvasProps) {
  if (props.reduced) return null;
  return <Suspense fallback={null}><SpectacleCanvas {...props} /></Suspense>;
}
