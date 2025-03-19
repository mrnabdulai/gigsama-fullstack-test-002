
export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ')
}
export const wrapOnchange = (fn: (val: any) => void) => (e: any) => {
  e.preventDefault();
  fn(e.target.value);
};
export const wrapClick = (fn: () => void) => (e: any) => {
  e.preventDefault();
  e.stopPropagation();
  fn();
};

