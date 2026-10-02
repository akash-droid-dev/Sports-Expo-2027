'use client';
// Runtime for the screens generated from the Claude Design components.
// It keeps the design's component model: each screen has a logic class
// (state, lifecycle, renderVals()) and a render(v) template, where `v` is the
// screen's props merged with renderVals(). The behaviour matches
// design/site/support.js, minus the editor and streaming features.

import React from 'react';

/** Base class for screen logic. Same API as the prototype's DCLogic. */
export class DCLogic {
  constructor(props) {
    this.props = props || {};
    this.state = {};
    this.__host = null;
  }
  setState(update, cb) {
    if (this.__host) this.__host.__setLogicState(update, cb);
  }
  forceUpdate() {
    if (this.__host) this.__host.forceUpdate();
  }
  componentDidMount() {}
  componentDidUpdate() {}
  componentWillUnmount() {}
  renderVals() {
    return {};
  }
}

const kebabToCamel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

/** CSS declaration string → React style object (same parser as the prototype). */
export function cssToObj(css) {
  const o = {};
  for (const decl of css.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    o[prop.startsWith('--') ? prop : kebabToCamel(prop)] = decl.slice(i + 1).trim();
  }
  return o;
}

/** Style value from a template hole: strings are parsed, objects pass through. */
export function sx(style) {
  return typeof style === 'string' ? cssToObj(style) : style;
}

/** Text hole: elements render as-is, scalars as <span class="sc-interp">, null/boolean/undefined as nothing. */
export function txt(value) {
  if (value === undefined || value === null || typeof value === 'boolean') return null;
  if (React.isValidElement(value) || Array.isArray(value)) return value;
  return <span className="sc-interp">{String(value)}</span>;
}

/** Text hole where only text is allowed (inside <option>). */
export function str(value) {
  return value === undefined || value === null || typeof value === 'boolean' ? '' : String(value);
}

/** List for a loop: anything that is not an array renders nothing. */
export function list(value) {
  return Array.isArray(value) ? value : [];
}

/** Controlled input value / checked: undefined becomes '' / false. */
export const val = (v) => (v === undefined ? '' : v);
export const chk = (v) => (v === undefined ? false : v);

const HOST_STYLE_PROPS = new Set(['position', 'left', 'right', 'top', 'bottom', 'inset', 'width', 'height', 'z-index', 'transform']);

/** Position-related subset of a style, applied to an embedded component's host element. */
export function hostStyle(style) {
  const all = typeof style === 'string' ? cssToObj(style) : style && typeof style === 'object' ? style : null;
  if (!all) return undefined;
  const out = {};
  for (const [k, v] of Object.entries(all)) {
    if (HOST_STYLE_PROPS.has(k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()))) out[k] = v;
  }
  return Object.keys(out).length ? out : undefined;
}

function userProps(props) {
  const { __hostStyle, ...rest } = props;
  return rest;
}

/**
 * Wraps a logic class and a template into a React component. Like the
 * prototype, the output sits inside <div class="sc-host">.
 */
export function defineDC(name, Logic, render) {
  class DC extends React.Component {
    constructor(props) {
      super(props);
      this.state = { v: 0, err: null };
      this.logic = new (Logic || DCLogic)(userProps(props));
      this.logic.__host = this;
    }
    static getDerivedStateFromError(e) {
      return { err: e instanceof Error && e.message ? e.message : String(e) };
    }
    componentDidCatch(e, info) {
      console.error('[' + name + '] render error:', e, info && info.componentStack);
    }
    __setLogicState(update, cb) {
      const prev = this.logic.state;
      const patch = typeof update === 'function' ? update(prev) : update;
      this.logic.state = { ...prev, ...patch };
      this.setState((s) => ({ v: s.v + 1 }), cb);
    }
    componentDidMount() {
      try {
        this.logic.componentDidMount();
      } catch (e) {
        console.error(e);
      }
    }
    componentDidUpdate(prevProps) {
      this.logic.props = userProps(this.props);
      try {
        this.logic.componentDidUpdate(prevProps);
      } catch (e) {
        console.error(e);
      }
    }
    componentWillUnmount() {
      try {
        this.logic.componentWillUnmount();
      } catch (e) {
        console.error(e);
      }
    }
    render() {
      const host = { className: 'sc-host', style: this.props.__hostStyle, 'data-sc-name': name };
      if (this.state.err) {
        return (
          <div {...host}>
            <div className="sc-error">{name + ': ' + this.state.err}</div>
          </div>
        );
      }
      const props = userProps(this.props);
      this.logic.props = props;
      let vals = props;
      let err = null;
      try {
        vals = { ...props, ...(this.logic.renderVals() || {}) };
      } catch (e) {
        console.error(e);
        err = name + '.renderVals(): ' + (e instanceof Error && e.message ? e.message : String(e));
      }
      return (
        <div {...host}>
          {err ? <div className="sc-error">{err}</div> : null}
          {render(vals)}
        </div>
      );
    }
  }
  DC.displayName = name.replace(/\s+/g, '');
  return DC;
}
