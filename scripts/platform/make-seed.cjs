// Builds supabase/seed.sql: the website catalogue (from src/data/ise.js) and the default
// registration form fields. Usage: node scripts/platform/make-seed.cjs
const fs = require('fs');
global.window = {};
require('../../src/data/ise.js');
const D = window.ISE;
const q = (v) => (v === null || v === undefined ? 'null' : "'" + String(v).replace(/'/g, "''") + "'");
const j = (o) => q(JSON.stringify(o)) + '::jsonb';
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
const rows = [];
const add = (collection, id, data, sort) => rows.push(`(${q(collection)}, ${q(id)}, ${j(data)}, ${sort})`);
D.zones.forEach((z, i) => add('zones', z.id, z, i));
D.clusters.forEach((c, i) => add('clusters', c.id, c, i));
D.exhibitors.forEach((e, i) => add('exhibitors', e.id, e, i));
D.products.forEach((p, i) => add('products', slug(p.name), p, i));
D.speakers.forEach((s, i) => add('speakers', s.id, s, i));
D.sessions.forEach((s, i) => add('sessions', s.id, s, i));
D.states.forEach((s, i) => add('states', s.id, s, i));
D.countries.forEach((c, i) => add('countries', c.id, c, i));
D.startups.forEach((s, i) => add('startups', slug(s.name), s, i));
D.matches.forEach((m, i) => add('matches', slug(m.name), m, i));
D.stages.forEach((s, i) => add('stages', slug(s), { name: s }, i));

const F = [];
const field = (form, key, label, type, o = {}) => F.push({ form, key, label, type, options: o.options || [], required: !!o.required, placeholder: o.placeholder || null, help: o.help || null, section: o.section || 'Details', core: !!o.core });
// Visitor: short registration with a photo for the card and an ID document for the review.
const CATS = ['Visitor', 'Trade buyer', 'Delegate', 'Media', 'Speaker', 'Government', 'VIP', 'Student'];
field('visitor', 'full_name', 'Full name', 'text', { required: true, core: true, section: 'You', placeholder: 'As on your ID' });
field('visitor', 'phone', 'Mobile number', 'tel', { required: true, core: true, section: 'You', placeholder: '+91 98765 43210' });
field('visitor', 'category', 'I am attending as', 'select', { required: true, core: true, section: 'You', options: CATS });
field('visitor', 'organisation', 'Organisation', 'text', { required: true, core: true, section: 'Work' });
field('visitor', 'designation', 'Designation', 'text', { core: true, section: 'Work' });
field('visitor', 'country', 'Country', 'country', { required: true, core: true, section: 'Work' });
field('visitor', 'interests', 'Interested in', 'multiselect', { section: 'Work', options: ['Sports goods', 'Infrastructure', 'SportsTech', 'Investment', 'Federations', 'Startups', 'Media & broadcast'] });
field('visitor', 'photo', 'Photo for your card', 'image', { required: true, core: true, section: 'Documents', help: 'A clear, recent passport-style photo. JPG or PNG, up to 10 MB.' });
field('visitor', 'id_document', 'ID document', 'file', { required: true, core: true, section: 'Documents', help: 'Aadhaar, passport or another government photo ID (PDF or image, up to 10 MB). Only the organisers see it.' });
// Exhibitor registration.
const PRODUCTS = ['Standard Booth (3 × 3 m)', 'Premium Booth (6 × 3 m)', 'Raw Space (from 36 m²)', 'Sector Pavilion', 'State Pavilion', 'Country Pavilion', 'Hero Experience'];
field('exhibitor', 'company', 'Company name', 'text', { required: true, core: true, section: 'Company' });
field('exhibitor', 'website', 'Website', 'url', { core: true, section: 'Company', placeholder: 'https://' });
field('exhibitor', 'country', 'Country', 'country', { required: true, core: true, section: 'Company' });
field('exhibitor', 'city', 'City', 'text', { required: true, core: true, section: 'Company' });
field('exhibitor', 'sector', 'Sector', 'text', { required: true, core: true, section: 'Company', placeholder: 'e.g. Football equipment' });
field('exhibitor', 'type', 'Company type', 'select', { required: true, core: true, section: 'Company', options: ['Manufacturer', 'Exporter', 'OEM / ODM', 'Brand', 'SportsTech', 'Startup', 'Services', 'Government / Federation', 'Country pavilion'] });
field('exhibitor', 'description', 'About the company', 'textarea', { core: true, section: 'Company', help: 'Shown on your exhibitor profile.' });
field('exhibitor', 'logo', 'Logo', 'image', { core: true, section: 'Company', help: 'Square PNG or SVG works best.' });
field('exhibitor', 'contact_name', 'Contact person', 'text', { required: true, core: true, section: 'Contact' });
field('exhibitor', 'phone', 'Mobile number', 'tel', { required: true, core: true, section: 'Contact' });
field('exhibitor', 'zone', 'Zone', 'select', { required: true, core: true, section: 'Stall', options: D.zones.map((z) => z.id + ' · ' + z.name) });
field('exhibitor', 'stall_product', 'Stall product', 'select', { required: true, core: true, section: 'Stall', options: PRODUCTS });
field('exhibitor', 'preferred_location', 'Preferred area', 'select', { core: true, section: 'Stall', options: D.clusters.filter((c) => c.kind === 'stalls' || c.kind === 'pav').map((c) => c.zone + ' · ' + c.name) });
field('exhibitor', 'looking_for', 'Looking for', 'text', { core: true, section: 'Stall', placeholder: 'e.g. European distributors' });
field('exhibitor', 'gst_number', 'GST number', 'text', { section: 'Company', help: 'For Indian companies.' });

const fieldRows = F.map((f, i) => `(${q(f.form)}, ${q(f.key)}, ${q(f.label)}, ${q(f.type)}, ${j(f.options)}, ${f.required}, ${q(f.placeholder)}, ${q(f.help)}, ${q(f.section)}, ${i}, ${f.core})`);

const sql = `-- Generated by scripts/platform/make-seed.cjs: the website catalogue and default form fields.
insert into public.catalog (collection, id, data, sort) values
${rows.join(',\n')}
on conflict (collection, id) do nothing;

insert into public.form_fields (form, key, label, type, options, required, placeholder, help, section, sort, core) values
${fieldRows.join(',\n')}
on conflict (form, key) do nothing;
`;
fs.writeFileSync(__dirname + '/../../supabase/seed.sql', sql);
console.log('catalog rows', rows.length, 'fields', F.length, 'bytes', sql.length);
