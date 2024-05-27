import React from 'react'
import { ExportToCsv } from 'export-to-csv'
import CryptoJS from 'crypto-js'
import { MagnifyingGlass, Oval, RotatingLines } from 'react-loader-spinner'
import Swal from 'sweetalert2'
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js'
import { Box } from '@mui/material'
import axios from 'axios'

const isProduction = false

const api = axios.create({
  baseURL: isProduction
    ? process.env.REACT_APP_BASEURL_PRODUCTION
    : process.env.REACT_APP_BASEURL_DEVELOPMENT,

  auth: {
    username: process.env.REACT_APP_USERNAME,
    password: process.env.REACT_APP_PASSWORD,
  },
})

const currentYear = new Date().getFullYear()
const lastYear = 2017
const SchoolYear = []

const Address = [
  'Apil',
  'Binuangan',
  'Bolibol',
  'Buenavista',
  'Bunga',
  'Buntawan',
  'Burgos',
  'Canubay',
  'Ciriaco Pastrano',
  'Clarin Settlement',
  'Dolipos Alto',
  'Dolipos Bajo',
  'Dulapo',
  'Dullan Norte',
  'Dullan Sur',
  'Layawan',
  'Lower Lamac',
  'Lower Langcangan',
  'Lower Loboc',
  'Lower Rizal',
  'Malindang',
  'Mialen',
  'Mobod',
  'Paypayan',
  'Pines',
  'Poblacion 1',
  'Poblacion 2',
  'Proper Langcangan',
  'San Vicente Alto',
  'San Vicente Bajo',
  'Sebucal',
  'Senote',
  'Taboc Norte',
  'Taboc Sur',
  'Talairon',
  'Talic',
  'Tipan',
  'Toliyok',
  'Tuyabang Alto',
  'Tuyabang Bajo',
  'Tuyabang Proper',
  'Upper Lamac',
  'Upper Langcangan',
  'Upper Loboc',
  'Upper Rizal',
  'Victoria',
  'Villaflor',
]

const CivilStatus = ['Single', 'Married', 'Widowed']

const Sex = ['Male', 'Female']

const GradeLevel = ['Grade 11', 'Grade 12']
const YearLevel = ['I', 'II', 'III', 'IV', 'V']
const Semester = ['1st', '2nd']

for (let year = currentYear; year >= lastYear; year--) {
  SchoolYear.push('SY: ' + year + '-' + (year + 1))
}

const Manager = ['Active', 'Inactive']
const ApprovedType = [
  'Approved',
  'Additional Approved',
  'Additional Approved 1',
  'Additional Approved 2',
  'Additional Approved 3',
  'Additional Approved 4',
  'Additional Approved 5',
  'Additional Approved 6',
]

const StatusType = [
  'Pending',
  'Approved',
  'Additional Approved',
  'Additional Approved 1',
  'Additional Approved 2',
  'Additional Approved 3',
  'Additional Approved 4',
  'Additional Approved 5',
  'Additional Approved 6',
  'Disapproved',
  'Void',
  'Archived',
]

