import { useEffect, useRef } from 'react';

export const useIntersectionObserver = (
  targetRef: React.RefObject<HTMLElement | null>,
  onIntersect: IntersectionObserverCallback,
  hasNextPage: boolean
) => {
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (targetRef && targetRef.current) {
      observer.current = new IntersectionObserver(onIntersect, {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      });

      if (!hasNextPage) {
        observer.current?.unobserve(targetRef.current);
        return;
      }

      observer.current?.observe(targetRef.current);
    }

    return () => observer && observer.current?.disconnect();
  }, [targetRef, onIntersect]);
};
