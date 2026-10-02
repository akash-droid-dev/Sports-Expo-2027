import Page, { pageFor } from '@/components/Page';

export const metadata = { title: pageFor('/attend').title };

export default function Route() {
  return <Page route='/attend' />;
}
