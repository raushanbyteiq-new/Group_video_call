import { GridLayout, ParticipantTile, useTracks } from '@livekit/components-react';
import { Track } from 'livekit-client';

export const Stage = () => {
  // Get all camera and screen share tracks
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);

  return (
    <div className="h-full w-full bg-neutral-900 p-2">
      <GridLayout tracks={tracks}>
        {/* The GridLayout automatically maps tracks to tiles */}
        <ParticipantTile /> 
      </GridLayout>
    </div>
  );
};