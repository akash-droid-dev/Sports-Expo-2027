// Where the Home journey's venue scene comes from: a muted, looping film of Bharat Mandapam
// behind the zone cards (src/components/home/VenueScene.jsx). Each screen loads only the cut it
// needs (H.264 MP4, which every browser plays); the poster is the film's first frame and shows
// until it plays (and for visitors who prefer reduced motion).
export const VENUE_VIDEO = {
  // Landscape screens: computers, tablets and phones held sideways (1600 × 774, 3.8 MB).
  wide: { src: '/media/venue/bharat-mandapam-1600.mp4', poster: '/media/venue/bharat-mandapam-1600.webp' },
  // Portrait phones and tablets: the centre of the frame, cut for a tall screen (560 × 722, 1.5 MB).
  tall: { src: '/media/venue/bharat-mandapam-portrait.mp4', poster: '/media/venue/bharat-mandapam-portrait.webp' }
};

// Picks the venue film for this screen.
export function venueVideoFor() {
  if (typeof window === 'undefined') return VENUE_VIDEO.wide;
  return window.innerHeight > window.innerWidth ? VENUE_VIDEO.tall : VENUE_VIDEO.wide;
}
