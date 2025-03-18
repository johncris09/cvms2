import React, { useState, useRef, useEffect } from 'react'
import Select from 'react-select'
import './../../assets/css/react-paginate.css'
import Swal from 'sweetalert2'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormText,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
} from '@coreui/react'
import { ExportToCsv } from 'export-to-csv'
import MaterialReactTable from 'material-react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel, faPlus, faRefresh } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify'
import { Box, IconButton, Skeleton, Tooltip } from '@mui/material'
import { DeleteOutline, EditSharp } from '@mui/icons-material'
import {
  DefaultLoading,
  RequiredFieldNote,
  api,
  currentYear,
  requiredField,
  validationPrompt,
} from 'src/components/SystemConfiguration'
import * as Yup from 'yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'

const PetRegistration = ({ cardTitle }) => {
  const queryClient = useQueryClient()
  const selectPetOwnerInputRef = useRef()
  const [modalVisible, setModalVisible] = useState(false)
  const [user, setUser] = useState([])
  const [edit, setEdit] = useState(false)

  useEffect(() => {
    setUser(jwtDecode(localStorage.getItem('cvmsToken')))
  }, [])

  const applicationNumber = useQuery({
    queryFn: async () =>
      await api.get('pet_registration/get_latest_registration_number').then((response) => {
        form.setFieldValue('application_number', response.data)
        return response.data
      }),
    queryKey: ['applicationNumber'],
    staleTime: Infinity,
    refetchInterval: edit ? false : 1000,
  })

  const column = [
    {
      accessorKey: 'application_number',
      header: 'Application #',
      accessorFn: (row) => {
        const applicationNumber = row.application_number || 0 // Fallback to 0 if null or undefined
        return `${row.application_year || 'N/A'} - ${applicationNumber.toString().padStart(5, '0')}`
      },
    },
    {
      accessorKey: 'registration_date',
      header: 'Registration Date',
    },
    {
      accessorKey: 'owner_full_name',
      header: 'Pet Owner',
    },
    {
      accessorKey: 'pet_name',
      header: "Pet's Name",
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
    },
    {
      accessorKey: 'reproductive_status',
      header: 'Reproductive Status',
    },
    {
      accessorKey: 'breed',
      header: 'Breed',
    },
    {
      accessorKey: 'birthdate',
      header: 'Birthdate',
    },
    {
      accessorKey: 'species',
      header: 'Species',
    },
    {
      accessorKey: 'color',
      header: 'Color',
    },
    {
      accessorKey: 'origin',
      header: 'Pet Origin',
    },
    {
      accessorKey: 'habitat',
      header: 'Habitat',
    },
    {
      accessorKey: 'or_number',
      header: 'OR #',
    },
  ]

  const petRegistration = useQuery({
    queryFn: async () =>
      await api.get('pet_registration').then((response) => {
        return response.data
      }),
    queryKey: ['petRegistration'],
    staleTime: Infinity,
  })

  const validationSchema = Yup.object().shape({
    registration_date: Yup.string().required('Date Registration is required'),
    pet_owner: Yup.string().required('Pet Owner is required'),
    pet_name: Yup.string().required("Pet's Name is required"),
    gender: Yup.string().required('Gender is required'),
    reproductive_status: Yup.string().required('Reproductive Status is required'),
    breed: Yup.string().required('Breed is required'),
    birthdate: Yup.string().required('Birthdate is required'),
    species: Yup.string().required('Species is required'),
    color: Yup.string().required('Color/Marking(s) is required'),
    pet_origin: Yup.string().required('Pet Origin is required'),
    pet_origin_text: Yup.string().required('Pet Origin is required'),
    habitat: Yup.array().min(1, 'At least one habitat is required').required('Habitat is required'),
  })
  const form = useFormik({
    initialValues: {
      id: '',
      application_year: currentYear,
      application_number: '',
      registration_date: '',
      pet_owner: '',
      pet_name: '',
      gender: '',
      reproductive_status: '',
      breed: '',
      birthdate: '',
      or_number: '',
      species: '',
      color: '',
      pet_origin: '',
      pet_origin_text: '',
      habitat: [],
      habitat_other: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Filter out 'Others' from habitat and store it in habitat_text if there's a value in habitat_other
      let habitat = values.habitat.filter((item) => item !== 'Others')
      let habitat_text = values.habitat_other ? [values.habitat_other] : []

      // Merging habitat and habitat_text
      let mergedValues = [...habitat, ...habitat_text]

      const formattedValue = { ...values, habitat: mergedValues }

      if (values.id) {
        await updatePetRegistration.mutate(formattedValue)
      } else {
        await insertPetRegistration.mutate(formattedValue)
      }
    },
  })

  const insertPetRegistration = useMutation({
    mutationKey: ['insertPetRegistration'],
    mutationFn: async (values) => {
      return await api.post('pet_registration/insert', values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
        form.resetForm()
        selectPetOwnerInputRef.current.clearValue()
        await queryClient.invalidateQueries({ queryKey: ['petRegistration'] })
      } else {
        toast.error(response.data.message)
      }
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const updatePetRegistration = useMutation({
    mutationFn: async (values) => {
      return await api.put('pet_registration/update/' + values.id, values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
        form.resetForm()
        selectPetOwnerInputRef.current.clearValue()
        setModalVisible(false)
        await queryClient.invalidateQueries({ queryKey: ['petRegistration'] })
      } else {
        toast.error(response.data.message)
      }
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target
    const { habitat } = form.values

    form.setFieldValue(name, value)
    // Pet Origin
    if (name === 'pet_origin') {
      if (value === 'Local') {
        form.setFieldValue('pet_origin_text', 'Local')
      } else {
        form.setFieldValue('pet_origin_text', '')
      }
    }
    // Pet Origin
    if (name === 'habitat') {
      if (checked) {
        // Add value to array if checked
        form.setFieldValue('habitat', [...habitat, value])
      } else {
        // Remove value from array if unchecked
        form.setFieldValue(
          'habitat',
          habitat.filter((h) => h !== value),
        )
      }
    }
  }

  const csvOptions = {
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true,
    useBom: true,
    useKeysAsHeaders: false,
    headers: column.map((c) => c.header),
  }

  const csvExporter = new ExportToCsv(csvOptions)

  const handleExportRows = (rows) => {
    const exportedData = rows
      .map((row) => row.original)
      .map((item) => {
        return {
          'Application #': `${item.application_year}-${item.application_number
            .toString()
            .padStart(5, '0')}`,
          'Registration Date': item.registration_date,
          'Pet Owner': item.owner_full_name,
          "Pet's Name": item.pet_name,
          Gender: item.gender,
          'Reproductive Status': item.reproductive_status,
          Breed: item.breed,
          Birthdate: item.birthdate,
          Species: item.species,
          Color: item.color,
          'Pet Origin': item.origin,
          Habitat: item.habitat,
          'OR #': item.or_number,
        }
      })

    csvExporter.generateCsv(exportedData)
  }

  const handleExportData = () => {
    const exportedData =
      !petRegistration.isLoading &&
      petRegistration.data.map((item) => {
        return {
          'Application #': `${item.application_year}-${item.application_number
            .toString()
            .padStart(5, '0')}`,
          'Registration Date': item.registration_date,
          'Pet Owner': item.owner_full_name,
          "Pet's Name": item.pet_name,
          Gender: item.gender,
          'Reproductive Status': item.reproductive_status,
          Breed: item.breed,
          Birthdate: item.birthdate,
          Species: item.species,
          Color: item.color,
          'Pet Origin': item.origin,
          Habitat: item.habitat,
          'OR #': item.or_number,
        }
      })
    csvExporter.generateCsv(exportedData)
  }

  const handleSelectChange = (selectedOption, ref) => {
    form.setFieldValue(ref.name, selectedOption ? selectedOption.value : '')
  }

  const petOwner = useQuery({
    queryFn: async () =>
      await api.get('pet_owner').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.last_name}, ${item.first_name} ${
            item.middle_name ? item.middle_name : ''
          } ${item.suffix ? item.suffix : ''}`.trim()
          return { value, label }
        })
        return formattedData
      }),
    queryKey: ['petOwnerPetRegistration'],
    staleTime: Infinity,
    refetchInterval: 1000,
  })
  return (
    <>
      <ToastContainer />
      <CCard className="mb-4">
        <CCardHeader>
          {cardTitle}
          <div className="float-end">
            <CButton
              size="sm"
              onClick={() => {
                setEdit(false)
                form.resetForm()

                setModalVisible(!modalVisible)
              }}
            >
              <FontAwesomeIcon icon={faPlus} /> {cardTitle}
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          <MaterialReactTable
            columns={column}
            data={!petRegistration.isLoading && petRegistration.data}
            state={{
              isLoading:
                petRegistration.isLoading ||
                insertPetRegistration.isPending ||
                updatePetRegistration.isPending,
              isSaving:
                petRegistration.isLoading ||
                insertPetRegistration.isPending ||
                updatePetRegistration.isPending,
              showLoadingOverlay:
                petRegistration.isLoading ||
                insertPetRegistration.isPending ||
                updatePetRegistration.isPending,
              showProgressBars:
                petRegistration.isLoading ||
                insertPetRegistration.isPending ||
                updatePetRegistration.isPending,
              showSkeletons:
                petRegistration.isLoading ||
                insertPetRegistration.isPending ||
                updatePetRegistration.isPending,
            }}
            muiCircularProgressProps={{
              color: 'secondary',
              thickness: 5,
              size: 55,
            }}
            muiSkeletonProps={{
              animation: 'pulse',
              height: 28,
            }}
            displayColumnDefOptions={{
              'mrt-row-actions': {
                size: 100,
                grow: false,
              },
            }}
            enableColumnResizing
            columnFilterDisplayMode="popover"
            enableGrouping
            enableRowSelection
            enableSelectAll={true}
            paginationDisplayMode="pages"
            positionToolbarAlertBanner="bottom"
            enableStickyHeader
            enableStickyFooter
            enableRowActions
            selectAllMode="all"
            initialState={{
              density: 'compact',
              columnPinning: { left: ['mrt-row-actions'] },
            }}
            renderRowActions={({ row, table }) => (
              <Box sx={{ display: 'flex', flexWrap: 'nowrap' }}>
                <Tooltip title="Edit">
                  <IconButton
                    color="warning"
                    onClick={() => {
                      setEdit(true)
                      // const habitatText = 'House Only, Free Roaming, Custom Value' // Example input
                      const allowedValues = ['Caged', 'Leashed', 'House Only', 'Free Roaming']
                      let habitat_operator = ''
                      let habitats = []
                      let habitat = row.original.habitat.split(', ')

                      let habitatArray = row.original.habitat.split(', ').filter((value) => {
                        if (!allowedValues.includes(value)) {
                          habitat_operator = value // Assign value to habitat_operator if not in allowedValues

                          return false // Exclude from habitatArray
                        }
                        return true // Keep allowed values
                      })

                      if (habitatArray.length === 0) {
                        habitatArray = [...habitatArray, 'Others']
                      }
                      form.setValues({
                        id: row.original.pet_registration_id,
                        application_year: row.original.application_year,
                        application_number: row.original.application_number
                          .toString()
                          .padStart(5, '0'),
                        registration_date: row.original.registration_date,
                        pet_owner: row.original.pet_owner_id,
                        pet_name: row.original.pet_name,
                        or_number: row.original.or_number,
                        gender: row.original.gender,
                        reproductive_status: row.original.reproductive_status,
                        breed: row.original.breed,
                        birthdate: row.original.birthdate,
                        species: row.original.species,
                        color: row.original.color,
                        habitat: habitatArray,
                        habitat_other: habitat_operator,
                        pet_origin: row.original.origin === 'Local' ? 'Local' : 'Others',
                        pet_origin_text: row.original.origin,
                      })
                      setModalVisible(true)
                    }}
                  >
                    <EditSharp />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={async () => {
                      Swal.fire({
                        title: 'Are you sure?',
                        text: "You won't be able to revert this!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, delete it!',
                      }).then(async (result) => {
                        if (result.isConfirmed) {
                          validationPrompt(async () => {
                            let id = row.original.id

                            await api
                              .delete('pet_registration/delete/' + id)
                              .then(async (response) => {
                                await queryClient.invalidateQueries({
                                  queryKey: ['petRegistration'],
                                })
                                toast.success(response.data.message)
                              })
                              .catch((error) => {
                                console.info(error.response.data)
                                // toast.error(handleError(error))
                              })
                          })
                        }
                      })
                    }}
                  >
                    <DeleteOutline />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
            renderTopToolbarCustomActions={({ table }) => (
              <Box
                className="d-none d-lg-flex"
                sx={{
                  display: 'flex',
                  gap: '.2rem',
                  p: '0.5rem',
                  flexWrap: 'wrap',
                }}
              >
                <CButton
                  className="btn-info text-white"
                  onClick={async () =>
                    await queryClient.resetQueries({ queryKey: ['petRegistration'] })
                  }
                  size="sm"
                >
                  <FontAwesomeIcon icon={faRefresh} /> Refresh
                </CButton>
                <CButton className="btn-info text-white" onClick={handleExportData} size="sm">
                  <FontAwesomeIcon icon={faFileExcel} /> Export to Excel
                </CButton>
                <CButton
                  disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                  size="sm"
                  onClick={() => handleExportRows(table.getSelectedRowModel().rows)}
                  variant="outline"
                >
                  <FontAwesomeIcon icon={faFileExcel} /> Export Selected Rows
                </CButton>
              </Box>
            )}
          />
        </CCardBody>
      </CCard>

      <CModal
        alignment="center"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <CModalHeader>
          <CModalTitle>{form.values.id ? "Edit Pet' Information" : 'Pet Registration'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm
            className="row g-3  "
            onSubmit={form.handleSubmit}
            style={{ position: 'relative' }}
          >
            <RequiredFieldNote />
            <CRow className="justify-content-between">
              <CCol md={4}>
                <CFormLabel>Registration No.</CFormLabel>
                {applicationNumber.isLoading ? (
                  <Skeleton variant="text" style={{ marginTop: '-10px' }} width={150} height={50} />
                ) : (
                  <h4 className="text-danger" style={{ textDecoration: 'underline' }}>
                    {`${form.values.application_year} - ${form.values.application_number}`}
                  </h4>
                )}
              </CCol>

              <CCol md={4}>
                <CFormInput
                  type="date"
                  label={requiredField('Date Registration')}
                  name="registration_date"
                  onChange={handleInputChange}
                  value={form.values.registration_date}
                  invalid={form.touched.registration_date && form.errors.registration_date}
                />
                {form.touched.registration_date && form.errors.registration_date && (
                  <CFormText className="text-danger">{form.errors.registration_date}</CFormText>
                )}
              </CCol>
              <CCol md={4}>
                <CFormInput
                  type="text"
                  label="OR #"
                  name="or_number"
                  onChange={handleInputChange}
                  value={form.values.or_number}
                  invalid={form.touched.or_number && form.errors.or_number}
                />
                {form.touched.or_number && form.errors.or_number && (
                  <CFormText className="text-danger">{form.errors.or_number}</CFormText>
                )}
              </CCol>
            </CRow>

            <CRow className="mt-4">
              <h5>Owner&apos;s Information</h5>
              <hr />

              <CCol md={12}>
                <CFormLabel>
                  {
                    <>
                      {petOwner.isLoading && <CSpinner size="sm" />}
                      {requiredField(' Pet Owner')}
                    </>
                  }
                </CFormLabel>
                <Select
                  ref={selectPetOwnerInputRef}
                  value={
                    (!petOwner.isLoading || !petOwner.isFetching) &&
                    petOwner.data?.find((option) => option.value === form.values.pet_owner)
                  }
                  onChange={handleSelectChange}
                  options={(!petOwner.isLoading || !petOwner.isFetching) && petOwner.data}
                  name="pet_owner"
                  isSearchable
                  placeholder="Search..."
                  isClearable
                />
                {form.touched.pet_owner && form.errors.pet_owner && (
                  <CFormText className="text-danger">{form.errors.pet_owner}</CFormText>
                )}
              </CCol>
            </CRow>
            <CRow className="mt-4">
              <h5>Pet&apos;s Information</h5>
              <hr />
              <CCol md={12}>
                <CFormInput
                  type="text"
                  label={requiredField("Pet's Name")}
                  name="pet_name"
                  onChange={handleInputChange}
                  value={form.values.pet_name}
                  invalid={form.touched.pet_name && form.errors.pet_name}
                />
                {form.touched.pet_name && form.errors.pet_name && (
                  <CFormText className="text-danger">{form.errors.pet_name}</CFormText>
                )}
              </CCol>
              <CCol md={4}>
                <CFormSelect
                  label={requiredField('Gender')}
                  name="gender"
                  onChange={handleInputChange}
                  value={form.values.gender}
                  invalid={form.touched.gender && form.errors.gender}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </CFormSelect>

                {form.touched.gender && form.errors.gender && (
                  <CFormText className="text-danger">{form.errors.gender}</CFormText>
                )}
              </CCol>

              <CCol md={4}>
                <CFormSelect
                  label={requiredField('Reproductive Status')}
                  name="reproductive_status"
                  onChange={handleInputChange}
                  value={form.values.reproductive_status}
                  invalid={form.touched.reproductive_status && form.errors.reproductive_status}
                >
                  <option value="">Select</option>
                  <option value="Intact">Intact</option>
                  <option value="Neutered">Neutered</option>
                </CFormSelect>
                {form.touched.reproductive_status && form.errors.reproductive_status && (
                  <CFormText className="text-danger">{form.errors.reproductive_status}</CFormText>
                )}
              </CCol>
              <CCol md={4}>
                <CFormInput
                  type="text"
                  label={requiredField('Breed')}
                  name="breed"
                  onChange={handleInputChange}
                  value={form.values.breed}
                  invalid={form.touched.breed && form.errors.breed}
                />
                {form.touched.breed && form.errors.breed && (
                  <CFormText className="text-danger">{form.errors.breed}</CFormText>
                )}
              </CCol>
              <CCol md={4}>
                <CFormInput
                  type="date"
                  label={requiredField('Date of Birth')}
                  name="birthdate"
                  onChange={handleInputChange}
                  value={form.values.birthdate}
                  invalid={form.touched.birthdate && form.errors.birthdate}
                />
                {form.touched.birthdate && form.errors.birthdate && (
                  <CFormText className="text-danger">{form.errors.birthdate}</CFormText>
                )}
              </CCol>
              <CCol md={4}>
                <CFormSelect
                  label={requiredField('Species')}
                  name="species"
                  onChange={handleInputChange}
                  value={form.values.species}
                  invalid={form.touched.species && form.errors.species}
                >
                  <option value="">Select</option>
                  <option value="Cat">Cat</option>
                  <option value="Dog">Dog</option>
                </CFormSelect>
                {form.touched.species && form.errors.species && (
                  <CFormText className="text-danger">{form.errors.species}</CFormText>
                )}
              </CCol>
              <CCol md={4}>
                <CFormInput
                  type="text"
                  label={requiredField('Color/Marking(s)')}
                  name="color"
                  onChange={handleInputChange}
                  value={form.values.color}
                  invalid={form.touched.color && form.errors.color}
                />
                {form.touched.color && form.errors.color && (
                  <CFormText className="text-danger">{form.errors.color}</CFormText>
                )}
              </CCol>
            </CRow>
            <CRow>
              <CCol md={12}>
                <CFormLabel>Pet Origin</CFormLabel>
                <br />
                <CFormCheck
                  inline
                  type="radio"
                  name="pet_origin"
                  id="petOriginOption1"
                  value={'Local'}
                  onChange={handleInputChange}
                  checked={form.values.pet_origin === 'Local'}
                  label="Local"
                  invalid={form.touched.pet_origin && form.errors.pet_origin}
                />
                <CFormCheck
                  inline
                  type="radio"
                  name="pet_origin"
                  id="petOriginOption2"
                  label="Others/Specify"
                  value={'Others'}
                  onChange={handleInputChange}
                  checked={form.values.pet_origin === 'Others'}
                  invalid={form.touched.pet_origin && form.errors.pet_origin}
                />
                {form.values.pet_origin === 'Others' && (
                  <CFormInput
                    type="text"
                    name="pet_origin_text"
                    placeholder="Please specify"
                    value={form.values.pet_origin_text}
                    onChange={handleInputChange}
                    invalid={form.touched.pet_origin_text && form.errors.pet_origin_text}
                  />
                )}

                {form.touched.pet_origin_text && form.errors.pet_origin_text && (
                  <CFormText className="text-danger">{form.errors.pet_origin_text}</CFormText>
                )}
              </CCol>
            </CRow>

            <CRow>
              <CCol md={12}>
                <CFormLabel>Habitat</CFormLabel>
                <br />
                <CFormCheck
                  inline
                  name="habitat"
                  id="habitatOption1"
                  value="Caged"
                  label="Caged"
                  invalid={form.touched.habitat && form.errors.habitat}
                  onChange={handleInputChange}
                  checked={form.values.habitat.includes('Caged')}
                />
                <CFormCheck
                  inline
                  name="habitat"
                  id="habitatOption2"
                  value="Leashed"
                  label="Leashed"
                  invalid={form.touched.habitat && form.errors.habitat}
                  onChange={handleInputChange}
                  checked={form.values.habitat.includes('Leashed')}
                />
                <CFormCheck
                  inline
                  name="habitat"
                  id="habitatOption3"
                  value="Free Roaming"
                  label="Free Roaming"
                  invalid={form.touched.habitat && form.errors.habitat}
                  onChange={handleInputChange}
                  checked={form.values.habitat.includes('Free Roaming')}
                />
                <CFormCheck
                  inline
                  name="habitat"
                  id="habitatOption4"
                  value="House Only"
                  label="House Only"
                  invalid={form.touched.habitat && form.errors.habitat}
                  onChange={handleInputChange}
                  checked={form.values.habitat.includes('House Only')}
                />
                <CFormCheck
                  inline
                  name="habitat"
                  id="habitatOption5"
                  value="Others"
                  label="Others/Specify"
                  invalid={form.touched.habitat && form.errors.habitat}
                  onChange={handleInputChange}
                  checked={form.values.habitat.includes('Others')}
                />

                {form.values.habitat.includes('Others') && (
                  <CFormInput
                    type="text"
                    name="habitat_other"
                    placeholder="Please specify"
                    value={form.values.habitat_other}
                    onChange={handleInputChange}
                    invalid={form.touched.habitat_other && form.errors.habitat_other}
                  />
                )}
                {form.touched.habitat && form.errors.habitat && (
                  <CFormText className="text-danger">{form.errors.habitat}</CFormText>
                )}
              </CCol>
            </CRow>
            <hr />
            <hr />
            <CCol xs={12}>
              <CButton color="primary" type="submit" className="float-end">
                {form.values.id ? 'Update' : 'Submit'}
              </CButton>
            </CCol>
          </CForm>
          {(insertPetRegistration.isPending || updatePetRegistration.isPending) && (
            <DefaultLoading />
          )}
        </CModalBody>
      </CModal>
    </>
  )
}

export default PetRegistration
