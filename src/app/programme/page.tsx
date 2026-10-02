import Page, { pageFor } from '@/components/Page';

export const metadata = { title: pageFor('/programme').title };

export default function Route() {
  return <Page route='/programme' />;
}
