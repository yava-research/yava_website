"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

// Full-screen viewer for figures: article images, Mermaid diagrams, charts.
//
//   <ZoomableImage src alt />     click an image to open it in a pan/zoom viewer
//   <Lightbox open onClose title> the modal itself
//   <PanZoom>                     wheel / pinch / drag / double-click to explore
//   <Expandable title>            adds an Expand button; re-renders children
//                                 inside the lightbox at a larger size (charts)
//   useExpanded()                 true when rendered inside the lightbox

const ExpandedContext = createContext(false);
export const useExpanded = () => useContext(ExpandedContext);

const EXIT_MS = 160;
const MIN_SCALE = 1;
const MAX_SCALE = 8;

/* ------------------------------------------------------------------ */
/* Lightbox                                                            */
/* ------------------------------------------------------------------ */

type LightboxProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  /** Extra controls rendered in the toolbar (e.g. zoom buttons). */
  toolbar?: ReactNode;
  children: ReactNode;
};

export function Lightbox({ open, onClose, title, toolbar, children }: LightboxProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);
  // Still mounted after `open` turns false: play the exit, then unmount.
  const closing = mounted && !open;

  // Open as a modal once mounted. The native dialog traps focus, makes the
  // page inert, and returns focus to the trigger when it closes.
  useEffect(() => {
    const dialog = ref.current;
    if (mounted && dialog && !dialog.open) {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
    }
  }, [mounted]);

  // Animate out, then unmount.
  useEffect(() => {
    if (!closing) return;
    const timer = window.setTimeout(() => {
      ref.current?.close();
      setMounted(false);
      returnFocus.current?.focus({ preventScroll: true });
    }, EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [closing]);

  if (!mounted) return null;

  return createPortal(
    <dialog
      ref={ref}
      className="lightbox"
      data-closing={closing || undefined}
      aria-label={title ?? "Expanded view"}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="lightbox__panel">
        <header className="lightbox__bar">
          <p className="lightbox__title">{title}</p>
          <div className="lightbox__tools">
            {toolbar}
            <button type="button" className="lightbox__button" onClick={onClose} aria-label="Close">
              <span aria-hidden="true">✕</span>
              <span className="lightbox__button-label">Close</span>
            </button>
          </div>
        </header>
        <div className="lightbox__body">
          <ExpandedContext.Provider value={true}>{children}</ExpandedContext.Provider>
        </div>
      </div>
    </dialog>,
    document.body,
  );
}

/* ------------------------------------------------------------------ */
/* PanZoom                                                             */
/* ------------------------------------------------------------------ */

type View = { scale: number; x: number; y: number };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function usePanZoom() {
  const viewport = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const view = useRef<View>({ scale: 1, x: 0, y: 0 });
  const [percent, setPercent] = useState(100);

  // Write the transform straight to the element; no React render per frame.
  const apply = useCallback((animate: boolean) => {
    const el = content.current;
    const box = viewport.current;
    if (!el || !box) return;
    const v = view.current;
    const maxX = Math.max(0, (box.clientWidth * v.scale - box.clientWidth) / 2);
    const maxY = Math.max(0, (box.clientHeight * v.scale - box.clientHeight) / 2);
    v.x = clamp(v.x, -maxX, maxX);
    v.y = clamp(v.y, -maxY, maxY);
    el.style.transition = animate ? "transform 240ms var(--ease-out)" : "none";
    el.style.transform = `translate3d(${v.x}px, ${v.y}px, 0) scale(${v.scale})`;
    box.dataset.zoomed = v.scale > 1.001 ? "true" : "false";
    setPercent(Math.round(v.scale * 100));
  }, []);

  /** Zoom by `factor`, keeping the point (px from viewport centre) fixed. */
  const zoomAt = useCallback(
    (factor: number, px = 0, py = 0, animate = false) => {
      const v = view.current;
      const next = clamp(v.scale * factor, MIN_SCALE, MAX_SCALE);
      const k = next / v.scale;
      v.x = px - (px - v.x) * k;
      v.y = py - (py - v.y) * k;
      v.scale = next;
      apply(animate);
    },
    [apply],
  );

  const reset = useCallback(() => {
    view.current = { scale: 1, x: 0, y: 0 };
    apply(true);
  }, [apply]);

  const pan = useCallback(
    (dx: number, dy: number, animate = false) => {
      view.current.x += dx;
      view.current.y += dy;
      apply(animate);
    },
    [apply],
  );

  useEffect(() => {
    const box = viewport.current;
    if (!box) return;

    const local = (clientX: number, clientY: number) => {
      const rect = box.getBoundingClientRect();
      return [clientX - rect.left - rect.width / 2, clientY - rect.top - rect.height / 2] as const;
    };

    // Wheel: pinch (ctrl+wheel) and mouse wheels zoom; trackpad scrolls pan.
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const [px, py] = local(event.clientX, event.clientY);
      const mouseWheel = event.deltaMode !== 0 || (event.deltaX === 0 && Math.abs(event.deltaY) >= 50);
      if (event.ctrlKey || event.metaKey || mouseWheel) {
        const speed = event.ctrlKey ? 0.01 : 0.0015;
        const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
        zoomAt(Math.exp(-delta * speed), px, py);
      } else if (view.current.scale > 1) {
        pan(-event.deltaX, -event.deltaY);
      } else {
        zoomAt(Math.exp(-event.deltaY * 0.004), px, py);
      }
    };

    // Pointers: one finger/mouse drags, two fingers pinch.
    const pointers = new Map<number, { x: number; y: number }>();
    let pinch: { distance: number; mid: readonly [number, number] } | null = null;

    const pinchState = () => {
      const [a, b] = [...pointers.values()];
      return {
        distance: Math.hypot(a.x - b.x, a.y - b.y),
        mid: local((a.x + b.x) / 2, (a.y + b.y) / 2),
      };
    };

    const onDown = (event: PointerEvent) => {
      if (event.button !== 0 && event.pointerType === "mouse") return;
      box.setPointerCapture(event.pointerId);
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size === 2) pinch = pinchState();
      box.dataset.dragging = "true";
    };

    const onMove = (event: PointerEvent) => {
      const previous = pointers.get(event.pointerId);
      if (!previous) return;
      const current = { x: event.clientX, y: event.clientY };
      pointers.set(event.pointerId, current);
      if (pointers.size >= 2 && pinch) {
        const next = pinchState();
        zoomAt(next.distance / pinch.distance, next.mid[0], next.mid[1]);
        pan(next.mid[0] - pinch.mid[0], next.mid[1] - pinch.mid[1]);
        pinch = next;
      } else if (pointers.size === 1) {
        pan(current.x - previous.x, current.y - previous.y);
      }
    };

    const onUp = (event: PointerEvent) => {
      pointers.delete(event.pointerId);
      if (pointers.size < 2) pinch = null;
      if (pointers.size === 0) delete box.dataset.dragging;
    };

    const onDoubleClick = (event: MouseEvent) => {
      if (view.current.scale > 1.001) return reset();
      const [px, py] = local(event.clientX, event.clientY);
      zoomAt(2.5, px, py, true);
    };

    const onResize = () => apply(false);

    box.addEventListener("wheel", onWheel, { passive: false });
    box.addEventListener("pointerdown", onDown);
    box.addEventListener("pointermove", onMove);
    box.addEventListener("pointerup", onUp);
    box.addEventListener("pointercancel", onUp);
    box.addEventListener("dblclick", onDoubleClick);
    window.addEventListener("resize", onResize);
    return () => {
      box.removeEventListener("wheel", onWheel);
      box.removeEventListener("pointerdown", onDown);
      box.removeEventListener("pointermove", onMove);
      box.removeEventListener("pointerup", onUp);
      box.removeEventListener("pointercancel", onUp);
      box.removeEventListener("dblclick", onDoubleClick);
      window.removeEventListener("resize", onResize);
    };
  }, [apply, pan, reset, zoomAt]);

  // Keyboard: + / − / 0 zoom, arrows pan.
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const step = 80;
      const keys: Record<string, () => void> = {
        "+": () => zoomAt(1.5, 0, 0, true),
        "=": () => zoomAt(1.5, 0, 0, true),
        "-": () => zoomAt(1 / 1.5, 0, 0, true),
        "_": () => zoomAt(1 / 1.5, 0, 0, true),
        "0": reset,
        ArrowLeft: () => pan(step, 0, true),
        ArrowRight: () => pan(-step, 0, true),
        ArrowUp: () => pan(0, step, true),
        ArrowDown: () => pan(0, -step, true),
      };
      const action = keys[event.key];
      if (action) {
        event.preventDefault();
        action();
      }
    },
    [pan, reset, zoomAt],
  );

  const controls = (
    <div className="lightbox__zoom" role="group" aria-label="Zoom">
      <button type="button" className="lightbox__button" onClick={() => zoomAt(1 / 1.5, 0, 0, true)} aria-label="Zoom out" disabled={percent <= 100}>
        <span aria-hidden="true">−</span>
      </button>
      <button type="button" className="lightbox__button lightbox__percent" onClick={reset} aria-label="Reset zoom">
        {percent}%
      </button>
      <button type="button" className="lightbox__button" onClick={() => zoomAt(1.5, 0, 0, true)} aria-label="Zoom in" disabled={percent >= MAX_SCALE * 100}>
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );

  return { viewport, content, controls, onKeyDown };
}

type PanZoomLightboxProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

/** A lightbox whose body can be zoomed and panned. */
export function PanZoomLightbox({ open, onClose, title, children }: PanZoomLightboxProps) {
  return (
    <Lightbox open={open} onClose={onClose} title={title} toolbar={open ? <ZoomSlot /> : null}>
      <PanZoomBody>{children}</PanZoomBody>
    </Lightbox>
  );
}

// The zoom buttons live in the toolbar but share state with the body, so the
// body renders them into the toolbar slot through a portal.
function ZoomSlot() {
  return <div className="lightbox__zoom-slot" />;
}

function PanZoomBody({ children }: { children: ReactNode }) {
  const { viewport, content, controls, onKeyDown } = usePanZoom();
  const [slot, setSlot] = useState<Element | null>(null);

  useEffect(() => {
    setSlot(viewport.current?.closest(".lightbox")?.querySelector(".lightbox__zoom-slot") ?? null);
  }, [viewport]);

  return (
    <>
      {slot && createPortal(controls, slot)}
      <div
        ref={viewport}
        className="panzoom"
        tabIndex={0}
        aria-label="Zoomable view. Use plus and minus to zoom, arrow keys to pan, 0 to reset."
        onKeyDown={onKeyDown}
      >
        <div ref={content} className="panzoom__content">
          {children}
        </div>
      </div>
      <p className="lightbox__hint" aria-hidden="true">
        Scroll or pinch to zoom · drag to pan · double-click to zoom in or reset
      </p>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Triggers                                                            */
/* ------------------------------------------------------------------ */

function ExpandIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M8.5 1.5h4v4M5.5 12.5h-4v-4M12.5 1.5 8 6M1.5 12.5 6 8" />
    </svg>
  );
}

