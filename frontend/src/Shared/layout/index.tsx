import { FC } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./nav";

const AppLayout: FC = () => {
  return (
    <>
      <div className='flex flex-col bg-white min-h-screen'>
        <Navbar />
        <section className='px-10 '>
          <Outlet />
        </section>
      </div>
    </>
  );
};

export default AppLayout;
