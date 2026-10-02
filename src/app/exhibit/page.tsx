import Page, { pageFor } from '@/components/Page';

export const metadata = { title: pageFor('/exhibit').title };

export default function Route() {
  return <Page route='/exhibit' />;
}