/** Article image that opens in the pan/zoom viewer. Valid inside a <p>. */
export function ZoomableImage({ src, alt = "" }: { src: string; alt?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="zoomable" onClick={(event) => { event.currentTarget.focus(); setOpen(true); }} aria-label={`Expand image${alt ? `: ${alt}` : ""}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" decoding="async" />
        <span className="zoomable__hint" aria-hidden="true">
          <ExpandIcon /> Expand
        </span>
      </button>
      <PanZoomLightbox open={open} onClose={() => setOpen(false)} title={/\s/.test(alt) ? alt : "Figure"}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="panzoom__media" src={src} alt={alt} draggable={false} />
      </PanZoomLightbox>
    </>
  );
}

/** Wraps a live figure (chart) with an Expand button that re-renders it larger. */
export function Expandable({ title, caption, className, children }: {
  title?: string;
  caption?: ReactNode;
  /** Classes for the expanded copy, so scoped styles still apply. */
  className?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const expanded = useExpanded();
  if (expanded) return <>{children}</>;
  return (
    <div className="expandable">
      <button type="button" className="expand-button" onClick={(event) => { event.currentTarget.focus(); setOpen(true); }} aria-label={`Expand${title ? ` ${title}` : " chart"}`}>
        <ExpandIcon />
        <span>Expand</span>
      </button>
      {children}
      <Lightbox open={open} onClose={() => setOpen(false)} title={title}>
        <div className={`lightbox__live ${className ?? ""}`}>
          {children}
          {caption && <p className="lightbox__caption">{caption}</p>}
        </div>
      </Lightbox>
    </div>
  );
}

export { ExpandIcon };
