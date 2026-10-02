import Page, { pageFor } from '@/components/Page';

export const metadata = { title: pageFor('/portal').title };

export default function Route() {
  return <Page route='/portal' />;
}
