import { createBrowserRouter } from 'react-router-dom';
import UserLayout from '../layouts/user/UserLayout.tsx';
import SuperheroListPage from "../../pages/SuperheroListPage/SuperheroListPage.tsx";
import SuperheroDetailsPage from "../../pages/SuperheroDetailsPage/SuperheroDetailsPage.tsx";
import CreateSuperheroPage from "../../pages/CreateSuperheroPage/CreateSuperheroPage.tsx";
import EditSuperheroPage from "../../pages/EditSuperheroPage/EditSuperheroPage.tsx";

export const router = createBrowserRouter([
    {
        element: <UserLayout />,
        children: [
            {
                path: '/',
                element: <SuperheroListPage/>
            },
            {
                path: '/superheroes/:id',
                element: <SuperheroDetailsPage/>
            },
            {
                path: '/superheroes/create',
                element: <CreateSuperheroPage/>
            },
            {
                path: '/superheroes/:id/edit',
                element: <EditSuperheroPage/>
            },
        ]
    },
]);