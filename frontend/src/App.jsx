import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import LoadingSpinner from './components/shared/LoadingSpinner'
import PerformanceMonitor from './components/shared/PerformanceMonitor'

// Lazy load components for better performance
const Navbar = lazy(() => import('./components/shared/Navbar'))
const Login = lazy(() => import('./components/auth/Login'))
const Signup = lazy(() => import('./components/auth/Signup'))
const Home = lazy(() => import('./components/Home'))
const Jobs = lazy(() => import('./components/Jobs'))
const Browse = lazy(() => import('./components/Browse'))
const Profile = lazy(() => import('./components/Profile'))
const JobDescription = lazy(() => import('./components/JobDescription'))
const Companies = lazy(() => import('./components/admin/Companies'))
const CompanyCreate = lazy(() => import('./components/admin/CompanyCreate'))
const CompanySetup = lazy(() => import('./components/admin/CompanySetup'))
const AdminJobs = lazy(() => import('./components/admin/AdminJobs'))
const PostJob = lazy(() => import('./components/admin/PostJob'))
const Applicants = lazy(() => import('./components/admin/Applicants'))
const ProtectedRoute = lazy(() => import('./components/admin/ProtectedRoute'))

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <LoadingSpinner size="lg" />
  </div>
)

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<PageLoader />}>
        <Home />
      </Suspense>
    )
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<PageLoader />}>
        <Login />
      </Suspense>
    )
  },
  {
    path: '/signup',
    element: (
      <Suspense fallback={<PageLoader />}>
        <Signup />
      </Suspense>
    )
  },
  {
    path: "/jobs",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Jobs />
      </Suspense>
    )
  },
  {
    path: "/description/:id",
    element: (
      <Suspense fallback={<PageLoader />}>
        <JobDescription />
      </Suspense>
    )
  },
  {
    path: "/browse",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Browse />
      </Suspense>
    )
  },
  {
    path: "/profile",
    element: (
      <Suspense fallback={<PageLoader />}>
        <Profile />
      </Suspense>
    )
  },
  // Admin routes with lazy loading
  {
    path:"/admin/companies",
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProtectedRoute><Companies/></ProtectedRoute>
      </Suspense>
    )
  },
  {
    path:"/admin/companies/create",
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProtectedRoute><CompanyCreate/></ProtectedRoute>
      </Suspense>
    )
  },
  {
    path:"/admin/companies/:id",
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProtectedRoute><CompanySetup/></ProtectedRoute>
      </Suspense>
    )
  },
  {
    path:"/admin/jobs",
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProtectedRoute><AdminJobs/></ProtectedRoute>
      </Suspense>
    )
  },
  {
    path:"/admin/jobs/create",
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProtectedRoute><PostJob/></ProtectedRoute>
      </Suspense>
    )
  },
  {
    path:"/admin/jobs/:id/applicants",
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProtectedRoute><Applicants/></ProtectedRoute>
      </Suspense>
    )
  },
])

function App() {
  return (
    <div>
      <RouterProvider router={appRouter} />
      <PerformanceMonitor />
    </div>
  )
}

export default App
