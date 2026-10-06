import '../platform.css';
import MeetingsPage from '@/components/platform/meetings/MeetingsPage';

export const metadata = { title: 'Meetings & bookings · India Sports Expo 2027' };

export default function Route() {
  return (
    <div id="dc-root">
      <MeetingsPage />
    </div>
  );
}
