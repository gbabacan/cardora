import { useCallback, useEffect, useRef, useState } from 'react';

// Keeps a header's middle column centred on the page: measures the natural
// width of the left and right content and reports the larger, so both side
// wrappers can use it as their minimum width. Measure the content, not the
// wrappers, or the minimum width would feed back into the measurement.
export function useEqualSides() {
  const elements = useRef<{ left: HTMLElement | null; right: HTMLElement | null }>({ left: null, right: null });
  const observer = useRef<ResizeObserver | null>(null);
  const [sideWidth, setSideWidth] = useState(0);

  const measure = useCallback(() => {
    const { left, right } = elements.current;
    setSideWidth(Math.ceil(Math.max(left?.offsetWidth ?? 0, right?.offsetWidth ?? 0)));
  }, []);

  const track = useCallback((side: 'left' | 'right', element: HTMLElement | null) => {
    const previous = elements.current[side];
    if (previous) observer.current?.unobserve(previous);
    elements.current[side] = element;
    if (element) {
      observer.current ??= new ResizeObserver(measure);
      observer.current.observe(element);
    }
    measure();
  }, [measure]);

  const leftRef = useCallback((element: HTMLElement | null) => track('left', element), [track]);
  const rightRef = useCallback((element: HTMLElement | null) => track('right', element), [track]);

  useEffect(() => () => observer.current?.disconnect(), []);

  return { leftRef, rightRef, sideWidth };
}
