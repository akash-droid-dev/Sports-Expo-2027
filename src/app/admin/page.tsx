import '../platform.css';
import AdminPage from '@/components/platform/admin/AdminPage';

export const metadata = { title: 'Admin · India Sports Expo 2027', robots: { index: false } };

export default function Route() {
  return (
    <div id="dc-root">
      <AdminPage />
    </div>
  );
}
