import { Navigate, RouteObject } from "react-router-dom";
import AppLayout from "Shared/layout";
import WelcomePage from "Modules/Welcome";
import NewProjectPage from "Modules/NewProject";
import ProjectChatPage from "Modules/Project";

const routes: RouteObject[] = [
  {
    path: "/*",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <WelcomePage />,
      },
      {
        path: "new-project",
        element: <NewProjectPage />,
      },
      {
        path: "projects/:slug",
        element: <ProjectChatPage />,
      },
    ],
  },

  {
    path: "*",
    element: <Navigate to='/' />,
  },
];

export default routes;
