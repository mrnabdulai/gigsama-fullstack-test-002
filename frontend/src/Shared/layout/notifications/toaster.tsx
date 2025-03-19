import { FC, Fragment, useRef } from "react";
import { Transition } from "@headlessui/react";
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import toast, { Toast, useToaster } from "react-hot-toast";
import { classNames, wrapClick } from "../../utils/ui";

const Toaster: FC = () => {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause } = handlers;

  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        ref={useRef(null)}
        onMouseEnter={startPause}
        onMouseLeave={endPause}
        aria-live='assertive'
        className={classNames(
          "fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50"
        )}
      >
        <div className='w-full flex flex-col items-center space-y-4 sm:items-end'>
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          {toasts
            .filter((toast) => toast.visible)
            .map((toast) => (
              <Transition
                key={toast.id}
                show={true}
                as={Fragment}
                enter='transform ease-out duration-300 transition'
                enterFrom='translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2'
                enterTo='translate-y-0 opacity-100 sm:translate-x-0'
                leave='transition ease-in duration-100'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
              >
                <div className='max-w-sm w-full'>
                  <AlertToaster key={toast.id} toast={toast} />
                </div>
              </Transition>
            ))}
        </div>
      </div>
    </>
  );
};

export default Toaster;

interface ToastComponentProps {
  toast: Toast;
}

const AlertToaster: FC<ToastComponentProps> = ({ toast: _toast }) => {
  const _toastMessage = JSON.parse(_toast.message as string);
  return (
    <div
      {..._toast.ariaProps}
      className='max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden'
    >
      <div className='p-3'>
        <div
          className={classNames(
            _toastMessage.description ? "items-start" : "items-center",
            "flex"
          )}
        >
          <div className='flex-shrink-0'>
            {_toastMessage.type === "success" && (
              <CheckCircleIcon
                className='h-6 w-6 text-green-400'
                aria-hidden='true'
              />
            )}
            {_toastMessage.type === "error" && (
              <ExclamationCircleIcon
                className='h-6 w-6 text-red-400'
                aria-hidden='true'
              />
            )}
            {_toastMessage.type === "loading" && (
              <ArrowPathIcon
                className='h-6 w-6 text-gray-400 animate-spin'
                aria-hidden='true'
              />
            )}
            {_toastMessage.type === "notification" && (
              <BellIcon
                className='h-6 w-6 text-blue-400'
                aria-hidden='true'
              />
            )}
            {_toastMessage.type === "warning" && (
              <ExclamationTriangleIcon
                className='h-6 w-6 text-yellow-400'
                aria-hidden='true'
              />
            )}
          </div>
          <div
            className={classNames(
              _toastMessage.description ? "pt-0.5" : "",
              _toastMessage.type ? "ml-3" : "",
              "w-0 flex-1 flex justify-between items-start"
            )}
          >
            <div>
              <p className='text-sm font-medium text-info-500 '>
                {_toastMessage.title}
              </p>
              {_toastMessage.description && (
                <p className='mt-1 text-sm text-gray-500 '>
                  {_toastMessage.description}
                </p>
              )}
              {_toastMessage.actions && (
                <div className='mt-3 flex space-x-7'>
                  <button
                    type='button'
                    className='rounded-md text-sm font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                  >
                    Undo
                  </button>
                  <button
                    type='button'
                    className='rounded-md text-sm font-medium text-zinc-600  hover:text-zinc-500  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
            {_toastMessage.undoable && (
              <button
                type='button'
                className='ml-3 flex-shrink-0 rounded-md text-sm font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
              >
                Undo
              </button>
            )}
          </div>
          <div className='ml-4 flex-shrink-0 flex'>
            <button
              className='rounded-md inline-flex text-zinc-500  hover:text-gray-600  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
              onClick={wrapClick(() => toast.dismiss(_toast.id))}
            >
              <span className='sr-only'>Close</span>
              <XMarkIcon className='h-5 w-5' aria-hidden='true' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
