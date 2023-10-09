import { useCallback, useEffect, useRef, useState, LegacyRef } from "react";

/**
 * IntersectionObserverを利用するためのhook
 * 無限スクロールなどで用いる
 * https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 * @param {Object} options https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver#parameters
 * @return {[boolean,(function(*): void)]}
 */
export const useIntersection = (
  options = {},
): [boolean, LegacyRef<HTMLLIElement>] => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [refTrigger, setRefTrigger] = useState(0);
  const ref = useRef<HTMLElement | null>(null);
  const callbackRef = useCallback((element: HTMLElement) => {
    if (element) {
      ref.current = element;
      setIsIntersecting(false);
      setRefTrigger(Date.now());
    }
  }, []);

  useEffect(() => {
    if (refTrigger && ref.current) {
      const observer = new IntersectionObserver(([entry], observer) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.unobserve(entry.target);
        }
      }, options);
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [options, refTrigger]);

  return [isIntersecting, callbackRef as LegacyRef<HTMLLIElement>];
};
