import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./AppLayout/Layout";
import { HomePage } from "./pages/Home.page";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [{ index: true, element: <HomePage /> }],
	},
]);

export const Router = () => {
	return <RouterProvider router={router} />;
};