const seniorHighDefaultColumn = [
  {
    accessorKey: 'id',
    header: 'Application #',
    includeInExport: true,
    accessorFn: (row) => `${row.app_year_number}-${row.app_sem_number}-${row.app_id_number}`,
  },
  {
    accessorKey: 'photo',
    header: 'Photo',
    size: 120,
    includeInExport: false,
    Cell: ({ row }) => {
      let photo = row.original.photo || 'defaultAvatar.png' // Assuming "defaultAvatar.png" is a string
      return (
        <Box
          className="text-right"
          md={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end', // Align to the right
            gap: '1rem',
          }}
        >
          <img
            alt="Profile Photo"
            height={25}
            src={
              isProduction
                ? `${process.env.REACT_APP_BASEURL_PRODUCTION}assets/image/scholarship/${photo}`
                : `${process.env.REACT_APP_BASEURL_DEVELOPMENT}assets/image/scholarship/${photo}`
            }
            loading="lazy"
            style={{ borderRadius: '50%' }}
          />
        </Box>
      )
    },
  },
  {
    accessorKey: 'lastname',
    header: 'Last Name',
    includeInExport: true,
    accessorFn: (row) => `${toSentenceCase(row.lastname)}`,
  },
  {
    accessorKey: 'firstname',
    header: 'First Name',
    includeInExport: true,
    accessorFn: (row) => `${toSentenceCase(row.firstname)}`,
  },
  {
    accessorKey: 'middlename',
    header: 'Middle Name',
    includeInExport: true,
    accessorFn: (row) => `${toSentenceCase(row.middlename)}`,
  },
  {
    accessorKey: 'contact_number',
    header: 'Contact #',
    includeInExport: true,
  },
  {
    accessorKey: 'address',
    header: 'Address',
    accessorFn: (row) => `${toSentenceCase(row.address)}`,
    includeInExport: true,
  },
  {
    accessorKey: 'sex',
    header: 'Gender',
    includeInExport: true,
  },
  {
    accessorKey: 'school',
    header: 'School',
    includeInExport: true,
  },
  {
    accessorKey: 'strand',
    header: 'Strand',
    includeInExport: true,
  },
  {
    accessorKey: 'school_year',
    header: 'School Year',
    includeInExport: true,
  },
  {
    accessorKey: 'semester',
    header: 'Semester',
    includeInExport: true,
  },
  {
    accessorKey: 'app_status',
    header: 'Application Status',
    includeInExport: true,
  },
  {
    accessorKey: 'availment',
    header: 'Availment',
    includeInExport: true,
  },
  {
    accessorKey: 'grade_level',
    header: 'Grade Level',
    includeInExport: true,
  },
  {
    accessorKey: 'reason',
    header: 'Note(s)',
    includeInExport: false,
    accessorFn: (row) => {
      const contentStateString = row.reason

      if (contentStateString === null) {
        return '' // Return empty string if content state is null
      } else {
        const contentState = convertFromRaw(JSON.parse(contentStateString))
        const plainText = contentState
          .getBlocksAsArray()
          .map((block) => block.getText())
          .join('\n')
        return plainText
      }
    },
  },
  {
    accessorKey: 'fourps_beneficiary',
    header: "4'ps Beneficiary",
    accessorFn: (row) => (parseInt(row.fourps_beneficiary) === 1 ? 'Yes' : 'No'),
    includeInExport: true,
  },
]

const collegeDefaultColumn = [
  {
    accessorKey: 'id',
    header: 'Application #',
    accessorFn: (row) => `${row.app_year_number}-${row.app_sem_number}-${row.app_id_number}`,
    includeInExport: true,
  },
  {
    accessorKey: 'photo',
    header: 'Photo',
    size: 120,
    includeInExport: false,
    Cell: ({ row }) => {
      let photo = row.original.photo || 'defaultAvatar.png' // Assuming "defaultAvatar.png" is a string
      return (
        <Box
          className="text-right"
          md={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end', // Align to the right
            gap: '1rem',
          }}
        >
          <img
            alt="Profile Photo"
            height={25}
            src={
              isProduction
                ? `${process.env.REACT_APP_BASEURL_PRODUCTION}assets/image/scholarship/${photo}`
                : `${process.env.REACT_APP_BASEURL_DEVELOPMENT}assets/image/scholarship/${photo}`
            }
            loading="lazy"
            style={{ borderRadius: '50%' }}
          />
        </Box>
      )
    },
  },
  {
    accessorKey: 'lastname',
    header: 'Last Name',
    accessorFn: (row) => `${toSentenceCase(row.lastname)}`,
    includeInExport: true,
  },
  {
    accessorKey: 'firstname',
    header: 'First Name',
    accessorFn: (row) => `${toSentenceCase(row.firstname)}`,
    includeInExport: true,
  },
  {
    accessorKey: 'middlename',
    header: 'Middle Name',
    accessorFn: (row) => `${toSentenceCase(row.middlename)}`,
    includeInExport: true,
  },
  {
    accessorKey: 'contact_number',
    header: 'Contact #',
  },
  {
    accessorKey: 'address',
    header: 'Address',
    accessorFn: (row) => `${toSentenceCase(row.address)}`,
    includeInExport: true,
  },
  {
    accessorKey: 'sex',
    header: 'Gender',
    includeInExport: true,
  },
  {
    accessorKey: 'school',
    header: 'School',
    includeInExport: true,
  },
  {
    accessorKey: 'course',
    header: 'Course',
    includeInExport: true,
  },
  {
    accessorKey: 'unit',
    header: 'Unit',
    includeInExport: true,
  },
  {
    accessorKey: 'school_year',
    header: 'School Year',
    includeInExport: true,
  },
  {
    accessorKey: 'semester',
    header: 'Semester',
    includeInExport: true,
  },
  {
    accessorKey: 'app_status',
    header: 'Application Status',
    includeInExport: true,
  },
  {
    accessorKey: 'availment',
    header: 'Availment',
    includeInExport: true,
  },
  {
    accessorKey: 'year_level',
    header: 'Year Level',
    includeInExport: true,
  },
  {
    accessorKey: 'reason',
    header: 'Note(s)',
    accessorFn: (row) => {
      const contentStateString = row.reason

      if (contentStateString === null) {
        return '' // Return empty string if content state is null
      } else {
        const contentState = convertFromRaw(JSON.parse(contentStateString))
        const plainText = contentState
          .getBlocksAsArray()
          .map((block) => block.getText())
          .join('\n')
        return plainText
      }
    },
    includeInExport: false,
  },
  {
    accessorKey: 'fourps_beneficiary',
    header: "4'ps Beneficiary",
    accessorFn: (row) => (parseInt(row.fourps_beneficiary) === 1 ? 'Yes' : 'No'),
    includeInExport: true,
  },
]

