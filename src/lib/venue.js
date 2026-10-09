// Where the Home journey's venue scene comes from: a muted, looping film of Bharat Mandapam
// behind the zone cards (src/components/home/VenueScene.jsx). Each screen loads only the file
// it needs; the poster is the film's first frame and shows until it plays (and for visitors
// who prefer reduced motion).
export const VENUE_VIDEO = {
  // Landscape computers and large tablets.
  wide: { src: '/media/venue/bharat-mandapam-1920.mp4', poster: '/media/venue/bharat-mandapam-1920.webp' },
  // Landscape phones and tablets, small laptops, slow connections.
  mid: { src: '/media/venue/bharat-mandapam-1280.mp4', poster: '/media/venue/bharat-mandapam-1280.webp' },
  // Portrait phones and tablets: the centre of the frame, cut for a tall screen.
  tall: { src: '/media/venue/bharat-mandapam-portrait.mp4', poster: '/media/venue/bharat-mandapam-portrait.webp' }
};

// Picks the venue film for this screen.
export function venueVideoFor() {
  if (typeof window === 'undefined') return VENUE_VIDEO.mid;
  const w = window.innerWidth, h = window.innerHeight;
  if (h > w) return VENUE_VIDEO.tall;
  const c = navigator.connection;
  const slow = c && (c.saveData || /(^|-)2g|3g/.test(c.effectiveType || ''));
  return !slow && w > 1100 ? VENUE_VIDEO.wide : VENUE_VIDEO.mid;
}
