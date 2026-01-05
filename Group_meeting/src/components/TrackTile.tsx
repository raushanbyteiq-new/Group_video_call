import {
  VideoTrack,
  useTrackRefContext,
} from '@livekit/components-react';

export const TrackTile = () => {
  const trackRef = useTrackRefContext();

  if (!trackRef) return null;

  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden border border-gray-800 bg-black">
      <VideoTrack
        trackRef={trackRef}
        className="h-full w-full object-cover"
      />

      <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 text-xs rounded">
        {trackRef.participant.identity}
      </div>
    </div>
  );
};