const tvetDefaultColumn = [
  {
    accessorKey: 'app_id_number',
    header: 'Application #',
    accessorFn: (row) => `${row.app_year_number}-${row.app_sem_number}-${row.app_id_number}`,
    includeInExport: true,
  },
  {
    accessorKey: 'photo',
    header: 'Photo',
    size: 120,
    includeInExport: false,
    Cell: ({ row }) => {
      let photo = row.original.photo || 'defaultAvatar.png' // Assuming "defaultAvatar.png" is a string
      return (
        <Box
          className="text-right"
          md={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end', // Align to the right
            gap: '1rem',
          }}
        >
          <img
            alt="Profile Photo"
            height={25}
            src={
              isProduction
                ? `${process.env.REACT_APP_BASEURL_PRODUCTION}assets/image/scholarship/${photo}`
                : `${process.env.REACT_APP_BASEURL_DEVELOPMENT}assets/image/scholarship/${photo}`
            }
            loading="lazy"
            style={{ borderRadius: '50%' }}
          />
        </Box>
      )
    },
  },
  {
    accessorKey: 'lastname',
    header: 'Last Name',
    accessorFn: (row) => `${toSentenceCase(row.lastname)}`,
    includeInExport: true,
  },
  {
    accessorKey: 'firstname',
    header: 'First Name',
    accessorFn: (row) => `${toSentenceCase(row.firstname)}`,
    includeInExport: true,
  },
  {
    accessorKey: 'middlename',
    header: 'Middle Name',
    accessorFn: (row) => `${toSentenceCase(row.middlename)}`,
    includeInExport: true,
  },
  {
    accessorKey: 'contact_number',
    header: 'Contact #',
    includeInExport: true,
  },
  {
    accessorKey: 'address',
    header: 'Address',
    accessorFn: (row) => `${toSentenceCase(row.address)}`,
    includeInExport: true,
  },
  {
    accessorKey: 'sex',
    header: 'Gender',
    includeInExport: true,
  },
  {
    accessorKey: 'school',
    header: 'School',
    includeInExport: true,
  },
  {
    accessorKey: 'course',
    header: 'Course',
    includeInExport: true,
  },
  {
    accessorKey: 'unit',
    header: '# of Days',
    includeInExport: true,
  },
  {
    accessorKey: 'school_year',
    header: 'School Year',
    includeInExport: true,
  },
  {
    accessorKey: 'semester',
    header: 'Semester',
    includeInExport: true,
  },
  {
    accessorKey: 'app_status',
    header: 'Application Status',
    includeInExport: true,
  },
  {
    accessorKey: 'availment',
    header: 'Availment',
    includeInExport: true,
  },
  {
    accessorKey: 'reason',
    header: 'Note(s)',
    accessorFn: (row) => {
      const contentStateString = row.reason

      if (contentStateString === null) {
        return '' // Return empty string if content state is null
      } else {
        const contentState = convertFromRaw(JSON.parse(contentStateString))
        const plainText = contentState
          .getBlocksAsArray()
          .map((block) => block.getText())
          .join('\n')
        return plainText
      }
    },
    includeInExport: false,
  },
  {
    accessorKey: 'fourps_beneficiary',
    header: "4'ps Beneficiary",
    accessorFn: (row) => (parseInt(row.fourps_beneficiary) === 1 ? 'Yes' : 'No'),
    includeInExport: true,
  },
]
const commiteeChairperson = 'MARK ANTHONY D. ARTIGAS'
const cityMayor = 'LEMUEL MEYRICK M. ACOSTA'

