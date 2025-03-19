import * as React from "react";

const LoadingIcon = (props: React.SVGProps<any>) => (
  <svg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path fill='none' d='M0 0h256v256H0z' />
    <path d='M136 32v32a8 8 0 0 1-16 0V32a8 8 0 0 1 16 0Zm88 88h-32a8 8 0 0 0 0 16h32a8 8 0 0 0 0-16Zm-45.1 47.6a8 8 0 0 0-11.3 11.3l22.6 22.6a8 8 0 0 0 5.7 2.4 7.7 7.7 0 0 0 5.6-2.4 7.9 7.9 0 0 0 0-11.3ZM128 184a8 8 0 0 0-8 8v32a8 8 0 0 0 16 0v-32a8 8 0 0 0-8-8Zm-50.9-16.4-22.6 22.6a7.9 7.9 0 0 0 0 11.3 7.7 7.7 0 0 0 5.6 2.4 8 8 0 0 0 5.7-2.4l22.6-22.6a8 8 0 0 0-11.3-11.3ZM72 128a8 8 0 0 0-8-8H32a8 8 0 0 0 0 16h32a8 8 0 0 0 8-8Zm-6.2-73.5a8 8 0 0 0-11.3 11.3l22.6 22.6a8.1 8.1 0 0 0 11.3 0 8 8 0 0 0 0-11.3Z' />
  </svg>
);

export default LoadingIcon;
