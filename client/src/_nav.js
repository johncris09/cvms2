import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cibFoursquare,
  cilAnimal,
  cilApplicationsSettings,
  cilBarChart,
  cilCog,
  cilDog,
  cilEyedropper,
  cilFile,
  cilHome,
  cilLibraryBuilding,
  cilListRich,
  cilMagnifyingGlass,
  cilPeople,
  cilPlus,
  cilSchool,
  cilSpeedometer,
  cilUser,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = (userInfo) => {
  let items = []
  // Super Admin
  if (userInfo.role_type === 'Super Admin') {
    items = [
      {
        component: CNavItem,
        name: 'Dashboard',
        to: '/dashboard',
        icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      },
      {
        component: CNavGroup,
        name: 'Pet Registration',
        to: '/pet_registration',
        icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Pet Registration',
            to: '/pet_registration',
          },
          {
            component: CNavItem,
            name: 'Pet Owner',
            to: '/pet_owner',
          },
        ],
      },
      {
        component: CNavGroup,
        name: 'Manage Dog',
        to: '/manage_dog',
        icon: <CIcon icon={cilDog} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Dog Pound',
            to: '/manage_dog/dog_pound',
          },
          // {
          //   component: CNavItem,
          //   name: 'Adopt/Claim',
          //   to: '/manage_dog/adopt_claim',
          // },
          // {
          //   component: CNavItem,
          //   name: 'Disposed Dogs',
          //   to: '/manage_dog/disposed',
          // },
        ],
      },

      {
        component: CNavItem,
        name: 'Anti-Rabies Vaccination',
        to: '/anti_rabies_vaccination',
        icon: <CIcon icon={cilEyedropper} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'Deworming',
        to: '/deworming',
        icon: <CIcon icon={cilAnimal} customClassName="nav-icon" />,
      },
      {
        component: CNavTitle,
        name: 'Utilities',
      },
      {
        component: CNavGroup,
        name: 'Species',
        to: '/species',
        icon: <CIcon icon={cilListRich} customClassName="nav-icon" />,
        items: [
          {
            component: CNavItem,
            name: 'Anti Rabies',
            to: '/species/anti_rabies',
          },
          {
            component: CNavItem,
            name: 'Deworm',
            to: '/species/deworming',
          },
        ],
      },
      {
        component: CNavItem,
        name: 'Medication',
        to: '/medication',
        icon: <CIcon icon={cibFoursquare} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: 'User',
        to: '/user',
        icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
      },
    ]
  }
  return items
}

export default _nav