const csvOptions = (column) => {
  return {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: column.map((c) => c.header),
  }
}

const handleExportSeniorHighRows = (rows) => {
  const csvExporter = new ExportToCsv(csvOptions(seniorHighDefaultColumn))

  const exportedData = rows
    .map((row) => row.original)
    .map((item) => {
      return {
        'Application #': `${item.app_year_number}-${item.app_sem_number}-${item.app_id_number}`,
        'First Name': toSentenceCase(item.firstname),
        'Last Name': toSentenceCase(item.lastname),
        'Middle Name': toSentenceCase(item.middlename),
        Address: toSentenceCase(item.address),
        'Contact #': item.contact_number,
        Gender: item.sex,
        School: item.school,
        Strand: item.strand,
        'School Year': item.school_year,
        Semester: item.semester,
        'Application Status': item.app_status,
        Availment: item.availment,
        'Grade Level': item.grade_level,
      }
    })

  csvExporter.generateCsv(exportedData)
}

const handleExportSeniorHighData = (data) => {
  const csvExporter = new ExportToCsv(csvOptions(seniorHighDefaultColumn))

  const exportedData = data.map((item) => {
    return {
      'Application #': `${item.app_year_number}-${item.app_sem_number}-${item.app_id_number}`,
      'First Name': toSentenceCase(item.firstname),
      'Last Name': toSentenceCase(item.lastname),
      'Middle Name': toSentenceCase(item.middlename),
      Address: toSentenceCase(item.address),
      'Contact #': item.contact_number,
      Gender: item.sex,
      School: item.school,
      Strand: item.strand,
      'School Year': item.school_year,
      Semester: item.semester,
      'Application Status': item.app_status,
      Availment: item.availment,
      'Grade Level': item.grade_level,
    }
  })

  csvExporter.generateCsv(exportedData)
}

const handleExportCollegeRows = (rows) => {
  const csvExporter = new ExportToCsv(csvOptions(collegeDefaultColumn))

  const exportedData = rows
    .map((row) => row.original)
    .map((item) => {
      return {
        'Application #': `${item.app_year_number}-${item.app_sem_number}-${item.app_id_number}`,
        'First Name': toSentenceCase(item.firstname),
        'Last Name': toSentenceCase(item.lastname),
        'Middle Name': toSentenceCase(item.middlename),
        Address: toSentenceCase(item.address),
        'Contact #': item.contact_number,
        Gender: item.sex,
        School: item.school,
        Course: item.course,
        'School Year': item.school_year,
        Semester: item.semester,
        'Application Status': item.app_status,
        Availment: item.availment,
        'Year Level': item.year_level,
      }
    })

  csvExporter.generateCsv(exportedData)
}

const handleExportCollegeData = (data) => {
  const csvExporter = new ExportToCsv(csvOptions(collegeDefaultColumn))

  const exportedData = data.map((item) => {
    return {
      'Application #': `${item.app_year_number}-${item.app_sem_number}-${item.app_id_number}`,
      'First Name': toSentenceCase(item.firstname),
      'Last Name': toSentenceCase(item.lastname),
      'Middle Name': toSentenceCase(item.middlename),
      Address: toSentenceCase(item.address),
      'Contact #': item.contact_number,
      Gender: item.sex,
      School: item.school,
      Course: item.course,
      'School Year': item.school_year,
      Semester: item.semester,
      'Application Status': item.app_status,
      Availment: item.availment,
      'Year Level': item.year_level,
    }
  })

  csvExporter.generateCsv(exportedData)
}
const handleExportTvetRows = (rows) => {
  const csvExporter = new ExportToCsv(csvOptions(tvetDefaultColumn))

  const exportedData = rows
    .map((row) => row.original)
    .map((item) => {
      return {
        'Application #': `${item.app_year_number}-${item.app_sem_number}-${item.app_id_number}`,
        'First Name': toSentenceCase(item.firstname),
        'Last Name': toSentenceCase(item.lastname),
        'Middle Name': toSentenceCase(item.middlename),
        Address: toSentenceCase(item.address),
        'Contact #': item.contact_number,
        Gender: item.sex,
        School: item.school,
        Course: item.course,
        'School Year': item.school_year,
        Semester: item.semester,
        'Application Status': item.app_status,
        Availment: item.availment,
        'Year Level': item.year_level,
      }
    })

  csvExporter.generateCsv(exportedData)
}

