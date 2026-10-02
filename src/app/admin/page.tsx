import Page, { pageFor } from '@/components/Page';

export const metadata = { title: pageFor('/admin').title };

export default function Route() {
  return <Page route='/admin' />;
}
