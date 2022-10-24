import { useEffect, useState } from 'react';

export const useOnScreen = (ref) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting);
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.1,
            }
        );
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            observer.disconnect();
        };
    }, [ref]);
    return isIntersecting;
};