const handleExportTvetData = (data) => {
  const csvExporter = new ExportToCsv(csvOptions(tvetDefaultColumn))

  const exportedData = data.map((item) => {
    return {
      'Application #': `${item.app_year_number}-${item.app_sem_number}-${item.app_id_number}`,
      'First Name': toSentenceCase(item.firstname),
      'Last Name': toSentenceCase(item.lastname),
      'Middle Name': toSentenceCase(item.middlename),
      Address: toSentenceCase(item.address),
      'Contact #': item.contact_number,
      Gender: item.sex,
      School: item.school,
      Course: item.course,
      'School Year': item.school_year,
      Semester: item.semester,
      'Application Status': item.app_status,
      Availment: item.availment,
      'Year Level': item.year_level,
    }
  })

  csvExporter.generateCsv(exportedData)
}

const asterisk = () => {
  return <span className="text-danger">*</span>
}

const CryptoJSAesJson = {
  stringify: function (cipherParams) {
    var j = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64) }
    if (cipherParams.iv) j.iv = cipherParams.iv.toString()
    if (cipherParams.salt) j.s = cipherParams.salt.toString()
    return JSON.stringify(j)
  },
  parse: function (jsonStr) {
    var j = JSON.parse(jsonStr)
    var cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(j.ct),
    })
    if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv)
    if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s)
    return cipherParams
  },
}

const decrypted = (data) => {
  const decryptedData = JSON.parse(
    CryptoJS.AES.decrypt(data, process.env.REACT_APP_ENCRYPTION_KEY, {
      format: CryptoJSAesJson,
    }).toString(CryptoJS.enc.Utf8),
  )

  return JSON.parse(decryptedData)
}
const encrypt = (data) => {
  var encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), process.env.REACT_APP_ENCRYPTION_KEY, {
    format: CryptoJSAesJson,
  }).toString()

  return encrypted
}

const toSentenceCase = (value) => {
  try {
    return value
      .toLowerCase()
      .split(' ')
      .map((value) => value.charAt(0).toUpperCase() + value.slice(1))
      .join(' ')
  } catch (error) {
    return value
  }
}

const getFirstLetters = (value) => {
  const words = value.split(' ').map((word) => word.charAt(0).toUpperCase())
  return words.join('')
}

const formatFileSize = (size) => {
  if (size === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = parseInt(Math.floor(Math.log(size) / Math.log(k)))
  return Math.round(100 * (size / Math.pow(k, i))) / 100 + ' ' + sizes[i]
}

const calculateAge = (value) => {
  try {
    const birthDate = new Date(value)
    const currentDate = new Date()

    const ageInMilliseconds = currentDate - birthDate
    const ageInYears = Math.floor(ageInMilliseconds / (365.25 * 24 * 60 * 60 * 1000))
    return ageInYears
  } catch (error) {
    return value
  }
}

const handleError = (error) => {
  let errorMessage

  switch (error.code) {
    case 'ERR_BAD_REQUEST':
      errorMessage = 'Resource not found. Please check the URL!'
      break
    case 'ERR_BAD_RESPONSE':
      errorMessage = 'Internal Server Error. Please try again later.'
      break
    case 'ERR_NETWORK':
      errorMessage = 'Please check your internet connection and try again!'
      break
    case 'ECONNABORTED':
      errorMessage = 'The request timed out. Please try again later.'
      break
    case 'ERR_SERVER':
      if (error.response) {
        if (error.response.status === 500) {
          errorMessage = 'Internal Server Error. Please try again later.'
        } else if (error.response.status === 404) {
          errorMessage = 'Resource not found. Please check the URL.'
        } else if (error.response.status === 403) {
          errorMessage = 'Access forbidden. Please check your permissions.'
        } else {
          errorMessage = `Unexpected server error: ${error.response.status}`
        }
      } else {
        errorMessage = 'An unexpected error occurred. Please try again.'
      }
      break
    case 'ERR_CLIENT':
      if (error.response && error.response.status === 400) {
        errorMessage = 'Bad request. Please check your input.'
      } else if (error.response && error.response.status === 401) {
        errorMessage = 'Unauthorized. Please check your credentials.'
      } else if (error.response && error.response.status === 429) {
        errorMessage = 'Too many requests. Please try again later.'
      } else {
        errorMessage = 'Client error. Please check your request.'
      }
      break
    default:
      console.error('An error occurred:', error)
      errorMessage = 'An unexpected error occurred. Please try again.'
      break
  }

  return errorMessage
}

const DefaultLoading = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.07)', // Adjust the background color and opacity as needed
        zIndex: 999, // Ensure the backdrop is above other content
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Oval
        height={40}
        width={40}
        color="#34aadc"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#34aadc"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  )
}

