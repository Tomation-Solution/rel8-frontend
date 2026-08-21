import { Suspense, lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Loader from "./components/Loader";
import DashboardLayout from "./layouts/DashboardLayout";
import ActivateAccount from "./pages/ActivateAccount";
import DuesPage from "./pages/dashboard/dues/DuesPage";
import ErrorPage from "./pages/ErrorPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const ServiceRequestSubmission = lazy(() => import("./pages/dashboard/service_request/serviceSubbmission"));
  const ServiceRequest = lazy(() => import("./pages/dashboard/service_request"));
  const ServiceRequestDetail = lazy(() => import("./pages/dashboard/service_request/details"));
  const VerifyMemberPage = lazy(() => import("./pages/auth/VerifyMemberPage"));
  const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
  const RegistrationPage = lazy(() => import("./pages/auth/RegistrationPage"));
  const ForgotPasswordPage = lazy(() => import("./pages/auth/forgot-password/ForgotPasswordPage"));
  const EnterCodePage = lazy(() => import("./pages/auth/forgot-password/EnterCodePage"));
  const SetupNewPasswordPage = lazy(() => import("./pages/auth/forgot-password/SetupNewPasswordPage"));
  const PayupPage = lazy(() => import("./pages/auth/PayupPage"));
  const AuthenticationPage = lazy(() => import("./pages/auth/AuthenticationPage"));

  const HomePage = lazy(() => import("./pages/dashboard/home/HomePage"));
  // const ProfilePage = lazy(() => import("./pages/dashboard/profile/ProfilePage"));
  const EventsPage = lazy(() => import("./pages/dashboard/events/EventsPage"));
  const EventDetailPage = lazy(() => import("./pages/dashboard/events/EventDetailPage"));
  const MyRegistrationsPage = lazy(() => import("./pages/dashboard/events/MyRegistrationsPage"));
  const GalleryPage = lazy(() => import("./pages/dashboard/gallery/GalleryPage"));
  const GalleryDetailPage = lazy(() => import("./pages/dashboard/gallery/GalleryDetailPage"));
  const AccountPage = lazy(() => import("./pages/dashboard/account/AccountPage"));
  const NotificationsPage = lazy(() => import("./pages/dashboard/notifications/NotificationsPage"));
  const PublicationsPage = lazy(() => import("./pages/dashboard/publications/PublicationsPage"));
  const PublicationsDetailPage = lazy(() => import("./pages/dashboard/publications/PublicationsDetailPage"));

  const NewsPage = lazy(() => import("./pages/dashboard/news/index"));
  const NewsDetailPage = lazy(() => import("./pages/dashboard/news/NewsDetailPage"));

  const EnvironmentPage = lazy(() => import("./pages/dashboard/environment/EnvironmentPage"));
  const MembersPage = lazy(() => import("./pages/dashboard/members/MembersPage"));
  const MemberProfilePage = lazy(() => import("./pages/dashboard/members/MemberProfilePage"));
  const MemberTypesPage = lazy(() => import("./pages/dashboard/member-types/MemberTypesPage"));
  const MemberTypeDetailPage = lazy(() => import("./pages/dashboard/member-types/MemberTypeDetailPage"));
  const MeetingPage = lazy(() => import("./pages/dashboard/meetings/MeetingPage"));
  const MeetingDetailsPage = lazy(() => import("./pages/dashboard/meetings/MeetingDetailsPage"));
  const ElectionsPage = lazy(() => import("./pages/dashboard/elections/ElectionsPage"));

  const ElectionDetailsPage = lazy(() => import("./pages/dashboard/elections/ElectionDetailsPage"));
  const FundAProjectPage = lazy(() => import("./pages/dashboard/projects/FundAProjectPage"));
  const PaystackCallbackPage = lazy(() => import("./pages/PaystackCallbackPage"));
  const ServicesPage = lazy(() => import("./pages/dashboard/services/ServicesPage"));
  const LossOfCertificatePage = lazy(() => import("./pages/dashboard/services/LossOfCertificatePage"));
  const ReIssuanceFormPage = lazy(() => import("./pages/dashboard/services/ReIssuanceFormPage"));
  const DeactivationOfMembershipPage = lazy(() => import("./pages/dashboard/services/DeactivationOfMembershipPage"));
  const ReIssuanceOfCertificatePage = lazy(() => import("./pages/dashboard/services/ReIssuanceOfCertificatePage"));
  const FactoryLocationUpdatePage = lazy(() => import("./pages/dashboard/services/FactoryLocationUpdatePage"));
  const ChangeOfNamePage = lazy(() => import("./pages/dashboard/services/ChangeOfNamePage"));
  const MergerOfCompaniesPage = lazy(() => import("./pages/dashboard/services/MergerOfCompaniesPage"));
  const ProductManufacturingUpdatePage = lazy(() => import("./pages/dashboard/services/ProductManufacturingUpdatePage"));
  const SupportPage = lazy(() => import("./pages/dashboard/support/SupportPage"));

  const EnvironmentDetailPage = lazy(() => import("./pages/dashboard/environment/EnvironmentDetailPage"));
  const router = createBrowserRouter([
    {
      path: "/verify-membership",
      element: (
        <Suspense fallback={<Loader />}>
          <VerifyMemberPage />
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/login",
      element: (
        <Suspense fallback={<Loader />}>
          <LoginPage />
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/register",
      element: (
        <Suspense fallback={<Loader />}>
          <RegistrationPage />
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/forgot-password",
      element: (
        <Suspense fallback={<Loader />}>
          <ForgotPasswordPage />
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/authentication",
      element: (
        <Suspense fallback={<Loader />}>
          <AuthenticationPage />
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/setup-new-password",
      element: (
        <Suspense fallback={<Loader />}>
          <SetupNewPasswordPage />
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/enter-code",
      element: (
        <Suspense fallback={<Loader />}>
          <EnterCodePage />
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/pay-dues",
      element: (
        <Suspense fallback={<Loader />}>
          <PayupPage />
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <HomePage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    // {
    //   path: "/profile",
    //   element: (
    //     <Suspense fallback={<Loader />} >
    //       <DashboardLayout >
    //         <ProfilePage />
    //       </DashboardLayout>
    //     </Suspense>
    //   ),
    //   errorElement: <ErrorPage />,
    // },
    {
      path: "/events",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <EventsPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/events/my-registrations",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <MyRegistrationsPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/service-requests",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <ServiceRequest />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/service-requests/:id",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <ServiceRequestDetail />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/service-requests-submission/:id",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <ServiceRequestSubmission />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/paystack/callback",
      element: (
        <Suspense fallback={<Loader />}>
          <PaystackCallbackPage />
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },

    {
      path: "/event/:eventId",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <EventDetailPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/gallery/",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <GalleryPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/gallery/:galleryId",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <GalleryDetailPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/account",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <AccountPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/dues",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <DuesPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/notifications",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <NotificationsPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/publications",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <PublicationsPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/publication/:publicationId",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <PublicationsDetailPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },

    {
      path: "/news",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <NewsPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/news/:newsId",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <NewsDetailPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },

    {
      path: "/registry",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <MembersPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      // The consolidated Environment page (REDESIGN.md M4 / §0c). Excos and Committees had
      // their own screens here until the backend collapsed all three into `Environment`;
      // `/members` and `/member-types` still resolve to their old screens until M15.
      path: "/environment",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <EnvironmentPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/members",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <MembersPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/members/:id",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <MemberProfilePage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/member-types",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <MemberTypesPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/member-types/:id",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <MemberTypeDetailPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/meeting",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <MeetingPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },

    {
      path: "/meeting/:id",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <MeetingDetailsPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },

    {
      path: "/election",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <ElectionsPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/election/:id",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <ElectionDetailsPage />
          </DashboardLayout>
        </Suspense>
      ),
    },
    {
      path: "/fund-a-project",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <FundAProjectPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/services",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <ServicesPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/loss-of-certificate-page",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <LossOfCertificatePage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/reissuance-form",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <ReIssuanceFormPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/deactivate-membership",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <DeactivationOfMembershipPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/reissuance-of-certificate",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <ReIssuanceOfCertificatePage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/factory-location-update",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <FactoryLocationUpdatePage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/product-manufacturing-update",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <ProductManufacturingUpdatePage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/change-of-name",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <ChangeOfNamePage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/merger-of-companies",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <MergerOfCompaniesPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/support",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <SupportPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      // Was `/groups/:id`. Groups, committees and excos are all `Environment` documents
      // (REDESIGN.md §0c), so there is one detail route for all three.
      path: "/environment/:id",
      element: (
        <Suspense fallback={<Loader />}>
          <DashboardLayout>
            <EnvironmentDetailPage />
          </DashboardLayout>
        </Suspense>
      ),
    },
    {
      path: "/logout",
      element: (
        <Suspense fallback={<Loader />}>
          <LoginPage />
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/mailing",
      element: (
        <Suspense fallback={<Loader />}>
          <ActivateAccount />
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    { path: "*", element: <NotFoundPage /> },
  ]);
  return <RouterProvider router={router} fallbackElement={<Loader />} />;
}

export default App;
