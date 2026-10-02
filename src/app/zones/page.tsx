import Page, { pageFor } from '@/components/Page';

export const metadata = { title: pageFor('/zones').title };

export default function Route() {
  return <Page route='/zones' />;
}