const MagnifyingGlassLoading = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.07)', // Adjust the background color and opacity as needed
        zIndex: 999, // Ensure the backdrop is above other content
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <MagnifyingGlass
        visible={true}
        height={80}
        width={80}
        ariaLabel="magnifying-glass-loading"
        wrapperStyle={{}}
        wrapperClass="magnifying-glass-wrapper"
        glassColor="#c0efff"
        color="#321fdb"
      />
    </div>
  )
}

const WidgetLoading = () => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.001)', // Adjust the background color and opacity as needed
        zIndex: 999, // Ensure the backdrop is above other content
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Oval
        height={30}
        width={30}
        color="#34aadc"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#34aadc"
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  )
}

const WholePageLoading = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.07)', // Adjust the background color and opacity as needed
        zIndex: 999, // Ensure the backdrop is above other content
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div>
        <RotatingLines
          visible={true}
          color="#34aadc"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
          height={40}
          width={40}
          strokeWidthSecondary={2}
        />
        <p style={{ marginLeft: '-20px', fontSize: '16px' }}>Please wait...</p>
      </div>
    </div>
  )
}

const RequiredFieldNote = (label) => {
  return (
    <>
      <div>
        <small className="text-muted">
          Note: <span className="text-danger">*</span> is required
        </small>
      </div>
    </>
  )
}
const requiredField = (label) => {
  return (
    <>
      <span>
        {label} <span className="text-danger">*</span>
      </span>
    </>
  )
}

const validationPrompt = (operationCallback) => {
  try {
    Swal.fire({
      title: 'Please enter the secret key to proceed.',
      input: 'password',
      icon: 'info',
      customClass: {
        validationMessage: 'my-validation-message',
        alignment: 'text-center',
      },
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage('This field is required')
        }
      },
      showCancelButton: true,
      confirmButtonText: 'Ok',
    }).then(async function (result) {
      if (result.isConfirmed) {
        if (result.value === process.env.REACT_APP_STATUS_APPROVED_KEY) {
          operationCallback()
        } else {
          Swal.fire({
            title: 'Error!',
            html: 'Invalid Secret Key',
            icon: 'error',
          })
        }
      }
    })
  } catch (error) {
    return false
  }
}

const workStatus = (status) => {
  if (status === 'Done') {
    return <h2 className="text-primary">{status}</h2>
  } else if (status === 'Pending') {
    return <h2 className="text-danger">{status}</h2>
  } else {
    return <h2 className="text-success">{status}</h2>
  }
}

const roleType = [
  { value: '4BSVYawhFI8j779vM8q1', label: 'Administrator' },
  { value: 'KmOlD4kHZC93Yp8Jirhc', label: 'Encoder' },
  { value: 'azr14gGCV7hLW2ppQz2l', label: 'User' },
]

export {
  roleType,
  getFirstLetters,
  workStatus,
  validationPrompt,
  requiredField,
  RequiredFieldNote,
  DefaultLoading,
  MagnifyingGlassLoading,
  WidgetLoading,
  WholePageLoading,
  handleError,
  calculateAge,
  formatFileSize,
  toSentenceCase,
  decrypted,
  encrypt,
  asterisk,
  handleExportSeniorHighData,
  handleExportSeniorHighRows,
  handleExportCollegeData,
  handleExportCollegeRows,
  handleExportTvetData,
  handleExportTvetRows,
  api,
  Address,
  CivilStatus,
  Sex,
  GradeLevel,
  Semester,
  SchoolYear,
  YearLevel,
  Manager,
  ApprovedType,
  StatusType,
  seniorHighDefaultColumn,
  collegeDefaultColumn,
  tvetDefaultColumn,
  commiteeChairperson,
  cityMayor,
}
