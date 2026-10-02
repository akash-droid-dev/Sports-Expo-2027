import Page, { pageFor } from '@/components/Page';
import PreloadScenes from '@/components/PreloadScenes';

export const metadata = { title: pageFor('/').title };

export default function Route() {
  return (
    <>
      <PreloadScenes hero />
      <Page route='/' />
    </>
  );
}
