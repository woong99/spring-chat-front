import { useEffect, useRef } from 'react';

export const useIntersectionObserver = (
  targetRef,
  onIntersect,
  hasNextPage
) => {
  const observer = useRef();

  useEffect(() => {
    if (targetRef && targetRef.current) {
      console.log('targetRef', targetRef.current);
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
