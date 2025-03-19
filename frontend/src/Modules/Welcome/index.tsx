import NewProjectButton from "Shared/components/new-project-btn";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { doStartProjectSession } from "Modules/NewProject/fetch";
import { formatAndShowAxiosError } from "Shared/utils/errors";
import LoadingOverlay from "react-loading-overlay-ts";
import { getProjects } from "./fetch";

const projects = [
  { title: "Database Schema for User Roles" },
  { title: "Employee Management Database" },
  { title: "Permissions & Access Control Schema" },
  { title: "Customer Orders & Payments Schema" },
  { title: "Product & Cart Schema" },
];
function WelcomePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: doStartProjectSession,
    onSuccess: (data) => {
      navigate(`/projects/${data.data.slug}`);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data.data.slug] });
    },
    onError: (error) => formatAndShowAxiosError(error),
  });

  const projectsData = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects(),
  });
  return (
    <>
      <main className='flex flex-col justify-center items-center text-center py-16 flex-grow'>
        <div className='flex flex-col gap-5 text-center items-center w-[770px] max-md:w-full mb-32'>
          {projects.map((project) => (
            <button
              key={project.title}
              onClick={() => mutation.mutate({ title: project.title })}
              className={`gap-4 p-3 w-full text-2xl text-center tracking-normal leading-6 rounded-2xl h-[52px]  hover:text-blue-600 `}
            >
              {project.title}
            </button>
          ))}
        </div>
        <NewProjectButton
          onClick={() => {
            navigate("/new-project");
          }}
        />
        {projectsData?.data?.data && (
          <div className='mt-16 w-full lg:w-[80%]'>
            <h2 className='text-xl font-normal mb-8 text-center'>
              Your Projects
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {projectsData.data.data.map((project) => (
                <div
                  key={project.slug}
                  onClick={() => navigate(`/projects/${project.slug}`)}
                  className='cursor-pointer border border-gray-200 p-4 rounded-md hover:border-gray-300 transition-colors'
                >
                  <h3 className='font-medium text-lg'>{project.title}</h3>
                  <p className='text-gray-500 text-sm mt-1'>
                    {new Date(project.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <LoadingOverlay
        active={mutation.isPending}
        spinner
        className={mutation.isPending ? "h-screen w-screen !fixed inset-0" : ""}
        text='Creating project...'
      />
    </>
  );
}

export default WelcomePage;
