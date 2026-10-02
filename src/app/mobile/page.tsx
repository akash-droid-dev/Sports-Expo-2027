import Page, { pageFor } from '@/components/Page';

export const metadata = { title: pageFor('/mobile').title };

export default function Route() {
  return <Page route='/mobile' />;
}
