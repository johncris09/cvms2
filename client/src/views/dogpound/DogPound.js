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
import MaterialReactTable from 'material-react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFileExcel,
  faFilePdf,
  faFilter,
  faPlus,
  faRefresh,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify'
import { Box, IconButton, ListItemIcon, MenuItem, Tooltip } from '@mui/material'
import { DeleteOutline, EditSharp } from '@mui/icons-material'
import { DefaultLoading } from 'src/components/Loading'
import { ExportToCsv } from 'export-to-csv'
import Select from 'react-select'
import { Page, Text, View, Document, StyleSheet, PDFViewer, Font, Image } from '@react-pdf/renderer'
import logo from './../../assets/images/logo.png'
import { jwtDecode } from 'jwt-decode'
import moment from 'moment/moment'
import * as Yup from 'yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  RequiredFieldNote,
  api,
  requiredField,
  validationPrompt,
} from 'src/components/SystemConfiguration'

const DogPound = () => {
  const queryClient = useQueryClient()
  const selectAddressIputRef = useRef()
  const [data, setData] = useState([])
  const [validated, setValidated] = useState(true)
  const [fetchDataLoading, setFetchDataLoading] = useState(true)
  const [operationLoading, setOperationLoading] = useState(false)
  const [modalFormVisible, setModalFormVisible] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [isEnableEdit, setIsEnableEdit] = useState(false)
  const [editId, setEditId] = useState('')
  const [modalGenerateReportVisible, setModalGenerateReportVisible] = useState(false)
  const [user, setUser] = useState([])
  const [reportLoading, setReportLoading] = useState(false)
  const [reportData, setReportData] = useState([])
  const [barangay, setBarangay] = useState('')
  const [date, setDate] = useState('')
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
      accessorKey: 'color',
      header: 'Color',
    },
    {
      accessorKey: 'date',
      header: 'Date',
    },
    {
      accessorKey: 'or_number',
      header: 'OR #',
    },
    {
      accessorKey: 'owner_name',
      header: 'Owner Name',
    },
    {
      accessorKey: 'pet_name',
      header: 'Pet Name',
    },
    {
      accessorKey: 'sex',
      header: 'Sex',
    },
    {
      accessorKey: 'size',
      header: 'Size',
    },
  ]

  const dogPound = useQuery({
    queryFn: async () =>
      await api.get('dog_pound').then((response) => {
        return response.data
      }),
    queryKey: ['dogPound'],
    staleTime: Infinity,
    // refetchInterval: 1000,
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

  const validationSchema = Yup.object().shape({
    or_number: Yup.string().required('OR # is required'),
    date: Yup.string().required('Date is required'),
    owner_name: Yup.string().required('Name of the Owner is required'),
    address: Yup.string().required('Address is required'),
    pet_name: Yup.string().required("Pet's Name is required"),
    color: Yup.string().required('Color is required'),
    sex: Yup.string().required('Sex is required'),
    size: Yup.string().required('Size is required'),
  })

  const form = useFormik({
    initialValues: {
      id: '',
      address: '',
      color: '',
      date: '',
      or_number: '',
      owner_name: '',
      pet_name: '',
      sex: '',
      size: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.info(values)
      if (values.id) {
        await updateDogPound.mutate(values)
      } else {
        await insertDogPound.mutate(values)
      }
      // const areAllFieldsFilled = Object.keys(values).every((key) => !!values[key])

      // if (areAllFieldsFilled) {
      //   setOperationLoading(true)
      //   if (!isEnableEdit) {
      //     // add new data
      //     await api
      //       .post('dog_pound/insert', values)
      //       .then((response) => {
      //         toast.success(response.data.message)
      //         form.resetForm()
      //         setValidated(false)
      //
      //       })
      //       .catch((error) => {
      //         toast.error(HandleError(error))
      //       })
      //       .finally(() => {
      //         setOperationLoading(false)
      //       })
      //   } else {
      //     // update
      //     setFetchDataLoading(true)
      //     await api
      //       .put('dog_pound/update/' + editId, values)
      //       .then((response) => {
      //         toast.success(response.data.message)
      //
      //         setValidated(false)
      //         setModalFormVisible(false)
      //       })
      //       .catch((error) => {
      //         console.info(error)
      //         // toast.error(HandleError(error))
      //       })
      //       .finally(() => {
      //         setOperationLoading(false)
      //         setFetchDataLoading(false)
      //       })
      //   }
      // } else {
      //   toast.warning('Please fill in all required fields.')
      //   setValidated(true)
      // }
    },
  })

  const insertDogPound = useMutation({
    mutationKey: ['insertDogPound'],
    mutationFn: async (values) => {
      return await api.post('dog_pound/insert', values)
    },
    onSuccess: async (response) => {
      console.info(response.data)
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      await queryClient.invalidateQueries({ queryKey: ['dogPound'] })
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const updateDogPound = useMutation({
    mutationFn: async (values) => {
      return await api.put('dog_pound/update/' + values.id, values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      setModalVisible(false)
      await queryClient.invalidateQueries({ queryKey: ['dogPound'] })
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

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
          Date: item.date,
          'OR #': item.or_number,
          'Owner Name': item.owner_name,
          'Pet Name': item.pet_name,
          Sex: item.sex,
          Size: item.size,
        }
      })

    csvExporter.generateCsv(exportedData)
  }

  const handleDeleteRows = (table) => {
    const rows = table.getSelectedRowModel().rows

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
          confirmButtonText: 'OK',
        }).then(async function (result) {
          if (result.isConfirmed) {
            if (result.value === process.env.REACT_APP_STATUS_APPROVED_KEY) {
              setFetchDataLoading(true)
              const selectedRows = rows
                .map((row) => row.original)
                .map((item) => {
                  return {
                    id: item.id,
                  }
                })
              api
                .delete('dog_pound/bulk_delete', { data: selectedRows })
                .then((response) => {
                  toast.success(response.data.message)
                })
                .catch((error) => {
                  // toast.error(HandleError(error))
                })
                .finally(() => {
                  setFetchDataLoading(false)

                  table.resetRowSelection()
                })
            } else {
              Swal.fire({
                title: 'Error!',
                html: 'Invalid Secrey Key',
                icon: 'error',
              })
            }
          }
        })
      }
    })
  }

  const handleExportData = () => {
    const exportedData =
      !dogPound.isLoading &&
      dogPound.data.map((item) => {
        return {
          Address: item.address,
          Color: item.color,
          Date: item.date,
          'OR #': item.or_number,
          'Owner Name': item.owner_name,
          'Pet Name': item.pet_name,
          Sex: item.sex,
          Size: item.size,
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

  const handleSelectChange = (selectedOption, ref) => {
    form.setFieldValue(ref.name, selectedOption ? selectedOption.value : '')
    generateReportForm.setFieldValue(ref.name, selectedOption ? selectedOption.value : '')
  }
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
      rowsPerPage: 30,
    },
    validationSchema: generateReportFormValidationSchema,
    onSubmit: async (values) => {
      setReportLoading(true)
      await api
        .get('dog_pound/generate_report/', { params: values })
        .then((response) => {
          console.info(response.data[0])
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
          console.info(error)
          // toast.error(HandleError(error))
          setBarangay('')
          setDate('')
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
  const ROWS_PER_PAGE = 28
  for (let i = 0; i < reportData.length; i += ROWS_PER_PAGE) {
    chunks.push(reportData.slice(i, i + ROWS_PER_PAGE))
  }

  const maxWidths = {
    counter: 0,
    or_number: 0,
    owner_name: 0,
    pet_name: 0,
    color: 0,
    sex: 0,
    size: 0,
    address: 0,
  }
  reportData.forEach((row) => {
    console.info(row)
    maxWidths.counter = Math.max(maxWidths.counter, `${row.index * ROWS_PER_PAGE}`.length)
    maxWidths.or_number = Math.max(maxWidths.or_number, row.or_number.length)
    maxWidths.owner_name = Math.max(maxWidths.owner_name, row.owner_name.length)
    maxWidths.pet_name = Math.max(maxWidths.pet_name, row.pet_name.length)
    maxWidths.color = Math.max(maxWidths.color, row.color.length)
    maxWidths.sex = Math.max(maxWidths.sex, row.sex.length)
    maxWidths.size = Math.max(maxWidths.size, row.size.length)
    maxWidths.address = Math.max(maxWidths.address, row.address.length)
  })

  const col = ['no', 'or_number', 'owner_name', 'pet_name', 'color', 'sex', 'size', 'address']

  return (
    <>
      <ToastContainer />

      <CCard className="mb-4" style={{ position: 'relative' }}>
        <CCardHeader>
          Dog Pound
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
              <FontAwesomeIcon icon={faPlus} /> Add Dog Pound
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          <MaterialReactTable
            columns={column}
            data={!dogPound.isLoading && dogPound.data}
            state={{
              isLoading: dogPound.isLoading || insertDogPound.isPending || updateDogPound.isPending,
              isSaving: dogPound.isLoading || insertDogPound.isPending || updateDogPound.isPending,
              showLoadingOverlay:
                dogPound.isLoading || insertDogPound.isPending || updateDogPound.isPending,
              showProgressBars:
                dogPound.isLoading || insertDogPound.isPending || updateDogPound.isPending,
              showSkeletons:
                dogPound.isLoading || insertDogPound.isPending || updateDogPound.isPending,
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
              <Box sx={{ display: 'flex', flexWrap: 'nowrap' }}>
                <Tooltip title="Edit">
                  <IconButton
                    color="warning"
                    onClick={() => {
                      setIsEnableEdit(true)
                      form.setValues({
                        id: row.original.id,
                        address: row.original.address_id,
                        color: row.original.color,
                        date: row.original.date,
                        or_number: row.original.or_number,
                        owner_name: row.original.owner_name,
                        pet_name: row.original.pet_name,
                        sex: row.original.sex,
                        size: row.original.size,
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
                              .delete('dog_pound/delete/' + id)
                              .then(async (response) => {
                                await queryClient.invalidateQueries({ queryKey: ['dpgPound'] })
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
                  onClick={async () => await queryClient.resetQueries({ queryKey: ['dogPound'] })}
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
          <CModalTitle>{isEnableEdit ? 'Edit Dog Pound' : 'Add New Dog Pound'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm className="row g-3 " onSubmit={form.handleSubmit} style={{ position: 'relative' }}>
            <RequiredFieldNote />
            <CCol md={6}>
              <CFormInput
                type="text"
                label={requiredField('OR #')}
                name="or_number"
                onChange={handleInputChange}
                value={form.values.or_number}
              />
              {form.touched.or_number && form.errors.or_number && (
                <CFormText className="text-danger">{form.errors.or_number}</CFormText>
              )}
            </CCol>
            <CCol md={6}>
              <CFormInput
                type="date"
                feedbackInvalid="Date is required."
                label={requiredField('Date')}
                name="date"
                onChange={handleInputChange}
                value={form.values.date}
              />

              {form.touched.date && form.errors.date && (
                <CFormText className="text-danger">{form.errors.date}</CFormText>
              )}
            </CCol>
            <CCol md={12}>
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
            <CCol md={12}>
              <CFormInput
                type="text"
                feedbackInvalid="Pet's Name is required."
                label={requiredField("Pet's Name")}
                name="pet_name"
                onChange={handleInputChange}
                value={form.values.pet_name}
              />

              {form.touched.pet_name && form.errors.pet_name && (
                <CFormText className="text-danger">{form.errors.pet_name}</CFormText>
              )}
            </CCol>
            <CCol md={4}>
              <CFormInput
                type="text"
                feedbackInvalid="Color is required."
                label={requiredField('Color')}
                name="color"
                onChange={handleInputChange}
                value={form.values.color}
              />

              {form.touched.color && form.errors.color && (
                <CFormText className="text-danger">{form.errors.color}</CFormText>
              )}
            </CCol>
            <CCol md={4}>
              <CFormSelect
                aria-label="Sex"
                feedbackInvalid="Sex is required."
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
              <CFormSelect
                aria-label="Size"
                feedbackInvalid="Size is required."
                label={requiredField('Size')}
                name="size"
                onChange={handleInputChange}
                value={form.values.size}
              >
                <option value="">Choose...</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </CFormSelect>

              {form.touched.size && form.errors.size && (
                <CFormText className="text-danger">{form.errors.size}</CFormText>
              )}
            </CCol>

            <hr />
            <CCol xs={12}>
              <CButton color="primary" type="submit" className="float-end">
                {isEnableEdit ? 'Update' : 'Submit'}
              </CButton>
            </CCol>
          </CForm>
          {(insertDogPound.isPending || updateDogPound.isPending) && <DefaultLoading />}
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
          <CRow style={{ position: 'relative' }}>
            <CCol md={4}>
              <CFormLabel>
                <FontAwesomeIcon icon={faFilter} /> Filter
              </CFormLabel>
              <CForm
                className="row g-3 needs-validation"
                onSubmit={generateReportForm.handleSubmit}
              >
                <RequiredFieldNote />
                <CCol md={6}>
                  <CFormInput
                    type="date"
                    label={requiredField('Start Date')}
                    name="start_date"
                    onChange={handleGenerateReportInputChange}
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
                    onChange={handleGenerateReportInputChange}
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
                  {form.touched.address && form.errors.address && (
                    <CFormText className="text-danger">{form.errors.address}</CFormText>
                  )}
                </CCol>
                <CCol md={12}>
                  <CFormInput
                    type="number"
                    label={requiredField('Rows per page')}
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
                    <CButton color="primary" variant="outline" type="submit">
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
                      {/* <View style={styles.info}>
                        <Text>Barangay: {barangay}</Text>
                        <Text>Date: {date}</Text>
                      </View> */}
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
                            {c === 'or_number' && (
                              <Text
                                key={index}
                                style={{
                                  width: `${90 / col.length}%`,
                                }}
                              >
                                OR #
                              </Text>
                            )}
                            {c === 'owner_name' && (
                              <Text
                                key={index}
                                style={{
                                  width: `${170 / col.length}%`,
                                }}
                              >
                                Owner&apos;s Name
                              </Text>
                            )}
                            {c === 'pet_name' && (
                              <Text
                                key={index}
                                style={{
                                  width: `${100 / col.length}%`,
                                }}
                              >
                                Pet&apos;s Name
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
                            {c === 'size' && (
                              <Text
                                key={index}
                                style={{
                                  width: `${80 / col.length}%`,
                                }}
                              >
                                Size
                              </Text>
                            )}
                            {c === 'address' && (
                              <Text
                                key={index}
                                style={{
                                  width: `${130 / col.length}%`,
                                }}
                              >
                                Address
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
                                {c === 'or_number' && (
                                  <Text
                                    key={rowIndex}
                                    style={{
                                      width: `${90 / col.length}%`,
                                    }}
                                  >
                                    {rowData[c]}
                                  </Text>
                                )}
                                {c === 'owner_name' && (
                                  <Text
                                    key={rowIndex}
                                    style={{
                                      width: `${170 / col.length}%`,
                                    }}
                                  >
                                    {rowData[c]}
                                  </Text>
                                )}
                                {c === 'pet_name' && (
                                  <Text
                                    key={rowIndex}
                                    style={{
                                      width: `${100 / col.length}%`,
                                    }}
                                  >
                                    {rowData[c]}
                                  </Text>
                                )}
                                {c === 'color' && (
                                  <Text
                                    key={rowIndex}
                                    style={{
                                      width: `${100 / col.length}%`,
                                    }}
                                  >
                                    {rowData[c]}
                                  </Text>
                                )}
                                {c === 'sex' && (
                                  <Text
                                    key={rowIndex}
                                    style={{
                                      width: `${80 / col.length}%`,
                                    }}
                                  >
                                    {rowData[c]}
                                  </Text>
                                )}
                                {c === 'size' && (
                                  <Text
                                    key={rowIndex}
                                    style={{
                                      width: `${80 / col.length}%`,
                                    }}
                                  >
                                    {rowData[c]}
                                  </Text>
                                )}
                                {c === 'address' && (
                                  <Text
                                    key={rowIndex}
                                    style={{
                                      width: `${130 / col.length}%`,
                                    }}
                                  >
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
          {/* <RequiredFieldNote /> */}
        </CModalBody>
      </CModal>
    </>
  )
}

export default DogPound
