export function observeSection(sectionSelector, callback) {
  const section = document.querySelector(sectionSelector);
  if (!section) return;

  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry.target);
          observerInstance.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(section);
}
