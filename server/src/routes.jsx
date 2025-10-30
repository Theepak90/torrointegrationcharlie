import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// Use React.lazy to implement component lazy loading
const DashboardLayout = lazy(() => import('src/layouts/DashboardLayout'));
const MainLayout = lazy(() => import('src/layouts/MainLayout'));
const NotFoundView = lazy(() => import('src/views/Errors/NotFoundView'));
const NoWorkspace = lazy(() => import('src/views/Errors/NoWorkspace'));
const LoginPage = lazy(() => import('src/views/Login'));
const VDIPage = lazy(() => import('src/views/vdi'));
const RoleSelection = lazy(() => import('src/views/RoleSelection'));
const Dashboard = lazy(() => import('src/views/Dashboard'));
const FormPage = lazy(() => import('src/views/FormPage'));
const WorkflowManagement = lazy(() => import('src/views/WorkflowManagement'));
// const BashCommand = lazy(() => import("src/views/BashCommand"));
const FormManagement = lazy(() => import('src/views/FormManagement'));
const OrgSetting = lazy(() => import('src/views/OrgSetting'));
const WorkspaceCreation = lazy(() => import('src/views/WorkspaceCreation'));
const WorkspaceManage = lazy(() => import('src/views/WorkspaceManage'));
const DataGovernorTagTemplate = lazy(() =>
  import('src/views/DataGovernorTagTemplate')
);
const PolicyManagement = lazy(() => import('src/views/PolicyManagement'));
const DataOnBoarding = lazy(() => import('src/views/DataOnBoarding'));
const DataDiscovery = lazy(() => import('src/views/DataDiscovery'));
const Visualisation = lazy(() => import('src/views/Visualisation'));
const GetDataAccess = lazy(() => import('src/views/GetDataAccess'));
const WorkflowPage = lazy(() => import('src/views/WorkflowPage'));
const DataMonitoringPage = lazy(() => import('src/views/DataMonitoringPage'));
const RequestDetailPage = lazy(() => import('src/views/RequestDetailPage'));
const AdminPage = lazy(() => import('src/views/AdminPage'));
const BatchUpload = lazy(() => import('./views/BatchUpload'));
const DataDiscoverySystem = lazy(() => import('src/views/DataDiscoverySystem'));
// Data Nexus (torro2) pages
const ConnectorsPage = lazy(() => import('src/torro2/pages/ConnectorsPage'));
const AssetsPage = lazy(() => import('src/torro2/pages/AssetsPage'));
const DataLineagePage = lazy(() => import('src/torro2/pages/DataLineagePage'));
const MarketplacePage = lazy(() => import('src/torro2/pages/MarketplacePage'));
const TrinoGovernanceControlPage = lazy(() => import('src/torro2/pages/TrinoGovernanceControlPage'));

const routes = (language, isLoggedIn, haveRole) => {
  const lanPrefix = ''; //language === "cn" ? "/cn" : "";
  return [
    {
      path: lanPrefix + '/login',
      element: <LoginPage />,
    },
    {
      path: lanPrefix + '/orgSetting',
      element: <OrgSetting />,
    },
    {
      path: lanPrefix + '/roleSelect',
      element: <RoleSelection />,
    },
    {
      path: lanPrefix + '/noWorkspace',
      element: <NoWorkspace />,
    },
    {
      path: lanPrefix + '/app',
      element: <DashboardLayout singlePage={true} />,
      children: [
        {
          path: 'dashboard',
          element: <Dashboard />,
        },
        { path: 'forms', element: <FormPage /> },
        { path: 'dataMonitoring', element: <DataMonitoringPage /> },
        { path: 'createTagTemplate', element: <FormManagement tagTemplate /> },
        { path: 'workflowManagement', element: <WorkflowManagement /> },
        // { path: "bashCommand", element: <BashCommand /> },
        { path: 'WorkspaceCreation', element: <WorkspaceCreation /> },
        {
          path: 'dataGovernorTagTemplate',
          element: <DataGovernorTagTemplate />,
        },
        { path: 'policyManagement', element: <PolicyManagement /> },
        { path: 'dataOnboarding', element: <DataOnBoarding /> },
        {
          path: 'exploration',
          element: <DataDiscovery />,
        },
        { path: 'visualisation', element: <Visualisation /> },
        { path: 'BatchUpload', element: <BatchUpload /> },
        { path: 'requestDetail', element: <RequestDetailPage /> },
        { path: 'admin', element: <AdminPage /> },
        { path: 'dataDiscoverySystem', element: <DataDiscoverySystem /> },
        // Data Nexus routes
        { path: 'connectors', element: <ConnectorsPage /> },
        { path: 'assets', element: <AssetsPage /> },
        { path: 'dataLineage', element: <DataLineagePage /> },
        { path: 'marketplace', element: <MarketplacePage /> },
        { path: 'trinoGovernanceControl', element: <TrinoGovernanceControlPage /> },
        {
          path: 'approvalFlow',
          element: <RequestDetailPage approved={true} />,
        },
      ],
    },
    {
      path: lanPrefix + '/app',
      element: <DashboardLayout />,
      children: [
        { path: 'workflow', element: <WorkflowPage /> },
        { path: 'WorkspaceManage', element: <WorkspaceManage /> },
        { path: 'formManagement', element: <FormManagement /> },
        { path: 'getDataAccess', element: <GetDataAccess /> },
      ],
    },
    {
      path: lanPrefix + '/',
      element: <MainLayout />,
      children: [
        { path: '404', element: <NotFoundView /> },
        {
          path: '/',
          element: <Navigate to='/app/dashboard' />,
        },
        { path: '*', element: <Navigate to='/404' /> },
      ],
    },
  ];
};

export default routes;
