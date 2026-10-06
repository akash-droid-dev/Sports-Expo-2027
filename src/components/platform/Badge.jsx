'use client';
// The accreditation card: photo, name, organisation, category colour band and a QR code that
// opens the public badge check (/verify) for gate staff.
import { useEffect, useState } from 'react';
import BrandLogo from '@/components/BrandLogo';
import { CATEGORY_COLOURS, verifyUrl } from '@/lib/platform/records';
import { privateUrl } from '@/lib/platform/storage';

export function QR({ text }) {
  const [svg, setSvg] = useState('');
  useEffect(() => {
    let alive = true;
    import('qrcode-generator').then(({ default: qrcode }) => {
      const q = qrcode(0, 'M');
      q.addData(text);
      q.make();
      if (alive) setSvg(q.createSvgTag({ cellSize: 4, margin: 0, scalable: true }));
    });
    return () => {
      alive = false;
    };
  }, [text]);
  return <div className="pf-badge-qr" aria-label="QR code" dangerouslySetInnerHTML={{ __html: svg }} />;
}

export function usePrivateUrl(path) {
  const [url, setUrl] = useState('');
  useEffect(() => {
    let alive = true;
    if (!path) return setUrl('');
    privateUrl(path)
      .then((u) => alive && setUrl(u))
      .catch(() => alive && setUrl(''));
    return () => {
      alive = false;
    };
  }, [path]);
  return url;
}

export default function Badge({ visitor, preview = false }) {
  const photo = usePrivateUrl(visitor.photo_path);
  const approved = visitor.status === 'approved' && visitor.badge_code;
  return (
    <div className={'pf-badge' + (approved || preview ? '' : ' is-pending')} style={{ '--cat': CATEGORY_COLOURS[visitor.category] || '#F07C12' }}>
      <div className="pf-badge-top">
        <BrandLogo />
      </div>
      <div className="pf-badge-band" />
      <div className="pf-badge-body">
        <div className="pf-badge-photo" style={photo ? { backgroundImage: `url("${photo}")` } : undefined} />
        <div className="pf-badge-name">{visitor.full_name}</div>
        <div className="pf-badge-org">{[visitor.designation, visitor.organisation].filter(Boolean).join(' · ')}</div>
        <div className="pf-badge-org">{visitor.country}</div>
        <div className="pf-badge-cat">{visitor.category}</div>
        {approved ? (
          <>
            <QR text={verifyUrl(visitor.badge_code)} />
            <div className="pf-badge-code">{visitor.badge_code}</div>
          </>
        ) : (
          <div className="pf-badge-code" style={{ marginTop: 'auto' }}>
            QR CODE AFTER APPROVAL
          </div>
        )}
      </div>
    </div>
  );
}
