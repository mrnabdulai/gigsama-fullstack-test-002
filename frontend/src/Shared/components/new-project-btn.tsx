import React from "react";

const NewProjectButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className='inline-flex gap-1 justify-center items-center px-12 py-3.5 text-white bg-black rounded-[100px] hover:bg-black/80'
      aria-label='Create new project'
    >
      <svg
        width='26'
        height='27'
        viewBox='0 0 26 27'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        className='w-[26px] h-[26px]'
      >
        <path
          d='M12.0248 12.525V6.67499H13.9748V12.525H19.8248V14.475H13.9748V20.325H12.0248V14.475H6.1748V12.525H12.0248Z'
          fill='white'
        />
      </svg>
      <span className='text-lg font-medium tracking-normal leading-5'>
        New Project
      </span>
    </button>
  );
};

export default NewProjectButton;
