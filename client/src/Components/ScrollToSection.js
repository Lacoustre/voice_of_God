export function scrollToSection(id) {
  const element = document.getElementById(id);
  if (element) {
    const yOffset = -100;
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({top: y, behavior: 'smooth'});
  }
}