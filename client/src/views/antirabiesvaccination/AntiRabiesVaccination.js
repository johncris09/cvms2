import React, { useState, useEffect, useRef } from 'react'
import './../../assets/css/react-paginate.css'
import Swal from 'sweetalert2'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
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
import * as Yup from 'yup'
import MaterialReactTable from 'material-react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Select from 'react-select'
import {
  faFileExcel,
  faFilePdf,
  faFilter,
  faPlus,
  faRefresh,
} from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify'
import { Box, IconButton, Tooltip } from '@mui/material'
import { DeleteOutline, EditSharp } from '@mui/icons-material'
import { DefaultLoading } from 'src/components/Loading'
import { ExportToCsv } from 'export-to-csv'
import { Page, Text, View, Document, StyleSheet, PDFViewer, Font, Image } from '@react-pdf/renderer'
import logo from './../../assets/images/logo.png'
import { jwtDecode } from 'jwt-decode'
import moment from 'moment/moment'
import {
  RequiredFieldNote,
  api,
  requiredField,
  validationPrompt,
} from 'src/components/SystemConfiguration'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const AntiRabiesVaccination = () => {
  const selectAddressIputRef = useRef()
  const selectSpeciesIputRef = useRef()
  const queryClient = useQueryClient()
  const [reportLoading, setReportLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [isEnableEdit, setIsEnableEdit] = useState(false)
  const [barangay, setBarangay] = useState('')
  const [date, setDate] = useState('')
  const [modalGenerateReportVisible, setModalGenerateReportVisible] = useState(false)
  const [user, setUser] = useState([])
  const [chunks, setChunks] = useState([])

  const column = [
    {
      accessorKey: 'address',
      header: 'Address',
    },
    {
      accessorKey: 'color',
      header: 'Color',
    },
    {
      accessorKey: 'date_vaccinated',
      header: 'Date Vaccination',
    },
    {
      accessorKey: 'pet_name',
      header: 'Pet Name',
    },
    {
      accessorKey: 'neutered',
      header: 'Neutered',
    },
    {
      accessorKey: 'owner_name',
      header: 'Owner Name',
    },
    {
      accessorKey: 'pet_birthdate',
      header: 'Pet Birthdate',
    },
    {
      accessorKey: 'species',
      header: 'Species',
    },
    {
      accessorKey: 'sex',
      header: 'Sex',
    },
    {
      accessorKey: 'vaccine_type',
      header: 'Vaccine Type',
    },
  ]

  useEffect(() => {
    setUser(jwtDecode(localStorage.getItem('cvmsToken')))
  }, [])

  const antiRabiesVaccination = useQuery({
    queryFn: async () =>
      await api.get('anti_rabies_vaccination').then((response) => {
        return response.data
      }),
    queryKey: ['antiRabiesVaccination'],
    staleTime: Infinity,
    refetchInterval: 1000,
  })

  const address = useQuery({
    queryFn: async () =>
      await api.get('address').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.barangay}`
          return { value, label }
        })
        return formattedData
      }),
    queryKey: ['addressAntiRabiesVaccination'],
    staleTime: Infinity,
  })

  const antiRabiesSpecies = useQuery({
    queryFn: async () =>
      await api.get('anti_rabies_species').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.name}`
          return { value, label }
        })
        return formattedData
      }),
    queryKey: ['antiRabiesSpecies'],
    staleTime: Infinity,
  })

  const validationSchema = Yup.object().shape({
    date_vaccinated: Yup.string().required('Date Vaccinated is required'),
    vaccine_type: Yup.string().required('Vaccine Type is required'),
    owner_name: Yup.string().required('Name of the Owner is required'),
    pet_name: Yup.string().required("Pet's Name is required"),
    address: Yup.string().required('Address is required'),
    pet_birthdate: Yup.string().required("Pet's Birthdate is required"),
    sex: Yup.string().required('Sex is required'),
    color: Yup.string().required('Color is required'),
    species: Yup.string().required('Species is required'),
    neutered: Yup.string().required('Neutered is required'),
  })
  const form = useFormik({
    initialValues: {
      id: '',
      date_vaccinated: '',
      vaccine_type: '',
      owner_name: '',
      pet_name: '',
      address: '',
      pet_birthdate: '',
      sex: '',
      color: '',
      species: '',
      neutered: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.id) {
        await updateantiRabiesVaccination.mutate(values)
      } else {
        await insertantiRabiesVaccination.mutate(values)
      }
    },
  })

  const insertantiRabiesVaccination = useMutation({
    mutationKey: ['insertDeworming'],
    mutationFn: async (values) => {
      return await api.post('anti_rabies_vaccination/insert', values)
    },
    onSuccess: async (response) => {
      console.info(response.data)
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      await queryClient.invalidateQueries({ queryKey: ['antiRabiesVaccination'] })
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const updateantiRabiesVaccination = useMutation({
    mutationFn: async (values) => {
      return await api.put('anti_rabies_vaccination/update/' + values.id, values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      setModalVisible(false)
      await queryClient.invalidateQueries({ queryKey: ['antiRabiesVaccination'] })
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const handleSelectChange = (selectedOption, ref) => {
    form.setFieldValue(ref.name, selectedOption ? selectedOption.value : '')
    generateReportForm.setFieldValue(ref.name, selectedOption ? selectedOption.value : '')
  }

  const handleInputChange = (e) => {
    form.handleChange(e)
    const { name, value, type } = e.target
    if (type === 'text' && name !== 'amount') {
      const titleCaseValue = value
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      form.setFieldValue(name, titleCaseValue)
    } else {
      form.setFieldValue(name, value)
    }
    generateReportForm.setFieldValue(name, value)
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
          Address: item.address,
          Color: item.color,
          'Date Vaccination': item.date_vaccinated,
          'Pet Name': item.pet_name,
          Neutered: item.neutered,
          'Owner Name': item.owner_name,
          'Pet Birthdate': item.pet_birthdate,
          Species: item.species,
          Sex: item.sex,
          'Vaccine Type': item.vaccine_type,
        }
      })

    csvExporter.generateCsv(exportedData)
  }

  const handleExportData = () => {
    const exportedData =
      !antiRabiesVaccination.isLoading &&
      antiRabiesVaccination.data.map((item) => {
        return {
          Address: item.address,
          Color: item.color,
          'Date Vaccination': item.date_vaccinated,
          'Pet Name': item.pet_name,
          Neutered: item.neutered,
          'Owner Name': item.owner_name,
          'Pet Birthdate': item.pet_birthdate,
          Species: item.species,
          Sex: item.sex,
          'Vaccine Type': item.vaccine_type,
        }
      })
    csvExporter.generateCsv(exportedData)
  }

  Font.register({
    family: 'Roboto',
    fonts: [
      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
      },
      {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf',
        fontWeight: 'bolder',
      },
    ],
  })

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      padding: 10,
      height: '100%',
    },
    header: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 40,
    },
    country: {
      fontSize: '16pt',
    },
    office: {
      fontSize: '14pt',
    },
    city: {
      fontSize: '12pt',
    },
    citytag: {
      fontSize: '9pt',
      color: 'red',
      fontStyle: 'italic !important',
    },

    logo_left: {
      width: 70,
      height: 70,
      marginRight: 10,
      top: 0,
      position: 'absolute',
      left: 5,
    },
    logo_right_1: {
      width: 70,
      height: 70,
      marginRight: 10,
      top: 0,
      position: 'absolute',
      right: 50,
    },
    logo_right_2: {
      width: 80,
      height: 80,
      marginRight: 10,
      top: 0,
      position: 'absolute',
      right: -15,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    description: {
      fontWeight: 'bolder',
      backgroundColor: '#5FBDFF',
      textAlign: 'center',
      marginBottom: '10px',
      fontSize: '12pt',
      paddingTop: '3px',
      paddingBottom: '3px',
    },

    recommended: {
      fontSize: '11pt',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 30,
      marginTop: 30,
    },
    chairpersion: {
      borderTop: 1,
      borderTopColor: 'black',
      width: 200,
      textAlign: 'center',
      marginLeft: 50,
      marginTop: 40,
      fontSize: '11pt',
      flexDirection: 'column',
    },
    pageNumber: {
      position: 'absolute',
      fontSize: '8pt',
      bottom: 20,
      left: 0,
      right: 0,
      textAlign: 'center',
      color: 'grey',
    },

    inBehalf: {
      flexDirection: 'row',
      fontSize: '10pt',
    },
    cityMayor: {
      textAlign: 'center',
      borderTop: 1,
      borderTopColor: 'black',
      flexDirection: 'column',
      marginLeft: 140,
      width: 180,
    },

    footer: {
      color: 'grey',
      position: 'absolute',
      bottom: 20,
      left: 10,
      right: 20,
      textAlign: 'center',
      paddingTop: 10,
      fontSize: '8pt',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    info: {
      fontSize: '12pt',
      marginBottom: 5,
      textAlign: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    tableHeader: {
      display: 'flex',
      flexDirection: 'row',
      textAlign: 'center',
      paddingTop: 5,
      paddingBottom: 5,
      fontSize: '11pt',
      backgroundColor: 'blue',
      color: 'white',
      fontFamily: 'Roboto',
      fontWeight: 800,
    },
    tableData: {
      display: 'flex',
      flexDirection: 'row',
      textAlign: 'center',
      borderBottom: '0.4px solid grey',
      paddingTop: 3,
      paddingBottom: 3,
      fontSize: '10pt',
      flexWrap: 'wrap',
      wordWrap: 'break-word',
    },
  })

  const handleGenerateReportInputChange = (e) => {
    form.handleChange(e)
    const { name, value } = e.target
    generateReportForm.setFieldValue(name, value)
  }

  const generateReportFormValidationSchema = Yup.object().shape({
    start_date: Yup.string().required('Start Date is required'),
    end_date: Yup.string().required('End Date is required'),

    rowsPerPage: Yup.string().required('Rows per page is required'),
  })
  const generateReportForm = useFormik({
    initialValues: {
      start_date: '',
      end_date: '',
      address: '',
      species: '',
      neutered: '',
      rowsPerPage: 25,
    },
    validationSchema: generateReportFormValidationSchema,
    onSubmit: async (values) => {
      setReportLoading(true)
      await api
        .get('anti_rabies_vaccination/generate_report/', { params: values })
        .then((response) => {
          if (response.data.length > 0) {
            const dividedArray = chunkArray(response.data, parseInt(values.rowsPerPage))
            console.info(dividedArray)
            setChunks(dividedArray)
          } else {
            toast.info('No Record Found')
            setReportLoading(false)
            setChunks([])
            setBarangay('')
            setDate('')
          }
          if (values.address !== '') {
            setBarangay(selectAddressIputRef.current.props.value.label)
          } else {
            setBarangay('All')
          }
          setDate(
            moment(generateReportForm.values.start_date).format('MMMM D, YYYY') +
              ' - ' +
              moment(generateReportForm.values.end_date).format('MMMM D, YYYY'),
          )
        })
        .catch((error) => {
          console.info(error)
          // toast.error(HandleError(error))
          setBarangay('')
          setDate('')
        })
    },
  })

  const chunkArray = (arr, size) => {
    const slice = []
    for (let i = 0; i < arr.length; i += size) {
      slice.push(arr.slice(i, i + size))
    }
    setReportLoading(false)
    return slice
  }

  const col = [
    'no',
    'owner_name',
    'pet_name',
    'address',
    'sex',
    'color',
    'species',
    'neutered',
    'vaccine_type',
  ]

  return (
    <>
      <ToastContainer />
      <CCard className="mb-4" style={{ position: 'relative' }}>
        <CCardHeader>
          Anti-Rabies Vaccination
          <div className="float-end">
            <CButton
              size="sm"
              className="mx-1"
              color="primary"
              variant="outline"
              onClick={() => {
                setModalGenerateReportVisible(!modalGenerateReportVisible)
              }}
            >
              <FontAwesomeIcon icon={faFilePdf} /> Generate Report
            </CButton>
            <CButton
              size="sm"
              color="primary"
              onClick={() => {
                form.resetForm()
                setIsEnableEdit(false)
                setModalVisible(!modalVisible)
              }}
            >
              <FontAwesomeIcon icon={faPlus} /> Add Anti-Rabies Vaccination
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          <MaterialReactTable
            columns={column}
            data={!antiRabiesVaccination.isLoading && antiRabiesVaccination.data}
            state={{
              isLoading:
                antiRabiesVaccination.isLoading ||
                insertantiRabiesVaccination.isPending ||
                updateantiRabiesVaccination.isPending,
              isSaving:
                antiRabiesVaccination.isLoading ||
                insertantiRabiesVaccination.isPending ||
                updateantiRabiesVaccination.isPending,
              showLoadingOverlay:
                antiRabiesVaccination.isLoading ||
                insertantiRabiesVaccination.isPending ||
                updateantiRabiesVaccination.isPending,
              showProgressBars:
                antiRabiesVaccination.isLoading ||
                insertantiRabiesVaccination.isPending ||
                updateantiRabiesVaccination.isPending,
              showSkeletons:
                antiRabiesVaccination.isLoading ||
                insertantiRabiesVaccination.isPending ||
                updateantiRabiesVaccination.isPending,
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
            enableRowVirtualization
            enableColumnVirtualization
            enableGrouping
            enableRowSelection
            enableSelectAll={true}
            columnFilterDisplayMode="popover"
            paginationDisplayMode="pages"
            positionToolbarAlertBanner="bottom"
            enableStickyHeader
            enableStickyFooter
            enableRowActions
            selectAllMode="all"
            initialState={{ density: 'compact' }}
            renderRowActions={({ row, table }) => (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Tooltip title="Edit">
                  <IconButton
                    color="warning"
                    onClick={() => {
                      setIsEnableEdit(true)
                      form.setValues({
                        id: row.original.id,
                        farmer_name: row.original.farmer_name,
                        address: row.original.address_id,
                        date_deworming: row.original.date_deworming,
                        species: row.original.species_id,
                        head_number: row.original.head_number,
                        female: row.original.female,
                        male: row.original.male,
                        treatment: row.original.treatment_id,
                        amount: row.original.amount,
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
                              .delete('anti_rabies_vaccination/delete/' + id)
                              .then(async (response) => {
                                await queryClient.invalidateQueries({
                                  queryKey: ['antiRabiesVaccination'],
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
                    await queryClient.resetQueries({ queryKey: ['antiRabiesVaccination'] })
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
          <CModalTitle>
            {isEnableEdit ? 'Edit Anti-Rabies Vaccination' : 'Add Anti-Rabies Vaccination'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm
            className="row g-3  "
            onSubmit={form.handleSubmit}
            style={{ position: 'relative' }}
          >
            <RequiredFieldNote />
            <CCol md={6}>
              <CFormInput
                type="date"
                label={requiredField('Date of Vaccination')}
                name="date_vaccinated"
                onChange={handleInputChange}
                value={form.values.date_vaccinated}
              />
              {form.touched.date_vaccinated && form.errors.date_vaccinated && (
                <CFormText className="text-danger">{form.errors.date_vaccinated}</CFormText>
              )}
            </CCol>

            <CCol md={6}>
              <CFormInput
                type="text"
                label={requiredField('Vaccine Type')}
                name="vaccine_type"
                onChange={handleInputChange}
                value={form.values.vaccine_type}
              />
              {form.touched.vaccine_type && form.errors.vaccine_type && (
                <CFormText className="text-danger">{form.errors.vaccine_type}</CFormText>
              )}
            </CCol>

            <CCol md={6}>
              <CFormInput
                type="text"
                label={requiredField('Name of the Owner')}
                name="owner_name"
                onChange={handleInputChange}
                value={form.values.owner_name}
              />
              {form.touched.owner_name && form.errors.owner_name && (
                <CFormText className="text-danger">{form.errors.owner_name}</CFormText>
              )}
            </CCol>
            <CCol md={6}>
              <CFormInput
                type="text"
                label={requiredField("Pet's Name")}
                name="pet_name"
                onChange={handleInputChange}
                value={form.values.pet_name}
              />
              {form.touched.pet_name && form.errors.pet_name && (
                <CFormText className="text-danger">{form.errors.pet_name}</CFormText>
              )}
            </CCol>

            <CCol md={12}>
              <CFormLabel>
                {
                  <>
                    {(address.isLoading || address.isFetching) && <CSpinner size="sm" />}
                    {requiredField(' Address')}
                  </>
                }
              </CFormLabel>
              <Select
                ref={selectAddressIputRef}
                value={
                  (!address.isLoading || !address.isFetching) &&
                  address.data?.find((option) => option.value === form.values.address)
                }
                onChange={handleSelectChange}
                options={(!address.isLoading || !address.isFetching) && address.data}
                name="address"
                isSearchable
                placeholder="Search..."
                isClearable
              />
              {form.touched.address && form.errors.address && (
                <CFormText className="text-danger">{form.errors.address}</CFormText>
              )}
            </CCol>
            <CCol md={4}>
              <CFormInput
                type="date"
                label={requiredField("Pet's Birthdate")}
                name="pet_birthdate"
                onChange={handleInputChange}
                value={form.values.pet_birthdate}
              />
              {form.touched.pet_birthdate && form.errors.pet_birthdate && (
                <CFormText className="text-danger">{form.errors.pet_birthdate}</CFormText>
              )}
            </CCol>
            <CCol md={4}>
              <CFormSelect
                aria-label="Sex"
                label={requiredField('Sex')}
                name="sex"
                onChange={handleInputChange}
                value={form.values.sex}
              >
                <option value="">Choose...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </CFormSelect>
              {form.touched.sex && form.errors.sex && (
                <CFormText className="text-danger">{form.errors.sex}</CFormText>
              )}
            </CCol>
            <CCol md={4}>
              <CFormInput
                type="text"
                label={requiredField('Color')}
                name="color"
                onChange={handleInputChange}
                value={form.values.color}
              />
              {form.touched.color && form.errors.color && (
                <CFormText className="text-danger">{form.errors.color}</CFormText>
              )}
            </CCol>
            <CCol md={6}>
              <CFormLabel>
                {
                  <>
                    {(antiRabiesSpecies.isLoading || antiRabiesSpecies.isFetching) && (
                      <CSpinner size="sm" />
                    )}
                    {' Species'}
                  </>
                }
              </CFormLabel>
              <Select
                ref={selectSpeciesIputRef}
                value={
                  (!antiRabiesSpecies.isLoading || !antiRabiesSpecies.isFetching) &&
                  antiRabiesSpecies.data?.find((option) => option.value === form.values.species)
                }
                onChange={handleSelectChange}
                options={
                  (!antiRabiesSpecies.isLoading || !antiRabiesSpecies.isFetching) &&
                  antiRabiesSpecies.data
                }
                name="species"
                isSearchable
                placeholder="Search..."
                isClearable
              />
              {form.touched.species && form.errors.species && (
                <CFormText className="text-danger">{form.errors.species}</CFormText>
              )}
            </CCol>
            <CCol md={6}>
              <CFormSelect
                aria-label="Neutered"
                label={requiredField('Neutered')}
                name="neutered"
                onChange={handleInputChange}
                value={form.values.neutered}
              >
                <option value="">Choose...</option>
                <option value="Y">Yes</option>
                <option value="N">No</option>
              </CFormSelect>
              {form.touched.neutered && form.errors.neutered && (
                <CFormText className="text-danger">{form.errors.neutered}</CFormText>
              )}
            </CCol>
            <hr />
            <CCol xs={12}>
              <CButton color="primary" type="submit" className="float-end">
                {isEnableEdit ? 'Update' : 'Submit'}
              </CButton>
            </CCol>
          </CForm>
          {(insertantiRabiesVaccination.isPending || insertantiRabiesVaccination.isPending) && (
            <DefaultLoading />
          )}
        </CModalBody>
      </CModal>
      {/* generate report */}
      <CModal
        visible={modalGenerateReportVisible}
        onClose={() => setModalGenerateReportVisible(false)}
        backdrop="static"
        keyboard={false}
        size="xl"
      >
        <CModalHeader>
          <CModalTitle>Generate Report</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol md={4}>
              <CFormLabel>
                <FontAwesomeIcon icon={faFilter} /> Filter
              </CFormLabel>
              <CForm className="row g-3" onSubmit={generateReportForm.handleSubmit}>
                <RequiredFieldNote />

                <CCol md={6}>
                  <CFormInput
                    type="date"
                    label={requiredField('Start Date')}
                    name="start_date"
                    onChange={handleInputChange}
                    value={generateReportForm.values.start_date}
                  />
                  {generateReportForm.touched.start_date &&
                    generateReportForm.errors.start_date && (
                      <CFormText className="text-danger">
                        {generateReportForm.errors.start_date}
                      </CFormText>
                    )}
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    type="date"
                    label={requiredField('End Date')}
                    name="end_date"
                    onChange={handleInputChange}
                    value={generateReportForm.values.end_date}
                  />
                  {generateReportForm.touched.end_date && generateReportForm.errors.end_date && (
                    <CFormText className="text-danger">
                      {generateReportForm.errors.end_date}
                    </CFormText>
                  )}
                </CCol>
                <CCol md={12}>
                  <CFormLabel>
                    {
                      <>
                        {(address.isLoading || address.isFetching) && <CSpinner size="sm" />}
                        {' Address'}
                      </>
                    }
                  </CFormLabel>
                  <Select
                    ref={selectAddressIputRef}
                    value={
                      (!address.isLoading || !address.isFetching) &&
                      address.data?.find(
                        (option) => option.value === generateReportForm.values.address,
                      )
                    }
                    onChange={handleSelectChange}
                    options={(!address.isLoading || !address.isFetching) && address.data}
                    name="address"
                    isSearchable
                    placeholder="Search..."
                    isClearable
                  />
                  {generateReportForm.touched.address && generateReportForm.errors.address && (
                    <CFormText className="text-danger">
                      {generateReportForm.errors.address}
                    </CFormText>
                  )}
                </CCol>

                <CCol md={12}>
                  <CFormLabel>
                    {
                      <>
                        {(antiRabiesSpecies.isLoading || antiRabiesSpecies.isFetching) && (
                          <CSpinner size="sm" />
                        )}
                        {' Species'}
                      </>
                    }
                  </CFormLabel>
                  <Select
                    ref={selectSpeciesIputRef}
                    value={
                      (!antiRabiesSpecies.isLoading || !antiRabiesSpecies.isFetching) &&
                      antiRabiesSpecies.data?.find(
                        (option) => option.value === generateReportForm.values.species,
                      )
                    }
                    onChange={handleSelectChange}
                    options={
                      (!antiRabiesSpecies.isLoading || !antiRabiesSpecies.isFetching) &&
                      antiRabiesSpecies.data
                    }
                    name="species"
                    isSearchable
                    placeholder="Search..."
                    isClearable
                  />

                  {generateReportForm.touched.species && generateReportForm.errors.species && (
                    <CFormText className="text-danger">
                      {generateReportForm.errors.species}
                    </CFormText>
                  )}
                </CCol>
                <CCol md={12}>
                  <CFormSelect
                    label="Neutered"
                    name="neutered"
                    onChange={handleGenerateReportInputChange}
                    value={generateReportForm.values.neutered}
                  >
                    <option value="">Choose...</option>
                    <option value="Y">Yes</option>
                    <option value="N">No</option>
                  </CFormSelect>
                  {generateReportForm.touched.neutered && generateReportForm.errors.neutered && (
                    <CFormText className="text-danger">
                      {generateReportForm.errors.neutered}
                    </CFormText>
                  )}
                </CCol>

                <CCol md={12}>
                  <CFormInput
                    type="number"
                    label="Rows per page"
                    name="rowsPerPage"
                    onChange={handleInputChange}
                    value={generateReportForm.values.rowsPerPage}
                  />
                  {generateReportForm.touched.rowsPerPage &&
                    generateReportForm.errors.rowsPerPage && (
                      <CFormText className="text-danger">
                        {generateReportForm.errors.rowsPerPage}
                      </CFormText>
                    )}
                </CCol>

                <hr />
                <CCol xs={12}>
                  <div className="d-grid gap-2">
                    <CButton color="primary" type="submit">
                      Generate
                    </CButton>
                  </div>
                </CCol>
              </CForm>
            </CCol>
            <CCol md={8}>
              <PDFViewer width="100%" height="700px">
                <Document size="A4">
                  {chunks.map((chunk, index) => (
                    <Page key={index} style={styles.page}>
                      <View style={styles.header} fixed>
                        <Image src={logo} style={styles.logo_left} alt="Oroquieta City Logo" />
                        <Text style={styles.country}>Republic of the Philippines</Text>
                        <Text style={styles.office}>Office of the City Mayor</Text>
                        <Text style={styles.city}>Oroqueita City</Text>
                        <Text style={styles.citytag}>City of Goodlife</Text>
                        <Text style={{ ...styles.city, marginTop: 5 }}>Deworming</Text>
                      </View>
                      <View style={styles.info}>
                        <Text>Barangay: {barangay}</Text>
                        <Text>Date: {date}</Text>
                      </View>
                      <View style={styles.tableHeader} fixed>
                        {col.map((c, index) => (
                          <>
                            {c === 'no' && (
                              <Text
                                key={index}
                                style={{
                                  width: `${40 / col.length}%`,
                                }}
                              >
                                No.
                              </Text>
                            )}
                            {c === 'owner_name' && (
                              <Text
                                key={index}
                                style={{
                                  width: `${180 / col.length}%`,
                                }}
                              >
                                Owner&lsquo;s Name
                              </Text>
                            )}
                            {c === 'pet_name' && (
                              <Text
                                key={index}
                                style={{
                                  width: `${120 / col.length}%`,
                                }}
                              >
                                Pet&lsquo;s Name
                              </Text>
                            )}
                            {c === 'address' && (
                              <Text
                                key={index}
                                style={{
                                  width: `${160 / col.length}%`,
                                }}
                              >
                                Address
                              </Text>
                            )}
                            {c === 'sex' && (
                              <Text
                                key={index}
                                style={{
                                  width: `${60 / col.length}%`,
                                }}
                              >
                                Sex
                              </Text>
                            )}
                            {c === 'color' && (
                              <Text
                                key={index}
                                style={{
                                  width: `${100 / col.length}%`,
                                }}
                              >
                                Color
                              </Text>
                            )}
                            {c === 'species' && (
                              <Text
                                key={index}
                                style={{
                                  width: `${80 / col.length}%`,
                                }}
                              >
                                Species
                              </Text>
                            )}
                            {c === 'neutered' && (
                              <Text
                                key={index}
                                style={{
                                  width: `${30 / col.length}%`,
                                }}
                              >
                                Neutered
                              </Text>
                            )}
                            {c === 'vaccine_type' && (
                              <Text
                                key={index}
                                style={{
                                  width: `${120 / col.length}%`,
                                }}
                              >
                                Vaccine Type
                              </Text>
                            )}
                          </>
                        ))}
                      </View>
                      {chunk.map((rowData, rowIndex) => (
                        <>
                          <View style={styles.tableData}>
                            {col.map((c) => (
                              <>
                                {c === 'no' && (
                                  <Text key={rowIndex} style={{ width: `${40 / col.length}%` }}>
                                    {index * generateReportForm.values.rowsPerPage + rowIndex + 1}
                                  </Text>
                                )}
                                {c === 'owner_name' && (
                                  <Text key={rowIndex} style={{ width: `${180 / col.length}%` }}>
                                    {rowData[c]}
                                  </Text>
                                )}
                                {c === 'pet_name' && (
                                  <Text
                                    key={rowIndex}
                                    style={{
                                      width: `${120 / col.length}%`,
                                    }}
                                  >
                                    {rowData[c]}
                                  </Text>
                                )}
                                {c === 'address' && (
                                  <Text
                                    key={rowIndex}
                                    style={{
                                      width: `${160 / col.length}%`,
                                    }}
                                  >
                                    {rowData[c]}
                                  </Text>
                                )}
                                {c === 'sex' && (
                                  <Text key={rowIndex} style={{ width: `${60 / col.length}%` }}>
                                    {rowData[c]}
                                  </Text>
                                )}
                                {c === 'color' && (
                                  <Text key={rowIndex} style={{ width: `${100 / col.length}%` }}>
                                    {rowData[c]}
                                  </Text>
                                )}
                                {c === 'species' && (
                                  <Text key={rowIndex} style={{ width: `${80 / col.length}%` }}>
                                    {rowData[c]}
                                  </Text>
                                )}
                                {c === 'neutered' && (
                                  <Text key={rowIndex} style={{ width: `${30 / col.length}%` }}>
                                    {rowData[c]}
                                  </Text>
                                )}
                                {c === 'vaccine_type' && (
                                  <Text key={rowIndex} style={{ width: `${120 / col.length}%` }}>
                                    {rowData[c]}
                                  </Text>
                                )}
                              </>
                            ))}
                          </View>
                        </>
                      ))}

                      <Text
                        style={styles.pageNumber}
                        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
                        fixed
                      />
                      <View style={styles.footer}>
                        <Text>Printed by: {`${user.name}`}</Text>

                        <Text>Printed on: {new Date().toLocaleString()}</Text>
                      </View>
                    </Page>
                  ))}
                </Document>
              </PDFViewer>
            </CCol>

            {reportLoading && <DefaultLoading />}
          </CRow>
        </CModalBody>
      </CModal>
    </>
  )
}

export default AntiRabiesVaccination
