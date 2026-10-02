import Page, { pageFor } from '@/components/Page';

export const metadata = { title: pageFor('/design-system').title };

export default function Route() {
  return <Page route='/design-system' />;
}
