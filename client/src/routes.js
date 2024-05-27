import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const User = React.lazy(() => import('./views/user/User'))
const Deworming = React.lazy(() => import('./views/deworming/Deworming'))
const AntiRabiesSpecies = React.lazy(() => import('./views/species/AntiRabiesSpecies'))
const DewormingSpecies = React.lazy(() => import('./views/species/DewormingSpecies'))
const Medication = React.lazy(() => import('./views/medication/Medication'))
const AntiRabiesVaccination = React.lazy(() =>
  import('./views/antirabiesvaccination/AntiRabiesVaccination'),
)

const DogPound = React.lazy(() => import('./views/dogpound/DogPound'))
const routes = [
  {
    path: '/dashboard',
    user: ['Super Admin'],
    name: 'Dashboard',
    element: Dashboard,
  },

  {
    path: '/manage_dog',
    user: ['Super Admin'],
    name: 'Manage Dog',
    element: DogPound,
    exact: true,
  },
  { path: '/manage_dog/dog_pound', user: ['Super Admin'], name: 'Dog Pound', element: DogPound },

  { path: '/deworming', user: ['Super Admin'], name: 'Deworming', element: Deworming },
  { path: '/medication', user: ['Super Admin'], name: 'Medication', element: Medication },
  {
    path: '/species/anti_rabies',
    user: ['Super Admin'],
    name: 'Anti Rabies Species',
    element: AntiRabiesSpecies,
  },
  {
    path: '/anti_rabies_vaccination',
    user: ['Super Admin'],
    name: 'Anti-Rabies Vaccination',
    element: AntiRabiesVaccination,
  },

  {
    path: '/species/deworming',
    user: ['Super Admin'],
    name: 'Deworming Species',
    element: DewormingSpecies,
  },
  { path: '/user', user: ['Super Admin'], name: 'User', element: User },
  // { path: '/home', user: ['azr14gGCV7hLW2ppQz2l'], exact: true, element: SchoolUserDashboard },

  // {
  //   path: '/status/:status',
  //   user: ['azr14gGCV7hLW2ppQz2l'],
  //   exact: true,
  //   name: 'Status',
  //   element: Status,
  // },
  // {
  //   path: '/applicant',
  //   user: ['4BSVYawhFI8j779vM8q1', 'KmOlD4kHZC93Yp8Jirhc'],
  //   name: 'Applicant',
  //   element: Applicant,
  // },
  // {
  //   path: '/registration',
  //   user: ['4BSVYawhFI8j779vM8q1', 'KmOlD4kHZC93Yp8Jirhc'],
  //   name: 'Registration',
  //   element: Registration,
  // },
  // {
  //   path: '/applicant/details/:id',
  //   user: ['4BSVYawhFI8j779vM8q1', 'KmOlD4kHZC93Yp8Jirhc'],
  //   name: 'Application Details',
  //   element: ApplicationDetails,
  // },
  // {
  //   path: '/search/:id',
  //   user: ['4BSVYawhFI8j779vM8q1', 'KmOlD4kHZC93Yp8Jirhc'],
  //   name: 'Search Result',
  //   element: SearchResult,
  // },
  // // { path: '/registration', name: 'Registration', element: Registration },
  // {
  //   path: '/sibling',
  //   user: ['4BSVYawhFI8j779vM8q1', 'KmOlD4kHZC93Yp8Jirhc'],
  //   name: 'Sibling(s)',
  //   element: Sibling,
  // },
  // {
  //   path: '/advance_search',
  //   user: ['4BSVYawhFI8j779vM8q1', 'KmOlD4kHZC93Yp8Jirhc', 'azr14gGCV7hLW2ppQz2l'],
  //   name: 'Advance Search',
  //   element: AdvanceSearch,
  // },
  // {
  //   path: '/manage',
  //   user: ['4BSVYawhFI8j779vM8q1', 'KmOlD4kHZC93Yp8Jirhc'],
  //   name: 'Manage',
  //   element: Approved,
  // },
  // {
  //   path: '/manage/approved',
  //   user: ['4BSVYawhFI8j779vM8q1', 'KmOlD4kHZC93Yp8Jirhc'],
  //   name: 'Approved',
  //   element: Approved,
  // },
  // {
  //   path: '/manage/pending',
  //   user: ['4BSVYawhFI8j779vM8q1', 'KmOlD4kHZC93Yp8Jirhc'],
  //   name: 'Pending',
  //   element: Pending,
  // },
  // {
  //   path: '/manage/disapproved',
  //   user: ['4BSVYawhFI8j779vM8q1', 'KmOlD4kHZC93Yp8Jirhc'],
  //   name: 'Disapproved',
  //   element: Disapproved,
  // },
  // {
  //   path: '/manage/archived',
  //   user: ['4BSVYawhFI8j779vM8q1', 'KmOlD4kHZC93Yp8Jirhc'],
  //   name: 'Archived',
  //   element: Archived,
  // },
  // {
  //   path: '/manage/void',
  //   user: ['4BSVYawhFI8j779vM8q1', 'KmOlD4kHZC93Yp8Jirhc'],
  //   name: 'Void',
  //   element: Void,
  // },

  // {
  //   path: '/generate_report',
  //   user: ['4BSVYawhFI8j779vM8q1', 'KmOlD4kHZC93Yp8Jirhc'],
  //   name: 'Generate Report',
  //   element: GenerateReport,
  // },

  // {
  //   path: '/school',
  //   user: ['4BSVYawhFI8j779vM8q1'],
  //   name: 'School',
  //   element: SeniorHighSchool,
  //   exact: true,
  // },
  // {
  //   path: '/school/senior_high',
  //   user: ['4BSVYawhFI8j779vM8q1'],
  //   name: 'Senior High School',
  //   element: SeniorHighSchool,
  // },
  // {
  //   path: '/school/college',
  //   user: ['4BSVYawhFI8j779vM8q1'],
  //   name: 'College School',
  //   element: CollegeSchool,
  // },
  // {
  //   path: '/school/tvet',
  //   user: ['4BSVYawhFI8j779vM8q1'],
  //   name: 'TVET School',
  //   element: TvetSchool,
  // },

  // { path: '/manage', user: ['4BSVYawhFI8j779vM8q1'], name: 'Manage', element: Strand, exact: true },
  // { path: '/manage/strand', user: ['4BSVYawhFI8j779vM8q1'], name: 'Strand', element: Strand },
  // {
  //   path: '/manage/course',
  //   user: ['4BSVYawhFI8j779vM8q1'],
  //   name: 'College Course',
  //   element: Course,
  // },
  // {
  //   path: '/manage/tvet_course',
  //   user: ['4BSVYawhFI8j779vM8q1'],
  //   name: 'TVET Course',
  //   element: TvetCourse,
  // },
  // { path: '/user', user: ['4BSVYawhFI8j779vM8q1'], name: 'User', element: User },
  // { path: '/profile', user: ['4BSVYawhFI8j779vM8q1'], name: 'Profile', element: Profile },
  // {
  //   path: '/system_sequence',
  //   user: ['4BSVYawhFI8j779vM8q1'],
  //   name: 'System Sequence',
  //   element: SystemSequence,
  // },
  // {
  //   path: '/configuration',
  //   user: ['4BSVYawhFI8j779vM8q1'],
  //   name: 'System Configuration',
  //   element: Config,
  //   exact: true,
  // },
  // {
  //   path: '/configuration/config',
  //   user: ['4BSVYawhFI8j779vM8q1'],
  //   name: 'Current List View',
  //   element: Config,
  // },
  // {
  //   path: '/configuration/system_sequence',
  //   user: ['4BSVYawhFI8j779vM8q1'],
  //   name: 'System Sequence',
  //   element: SystemSequence,
  // },
]

export default routes
