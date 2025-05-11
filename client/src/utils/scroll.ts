export function scrollToTop(delay = 0): void {
    setTimeout(() => {
        if (window.scrollY > 0) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, delay);
}
