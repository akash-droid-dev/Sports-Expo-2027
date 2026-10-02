// Server wrapper for a routed screen: applies the page's own styles (from the design's
// <helmet>) and mounts the client-rendered screen inside #dc-root.
import pages from '@/screens/pages.json';
import Screen from './Screen';

export function pageFor(route: string) {
  const page = pages.pages.find((p) => p.route === route);
  if (!page) throw new Error('Unknown route ' + route);
  return page;
}

export default function Page({ route }: { route: string }) {
  const page = pageFor(route);
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: page.css }} />
      <div id="dc-root">
        <Screen route={route} defaults={page.defaults} />
      </div>
    </>
  );
}
