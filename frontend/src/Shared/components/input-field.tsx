import { LoaderIcon } from "react-hot-toast";
import UploadIcon from "./upload-icon";
import { forwardRef } from "react";
import { classNames } from "Shared/utils/ui";

interface InputFieldProps {
  id?: string;
  submitting?: boolean;
  disabled?: boolean;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ id = "title", submitting = false, disabled = false, ...props }, ref) => {
    return (
      <div
        className={classNames(
          "flex justify-between items-center px-5 py-5 bg-white rounded-3xl border border-solid shadow-md border-black border-opacity-10 w-[800px] max-md:mx-5 max-md:my-0 max-md:w-[90%] max-sm:p-4 max-sm:mx-2.5 max-sm:my-0",
          disabled ? "bg-[#fafafa] opacity-50 cursor-not-allowed" : ""
        )}
      >
        <input
          ref={ref}
          id={id}
          disabled={disabled}
          type='text'
          className='flex-1 text-base tracking-normal leading-6 text-zinc-500 placeholder:text-zinc-500 focus:outline-none'
          placeholder='Ask anything'
          aria-label='Ask anything'
          {...props}
        />
        <button
          disabled={disabled}
          className='flex justify-center items-center w-9 h-9 bg-black rounded-full'
        >
          {submitting ? <LoaderIcon /> : <UploadIcon />}
        </button>
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
