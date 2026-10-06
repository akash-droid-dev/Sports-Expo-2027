import '../platform.css';
import '../mobile-app.css';
import MobilePage from '@/components/platform/mobile/MobilePage';

export const metadata = { title: 'Companion app · India Sports Expo 2027' };

export default function Route() {
  return (
    <div id="dc-root">
      <MobilePage />
    </div>
  );
}
