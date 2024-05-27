import React, { useState, useRef, useEffect } from 'react'
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
  CFormText,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
} from '@coreui/react'
import { Page, Text, View, Document, StyleSheet, PDFViewer, Font, Image } from '@react-pdf/renderer'
import { ExportToCsv } from 'export-to-csv'
import Select from 'react-select'
import MaterialReactTable from 'material-react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import logo from './../../assets/images/logo.png'
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
import {
  DefaultLoading,
  RequiredFieldNote,
  api,
  requiredField,
  validationPrompt,
} from 'src/components/SystemConfiguration'
import * as Yup from 'yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import moment from 'moment/moment'
import { jwtDecode } from 'jwt-decode'

const Deworming = ({ cardTitle }) => {
  const queryClient = useQueryClient()
  const selectSpeciesIputRef = useRef()
  const selectAddressIputRef = useRef()
  const selectTreatmentIputRef = useRef()
  const [modalVisible, setModalVisible] = useState(false)
  const [isEnableEdit, setIsEnableEdit] = useState(false)
  const [modalGenerateReportVisible, setModalGenerateReportVisible] = useState(false)
  const [reportLoading, setReportLoading] = useState(false)
  const [barangay, setBarangay] = useState('')
  const [date, setDate] = useState('')
  const [user, setUser] = useState([])
  const [chunks, setChunks] = useState([])

  useEffect(() => {
    setUser(jwtDecode(localStorage.getItem('cvmsToken')))
  }, [])
  const column = [
    {
      accessorKey: 'address',
      header: 'Address',
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
    },
    {
      accessorKey: 'date_deworming',
      header: 'Date Deworm',
    },
    {
      accessorKey: 'farmer_name',
      header: 'Farmer Name',
    },
    {
      accessorKey: 'female',
      header: 'Female',
    },
    {
      accessorKey: 'head_number',
      header: 'Head Number',
    },
    {
      accessorKey: 'male',
      header: 'Male',
    },
    {
      accessorKey: 'species',
      header: 'Species',
    },
    {
      accessorKey: 'treatment',
      header: 'Treatment',
    },
  ]

  const deworming = useQuery({
    queryFn: async () =>
      await api.get('deworming').then((response) => {
        return response.data
      }),
    queryKey: ['deworming'],
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
    queryKey: ['addressDeworming'],
    staleTime: Infinity,
  })

  const species = useQuery({
    queryFn: async () =>
      await api.get('deworming_species').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.name}`
          return { value, label }
        })
        return formattedData
      }),
    queryKey: ['dewormingSspecies'],
    staleTime: Infinity,
  })

  const treatment = useQuery({
    queryFn: async () =>
      await api.get('medication').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.medication}`
          return { value, label }
        })
        return formattedData
      }),
    queryKey: ['treatment'],
    staleTime: Infinity,
  })

  const validationSchema = Yup.object().shape({
    farmer_name: Yup.string().required('Name of Farmer is required'),
    address: Yup.string().required('Address is required'),
    date_deworming: Yup.string().required('Date of Deworming is required'),
    species: Yup.string().required('Species is required'),
    head_number: Yup.string().required('Number of Heads is required'),
    treatment: Yup.string().required('Treatment is required'),
    amount: Yup.string().required('Amount is required'),
  })
  const form = useFormik({
    initialValues: {
      id: '',
      farmer_name: '',
      address: '',
      date_deworming: '',
      species: '',
      head_number: '',
      female: '',
      male: '',
      treatment: '',
      amount: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.id) {
        await updateDeworming.mutate(values)
      } else {
        await insertDeworming.mutate(values)
      }
    },
  })

  const insertDeworming = useMutation({
    mutationKey: ['insertDeworming'],
    mutationFn: async (values) => {
      return await api.post('deworming/insert', values)
    },
    onSuccess: async (response) => {
      console.info(response.data)
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      await queryClient.invalidateQueries({ queryKey: ['deworming'] })
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const updateDeworming = useMutation({
    mutationFn: async (values) => {
      return await api.put('deworming/update/' + values.id, values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      setModalVisible(false)
      await queryClient.invalidateQueries({ queryKey: ['deworming'] })
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    form.setFieldValue(name, value)
    generateReportForm.setFieldValue(name, value)
  }

  const handleSelectChange = (selectedOption, ref) => {
    form.setFieldValue(ref.name, selectedOption ? selectedOption.value : '')
    generateReportForm.setFieldValue(ref.name, selectedOption ? selectedOption.value : '')
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
          Amount: item.amount,
          'Date Deworm': item.date_deworming,
          'Farmer Name': item.farmer_name,
          Female: item.female,
          'Head Number': item.head_number,
          Male: item.male,
          Species: item.species,
          Treatment: item.treatment,
        }
      })

    csvExporter.generateCsv(exportedData)
  }

  const handleExportData = () => {
    const exportedData =
      !deworming.isLoading &&
      deworming.data.map((item) => {
        return {
          Address: item.address,
          Amount: item.amount,
          'Date Deworm': item.date_deworming,
          'Farmer Name': item.farmer_name,
          Female: item.female,
          'Head Number': item.head_number,
          Male: item.male,
          Species: item.species,
          Treatment: item.treatment,
        }
      })
    csvExporter.generateCsv(exportedData)
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
      rowsPerPage: 10,
    },
    validationSchema: generateReportFormValidationSchema,
    onSubmit: async (values) => {
      setReportLoading(true)
      await api
        .get('deworming/generate_report/', { params: values })
        .then((response) => {
          if (response.data.length > 0) {
            const dividedArray = chunkArray(response.data, parseInt(values.rowsPerPage))
            setChunks(dividedArray)
          } else {
            toast.info('No Record Found')

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
          console.info(error.response)
          // toast.error(HandleError(error))
          // setBarangay('')
          // setDate('')
        })
        .finally(() => {
          setReportLoading(false)
        })
    },
  })

  const chunkArray = (arr, size) => {
    const slice = []
    for (let i = 0; i < arr.length; i += size) {
      slice.push(arr.slice(i, i + size))
    }

    return slice
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

  const col = ['no', 'farmer_name', 'species', 'head_number', 'treatment', 'amount', 'sex']

  return (
    <>
      <ToastContainer />
      <CCard className="mb-4">
        <CCardHeader>
          {cardTitle}
          <div className="float-end">
            <CButton
              size="sm"
              className="mx-1"
              color="primary"
              variant="outline"
              onClick={() => {
                generateReportForm.resetForm()
                setModalGenerateReportVisible(!modalGenerateReportVisible)
              }}
            >
              <FontAwesomeIcon icon={faFilePdf} /> Generate Report
            </CButton>
            <CButton
              size="sm"
              onClick={() => {
                form.resetForm()
                setIsEnableEdit(false)

                setModalVisible(!modalVisible)
              }}
            >
              <FontAwesomeIcon icon={faPlus} /> Add {cardTitle}
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          <MaterialReactTable
            columns={column}
            data={!deworming.isLoading && deworming.data}
            state={{
              isLoading:
                deworming.isLoading || insertDeworming.isPending || updateDeworming.isPending,
              isSaving:
                deworming.isLoading || insertDeworming.isPending || updateDeworming.isPending,
              showLoadingOverlay:
                deworming.isLoading || insertDeworming.isPending || updateDeworming.isPending,
              showProgressBars:
                deworming.isLoading || insertDeworming.isPending || updateDeworming.isPending,
              showSkeletons:
                deworming.isLoading || insertDeworming.isPending || updateDeworming.isPending,
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
                              .delete('deworming/delete/' + id)
                              .then(async (response) => {
                                await queryClient.invalidateQueries({ queryKey: ['deworming'] })
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
                  onClick={async () => await queryClient.resetQueries({ queryKey: ['deworming'] })}
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
          <CModalTitle>{isEnableEdit ? 'Edit Deworming' : 'Add New Deworming'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm
            className="row g-3  "
            onSubmit={form.handleSubmit}
            style={{ position: 'relative' }}
          >
            <RequiredFieldNote />
            <CCol md={12}>
              <CFormInput
                type="text"
                label={requiredField('Name of Farmer')}
                name="farmer_name"
                onChange={handleInputChange}
                value={form.values.farmer_name}
              />
              {form.touched.farmer_name && form.errors.farmer_name && (
                <CFormText className="text-danger">{form.errors.farmer_name}</CFormText>
              )}
            </CCol>

            <CCol md={7}>
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
            <CCol md={5}>
              <CFormInput
                type="date"
                feedbackInvalid="Date of Deworming is required."
                label={requiredField('Date of Deworming')}
                name="date_deworming"
                onChange={handleInputChange}
                value={form.values.date_deworming}
              />
            </CCol>

            <CCol md={7}>
              <CFormLabel>
                {
                  <>
                    {(species.isLoading || species.isFetching) && <CSpinner size="sm" />}
                    {requiredField(' Species')}
                  </>
                }
              </CFormLabel>
              <Select
                ref={selectSpeciesIputRef}
                value={
                  (!species.isLoading || !species.isFetching) &&
                  species.data?.find((option) => option.value === form.values.species)
                }
                onChange={handleSelectChange}
                options={(!species.isLoading || !species.isFetching) && species.data}
                name="species"
                isSearchable
                placeholder="Search..."
                isClearable
              />
              {form.touched.species && form.errors.species && (
                <CFormText className="text-danger">{form.errors.species}</CFormText>
              )}
            </CCol>
            <CCol md={5}>
              <CFormInput
                type="number"
                label={requiredField('Number of Heads')}
                name="head_number"
                onChange={handleInputChange}
                value={form.values.head_number}
              />
              {form.touched.head_number && form.errors.head_number && (
                <CFormText className="text-danger">{form.errors.head_number}</CFormText>
              )}
            </CCol>
            <CCol md={6}>
              <CFormInput
                type="number"
                feedbackInvalid="Number of Female is required."
                label="Number of Female"
                name="female"
                onChange={handleInputChange}
                value={form.values.female}
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                type="number"
                feedbackInvalid="Number of Male is required."
                label="Number of Male"
                name="male"
                onChange={handleInputChange}
                value={form.values.male}
              />
            </CCol>
            <CCol md={12}>
              <CFormLabel>
                {
                  <>
                    {(treatment.isLoading || treatment.isFetching) && <CSpinner size="sm" />}
                    {requiredField(' Treatment')}
                  </>
                }
              </CFormLabel>
              <Select
                ref={selectTreatmentIputRef}
                value={
                  (!treatment.isLoading || !treatment.isFetching) &&
                  treatment.data?.find((option) => option.value === form.values.treatment)
                }
                onChange={handleSelectChange}
                options={(!treatment.isLoading || !treatment.isFetching) && treatment.data}
                name="treatment"
                isSearchable
                placeholder="Search..."
                isClearable
              />
              {form.touched.treatment && form.errors.treatment && (
                <CFormText className="text-danger">{form.errors.treatment}</CFormText>
              )}
            </CCol>
            <CCol md={12}>
              <CFormInput
                type="text"
                label={requiredField('Amount')}
                name="amount"
                onChange={handleInputChange}
                value={form.values.amount}
              />
              {form.touched.amount && form.errors.amount && (
                <CFormText className="text-danger">{form.errors.amount}</CFormText>
              )}
            </CCol>

            <hr />
            <CCol xs={12}>
              <CButton color="primary" type="submit" className="float-end">
                {isEnableEdit ? 'Update' : 'Submit'}
              </CButton>
            </CCol>
          </CForm>
          {(insertDeworming.isPending || updateDeworming.isPending) && <DefaultLoading />}
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
                </CCol>

                <CCol md={12}>
                  <CFormLabel>
                    {
                      <>
                        {(species.isLoading || species.isFetching) && <CSpinner size="sm" />}
                        {' Species'}
                      </>
                    }
                  </CFormLabel>
                  <Select
                    ref={selectSpeciesIputRef}
                    value={
                      (!species.isLoading || !species.isFetching) &&
                      species.data?.find(
                        (option) => option.value === generateReportForm.values.species,
                      )
                    }
                    onChange={handleSelectChange}
                    options={(!species.isLoading || !species.isFetching) && species.data}
                    name="species"
                    isSearchable
                    placeholder="Search..."
                    isClearable
                  />
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
                            {c === 'farmer_name' && (
                              <Text
                                key={index}
                                style={{
                                  width: `${150 / col.length}%`,
                                }}
                              >
                                Farmer&lsquo;s Name
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
                            {c === 'head_number' && (
                              <Text
                                key={index}
                                style={{
                                  width: `${60 / col.length}%`,
                                }}
                              >
                                Head #
                              </Text>
                            )}
                            {c === 'treatment' && (
                              <Text
                                key={index}
                                style={{
                                  width: `${170 / col.length}%`,
                                }}
                              >
                                Treatment
                              </Text>
                            )}
                            {c === 'amount' && (
                              <Text
                                key={index}
                                style={{
                                  width: `${80 / col.length}%`,
                                }}
                              >
                                Amount
                              </Text>
                            )}
                            {c === 'sex' && (
                              <Text
                                key={index}
                                style={{
                                  width: `${80 / col.length}%`,
                                }}
                              >
                                Sex
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
                                {c === 'farmer_name' && (
                                  <Text key={rowIndex} style={{ width: `${150 / col.length}%` }}>
                                    {rowData[c]}
                                  </Text>
                                )}
                                {c === 'species' && (
                                  <Text
                                    key={rowIndex}
                                    style={{
                                      width: `${80 / col.length}%`,
                                    }}
                                  >
                                    {rowData[c]}
                                  </Text>
                                )}
                                {c === 'head_number' && (
                                  <Text
                                    key={rowIndex}
                                    style={{
                                      width: `${60 / col.length}%`,
                                    }}
                                  >
                                    {rowData[c]}
                                  </Text>
                                )}
                                {c === 'treatment' && (
                                  <Text key={rowIndex} style={{ width: `${170 / col.length}%` }}>
                                    {rowData[c]}
                                  </Text>
                                )}
                                {c === 'amount' && (
                                  <Text key={rowIndex} style={{ width: `${80 / col.length}%` }}>
                                    {rowData[c]}
                                  </Text>
                                )}
                                {c === 'sex' && (
                                  <Text key={rowIndex} style={{ width: `${80 / col.length}%` }}>
                                    {rowData['female'] !== null &&
                                      (rowData['female'] !== '' || rowData['female'] !== 0) &&
                                      `${rowData['female']} F `}
                                    {rowData['female'] !== null && rowData['male'] !== null && `& `}
                                    {rowData['male'] !== null &&
                                      (rowData['male'] !== '' || rowData['male'] !== 0) &&
                                      ` ${rowData['male']} M `}
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

export default Deworming
