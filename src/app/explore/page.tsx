import Page, { pageFor } from '@/components/Page';

export const metadata = { title: pageFor('/explore').title };

export default function Route() {
  return <Page route='/explore' />;
}
