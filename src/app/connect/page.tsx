import Page, { pageFor } from '@/components/Page';

export const metadata = { title: pageFor('/connect').title };

export default function Route() {
  return <Page route='/connect' />;
}
