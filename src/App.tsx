import { Suspense, lazy } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Loader from "./components/Loader";
import DashboardLayout from "./layouts/DashboardLayout";
import ApplicantLayout from "./layouts/ApplicantLayout";
import DuesPage from "./pages/dashboard/dues/DuesPage";
import ErrorPage from "./pages/ErrorPage";
import NotFoundPage from "./pages/NotFoundPage";
import { GuestOnly } from "./components/auth/guards";

function App() {
  const ServiceRequestSubmission = lazy(() => import("./pages/dashboard/service_request/serviceSubbmission"));
  const ServiceRequest = lazy(() => import("./pages/dashboard/service_request"));
  const ServiceRequestDetail = lazy(() => import("./pages/dashboard/service_request/details"));
  const TrackApplicationPage = lazy(() => import("./pages/applicant/TrackApplicationPage"));
  const ApplicationStatusPage = lazy(() => import("./pages/applicant/ApplicationStatusPage"));
  const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
  const ForgotPasswordPage = lazy(() => import("./pages/auth/forgot-password/ForgotPasswordPage"));
  const SetupNewPasswordPage = lazy(() => import("./pages/auth/forgot-password/SetupNewPasswordPage"));
  const AuthenticationPage = lazy(() => import("./pages/auth/AuthenticationPage"));
  const LogoutPage = lazy(() => import("./pages/auth/LogoutPage"));

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
  const MemberProfilePage = lazy(() => import("./pages/dashboard/members/MemberProfilePage"));
  const MemberTypeDetailPage = lazy(() => import("./pages/dashboard/member-types/MemberTypeDetailPage"));
  const MeetingPage = lazy(() => import("./pages/dashboard/meetings/MeetingPage"));
  const MeetingDetailsPage = lazy(() => import("./pages/dashboard/meetings/MeetingDetailsPage"));
  const ElectionsPage = lazy(() => import("./pages/dashboard/elections/ElectionsPage"));

  const ElectionDetailsPage = lazy(() => import("./pages/dashboard/elections/ElectionDetailsPage"));
  const FundAProjectPage = lazy(() => import("./pages/dashboard/projects/FundAProjectPage"));
  const PaystackCallbackPage = lazy(() => import("./pages/PaystackCallbackPage"));
  const SupportPage = lazy(() => import("./pages/dashboard/support/SupportPage"));

  const EnvironmentDetailPage = lazy(() => import("./pages/dashboard/environment/EnvironmentDetailPage"));
  const router = createBrowserRouter([
    /*
     * Applicant portal — public, no account.
     *
     * `/track` takes an application ID + the email it was submitted with; `/application`
     * shows the status behind the applicant shell. Neither sits inside DashboardLayout,
     * which requires a logged-in member and would bounce them to /login.
     */
    {
      path: "/track",
      element: (
        <Suspense fallback={<Loader />}>
          <TrackApplicationPage />
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/application",
      element: (
        <Suspense fallback={<Loader />}>
          <ApplicantLayout>
            <ApplicationStatusPage />
          </ApplicantLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/login",
      element: (
        <Suspense fallback={<Loader />}>
          <GuestOnly>
            <LoginPage />
          </GuestOnly>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/forgot-password",
      element: (
        <Suspense fallback={<Loader />}>
          <GuestOnly>
            <ForgotPasswordPage />
          </GuestOnly>
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
      // The consolidated Environment page (REDESIGN.md M4 / §0c). Excos, Committees, the
      // members list and member types all had their own screens; they are tabs here now.
      // Only the two detail routes survive, linked from this page.
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
          <LogoutPage />
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    { path: "*", element: <NotFoundPage /> },
  ]);
  return <RouterProvider router={router} fallbackElement={<Loader />} />;
}

export default App;
