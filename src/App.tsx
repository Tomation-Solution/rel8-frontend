import { Suspense, lazy } from "react";
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import Loader from "./components/Loader";
import NotFoundPage from "./pages/NotFoundPage";
import ActivateAccount from "./pages/ActivateAccount";
import DashboardLayout from "./layouts/DashboardLayout";


function App() {
  
  const  ServiceRequestSubmission = lazy(()=> import( "./pages/dashboard/service_request/serviceSubbmission"));
  const  ServiceRequest = lazy(()=> import( "./pages/dashboard/service_request"));
  const  ServiceRequestDetail = lazy(()=> import( "./pages/dashboard/service_request/details"));
  const VerifyMemberPage = lazy(() => import("./pages/auth/VerifyMemberPage"));
  const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
  const RegistrationPage = lazy(() => import("./pages/auth/RegistrationPage"));
  const ForgotPasswordPage = lazy(() => import("./pages/auth/forgot-password/ForgotPasswordPage"));
  const EnterCodePage = lazy(() => import("./pages/auth/forgot-password/EnterCodePage"));
  const SetupNewPasswordPage = lazy(() => import("./pages/auth/forgot-password/SetupNewPasswordPage"));
  const PayupPage = lazy(() => import("./pages/auth/PayupPage"));
  
  
  const ChatPage = lazy(() => import("./pages/chat/ChatPage"));
  const HomePage = lazy(() => import("./pages/dashboard/home/HomePage"));
  const ProfilePage = lazy(() => import("./pages/dashboard/profile/ProfilePage"));
  const EventsPage = lazy(() => import("./pages/dashboard/events/EventsPage"));
  const EventDetailPage = lazy(() => import("./pages/dashboard/events/EventDetailPage"));
  const GalleryPage = lazy(() => import("./pages/dashboard/gallery/GalleryPage"));
  const GalleryDetailPage = lazy(() => import("./pages/dashboard/gallery/GalleryDetailPage"));
  const AccountPage = lazy(() => import("./pages/dashboard/account/AccountPage"));
  const NotificationsPage = lazy(() => import("./pages/dashboard/notifications/NotificationsPage"));
  const PublicationsPage = lazy(() => import("./pages/dashboard/publications/PublicationsPage"));
  const PublicationsDetailPage = lazy(() => import("./pages/dashboard/publications/PublicationsDetailPage"));

  const NewsPage = lazy(() => import("./pages/dashboard/news/index"));
  const NewsDetailPage = lazy(() => import("./pages/dashboard/news/NewsDetailPage"));

  const MembersPage = lazy(() => import("./pages/dashboard/members/MembersPage"));
  const ExcosPage = lazy(() => import("./pages/dashboard/members/ExcosPage"));
  const MeetingPage = lazy(() => import("./pages/dashboard/meetings/MeetingPage"));
  const ElectionsPage = lazy(() => import("./pages/dashboard/elections/ElectionsPage"));
  const ElectionsContestantDetailPage = lazy(() => import("./pages/dashboard/elections/ElectionContestantDetailPage"));
  const ElectionsContestantsPage = lazy(() => import("./pages/dashboard/elections/ElectionContestantsPage"));
  const ElectionAllVotesPage = lazy(() => import("./pages/dashboard/elections/ElectionAllVotes"));
  const ElectionStepPage = lazy(() => import("./pages/dashboard/elections/ElectionStepsPage"));
  const ElectionCreateAspirantPage = lazy(() => import("./pages/dashboard/elections/ElectionCreateAspirantPage"));
  const FundAProjectPage = lazy(() => import("./pages/dashboard/fund-a-project/FundAProjectPage"));
  const FundAProjectDetailPage = lazy(() => import("./pages/dashboard/fund-a-project/FundAProjectDetailPage"));
  const SupportInKindPage = lazy(() => import("./pages/dashboard/fund-a-project/SuportInKindPage"));
  const SupportInCashPage = lazy(() => import("./pages/dashboard/fund-a-project/SupportInCashPage"));
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
  const FAQPage = lazy(() => import("./pages/dashboard/support/FAQPage"));
  const TechnicalSupportPage = lazy(() => import("./pages/dashboard/support/TechnicalSupportPage"));
  const AdminSupportPage = lazy(() => import("./pages/dashboard/support/AdminSupportPage"));

  const CommitteeDetails = lazy(() => import("./pages/dashboard/committees/CommitteesDetails"));
  
  const router = createBrowserRouter([
    {
      path: "/verify-membership",
      element: (
        <Suspense fallback={<Loader/>}>
          <VerifyMemberPage />
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/login",
      element: (
        <Suspense fallback={<Loader/>}>
          <LoginPage />
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/register",
      element: (
        <Suspense fallback={<Loader/>}>
          <RegistrationPage />
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/forgot-password",
      element: (
        <Suspense fallback={<Loader/>}>
          <ForgotPasswordPage />
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/setup-new-password",
      element: (
        <Suspense fallback={<Loader/>}>
          <SetupNewPasswordPage />
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/enter-code",
      element: (
        <Suspense fallback={<Loader/>}>
          <EnterCodePage />
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/pay-dues",
      element: (
        <Suspense fallback={<Loader/>}>
          <PayupPage />
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <HomePage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/profile",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <ProfilePage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/events",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <EventsPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/service-requests",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <ServiceRequest />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/service-requests/:id",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <ServiceRequestDetail />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/service-requests-submission/:id",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <ServiceRequestSubmission />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    
    {
      path: "/event/:eventId",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <EventDetailPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/gallery/",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <GalleryPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/gallery/:galleryId",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <GalleryDetailPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/account",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <AccountPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/notifications",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <NotificationsPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/publications",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <PublicationsPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/publication/:publicationId",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <PublicationsDetailPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },

    {
      path: "/news",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <NewsPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/news/:newsId",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <NewsDetailPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },

    {
      path: "/registry",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <MembersPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/excos",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <ExcosPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/meeting",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <MeetingPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/election",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <ElectionsPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/election/:electionPositionId",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <ElectionsContestantsPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/elections-contestant/:id",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <ElectionsContestantDetailPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/all-votes",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <ElectionAllVotesPage />
          </DashboardLayout>
        </Suspense>
      ),
    },
    {
      path: "/election-steps",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <ElectionStepPage />
          </DashboardLayout>
        </Suspense>
      ),
    },
    {
      path: "/create-aspirant",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <ElectionCreateAspirantPage />
          </DashboardLayout>
        </Suspense>
      ),
    },
    {
      path: "/fund-a-project",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <FundAProjectPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/fund-a-project/:projectId",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <FundAProjectDetailPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/support-in-kind/:projectId",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <SupportInKindPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/support-in-cash/:projectId",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <SupportInCashPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/services",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <ServicesPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/loss-of-certificate-page",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <LossOfCertificatePage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/reissuance-form",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <ReIssuanceFormPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/deactivate-membership",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <DeactivationOfMembershipPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/reissuance-of-certificate",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <ReIssuanceOfCertificatePage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/factory-location-update",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <FactoryLocationUpdatePage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/product-manufacturing-update",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <ProductManufacturingUpdatePage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/change-of-name",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <ChangeOfNamePage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/merger-of-companies",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <MergerOfCompaniesPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/support",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <SupportPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/faq",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <FAQPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/technical-support",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <TechnicalSupportPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/admin-support",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <AdminSupportPage />
          </DashboardLayout>
        </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/chat",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <ChatPage />
          </DashboardLayout>
        </Suspense>
      ),
    },
    {
      path: "/committees/:id",
      element: (
        <Suspense fallback={<Loader />} >
          <DashboardLayout >
            <CommitteeDetails />
          </DashboardLayout>
        </Suspense>
      ),
    },
    {
      path: "/logout",
      element: (
          <Suspense fallback={<Loader/>}>
            <LoginPage />
          </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    {
      path: "/mailing",
      element: (
          <Suspense fallback={<Loader/>}>
            <ActivateAccount />
          </Suspense>
      ),
      errorElement: <ErrorPage />,
    },
    { path: "*", element: <NotFoundPage /> },
  ]);
  return <RouterProvider router={router} fallbackElement={<Loader />} />;
}

export default App
