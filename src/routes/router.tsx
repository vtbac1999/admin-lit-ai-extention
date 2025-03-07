import PageLoader from 'components/loading/PageLoader';
import Progress from 'components/loading/Progress';
import MemberManagement from 'pages/member/member';
import SubcategoryManager from 'pages/prompt/prompt';
import QuestionsPage from 'pages/question/question';
import TokenManagement from 'pages/token/token';
import { Suspense, lazy } from 'react';
import { Outlet, createBrowserRouter } from 'react-router-dom';
import paths, { rootPaths } from './paths';
import SubscriptionManagement from 'pages/price-plan/price-plan';
import PricePlan from 'pages/price-plan/price-plan';
import SubscriptionPage from 'pages/subscription/subscription';

const App = lazy(() => import('App'));
const MainLayout = lazy(() => import('layouts/main-layout'));
const AuthLayout = lazy(() => import('layouts/auth-layout'));
const Dashboard = lazy(() => import('pages/dashboard/Dashboard'));
const SignIn = lazy(() => import('pages/authentication/SignIn'));
const SignUp = lazy(() => import('pages/authentication/SignUp'));
const Page404 = lazy(() => import('pages/errors/Page404'));
const UserManagement = lazy(() => import('pages/user/user'));

export const routes = [
  {
    element: (
      <Suspense fallback={<Progress />}>
        <App />
      </Suspense>
    ),
    children: [
      {
        path: rootPaths.root,
        element: (
          <MainLayout>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </MainLayout>
        ),
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
        ],
      },
      {
        element: (
          <MainLayout>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </MainLayout>
        ),
        path: '/user',
        children: [
          {
            index: true,
            element: <UserManagement />,
          },
        ],
      },
      {
        element: (
          <MainLayout>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </MainLayout>
        ),
        path: '/pricing-plan',
        children: [
          {
            index: true,
            element: <PricePlan />,
          },
        ],
      },
      {
        element: (
          <MainLayout>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </MainLayout>
        ),
        path: '/subscription',
        children: [
          {
            index: true,
            element: <SubscriptionPage />,
          },
        ],
      },
      {
        element: (
          <MainLayout>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </MainLayout>
        ),
        path: '/token',
        children: [
          {
            index: true,
            element: <TokenManagement />,
          },
        ],
      },
      {
        element: (
          <MainLayout>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </MainLayout>
        ),
        path: '/question',
        children: [
          {
            index: true,
            element: <QuestionsPage />,
          },
        ],
      },
      {
        element: (
          <MainLayout>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </MainLayout>
        ),
        path: '/member',
        children: [
          {
            index: true,
            element: <MemberManagement />,
          },
        ],
      },
      {
        element: (
          <MainLayout>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </MainLayout>
        ),
        path: '/prompt',
        children: [
          {
            index: true,
            element: <SubcategoryManager />,
          },
        ],
      },
      {
        path: rootPaths.authRoot,
        element: <AuthLayout />,
        children: [
          {
            path: paths.signin,
            element: <SignIn />,
          },
          {
            path: paths.signup,
            element: <SignUp />,
          },
        ],
      },
      {
        path: '*',
        element: <Page404 />,
      },
    ],
  },
];

const router = createBrowserRouter(routes, { basename: '' });

export default router;
