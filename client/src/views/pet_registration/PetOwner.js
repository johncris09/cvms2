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
  CFormSelect,
  CFormText,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import { ExportToCsv } from 'export-to-csv'
import MaterialReactTable from 'material-react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel, faPlus, faRefresh } from '@fortawesome/free-solid-svg-icons'
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
import { jwtDecode } from 'jwt-decode'

const PetOwner = ({ cardTitle }) => {
  const queryClient = useQueryClient()
  const [modalVisible, setModalVisible] = useState(false)
  const [user, setUser] = useState([])

  useEffect(() => {
    setUser(jwtDecode(localStorage.getItem('cvmsToken')))
  }, [])
  const column = [
    {
      accessorKey: 'last_name',
      header: 'Last Name',
    },
    {
      accessorKey: 'first_name',
      header: 'First Name',
    },
    {
      accessorKey: 'middle_name',
      header: 'Middle Name',
    },
    {
      accessorKey: 'suffix',
      header: 'Suffix',
    },
    {
      accessorKey: 'birthdate',
      header: 'Birthdate',
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
    },
    {
      accessorKey: 'contact_number',
      header: 'Contact #',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'address',
      header: 'Address',
    },
  ]

  const petOwner = useQuery({
    queryFn: async () =>
      await api.get('pet_owner').then((response) => {
        return response.data
      }),
    queryKey: ['petOwner'],
    staleTime: Infinity,
  })

  const validationSchema = Yup.object().shape({
    last_name: Yup.string().required('Last Name is required'),
    first_name: Yup.string().required('First Name is required'),
    birthdate: Yup.string().required('Birthdate is required'),
    gender: Yup.string().required('Gender is required'),
    // contact_number: Yup.string().required('Contact # is required'),
    //  email: Yup.string().required('Email is required'),
    address: Yup.string().required('Address is required'),
  })
  const form = useFormik({
    initialValues: {
      id: '',
      last_name: '',
      first_name: '',
      middle_name: '',
      suffix: '',
      birthdate: '',
      gender: '',
      contact_number: '',
      email: '',
      address: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.id) {
        await updatePetOwner.mutate(values)
      } else {
        await insertPetOwner.mutate(values)
      }
    },
  })

  const insertPetOwner = useMutation({
    mutationKey: ['insertPetOwner'],
    mutationFn: async (values) => {
      return await api.post('pet_owner/insert', values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
        form.resetForm()
        await queryClient.invalidateQueries({ queryKey: ['petOwner'] })
      } else {
        toast.error(response.data.message)
      }
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const updatePetOwner = useMutation({
    mutationFn: async (values) => {
      return await api.put('pet_owner/update/' + values.id, values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
        form.resetForm()
        setModalVisible(false)
        await queryClient.invalidateQueries({ queryKey: ['petOwner'] })
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
    const { name, value } = e.target
    form.setFieldValue(name, value)
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
          'Last Name': item.last_name,
          'First Name': item.first_name,
          'Middle Name': item.middle_name,
          suffix: item.suffix,
          Birthdate: item.birthdate,
          Gender: item.gender,
          'Contact #': item.contact_number,
          Email: item.email,
          Address: item.address,
        }
      })

    csvExporter.generateCsv(exportedData)
  }

  const handleExportData = () => {
    const exportedData =
      !petOwner.isLoading &&
      petOwner.data.map((item) => {
        return {
          'Last Name': item.last_name,
          'First Name': item.first_name,
          'Middle Name': item.middle_name,
          suffix: item.suffix,
          Birthdate: item.birthdate,
          Gender: item.gender,
          'Contact #': item.contact_number,
          Email: item.email,
          Address: item.address,
        }
      })
    csvExporter.generateCsv(exportedData)
  }

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
                form.resetForm()

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
            data={!petOwner.isLoading && petOwner.data}
            state={{
              isLoading: petOwner.isLoading || insertPetOwner.isPending || updatePetOwner.isPending,
              isSaving: petOwner.isLoading || insertPetOwner.isPending || updatePetOwner.isPending,
              showLoadingOverlay:
                petOwner.isLoading || insertPetOwner.isPending || updatePetOwner.isPending,
              showProgressBars:
                petOwner.isLoading || insertPetOwner.isPending || updatePetOwner.isPending,
              showSkeletons:
                petOwner.isLoading || insertPetOwner.isPending || updatePetOwner.isPending,
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
                      form.setValues({
                        id: row.original.id,
                        last_name: row.original.last_name,
                        first_name: row.original.first_name,
                        middle_name: row.original.middle_name,
                        suffix: row.original.suffix,
                        birthdate: row.original.birthdate,
                        gender: row.original.gender,
                        contact_number: row.original.contact_number,
                        email: row.original.email,
                        address: row.original.address,
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
                              .delete('pet_owner/delete/' + id)
                              .then(async (response) => {
                                await queryClient.invalidateQueries({ queryKey: ['petOwner'] })
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
                  onClick={async () => await queryClient.resetQueries({ queryKey: ['petOwner'] })}
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
          <CModalTitle>{form.values.id ? 'Edit Pet Owner' : 'Add New Pet Owner'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm
            className="row g-3  "
            onSubmit={form.handleSubmit}
            style={{ position: 'relative' }}
          >
            <RequiredFieldNote />
            <CCol md={4}>
              <CFormInput
                type="text"
                label={requiredField('Last Name')}
                name="last_name"
                onChange={handleInputChange}
                value={form.values.last_name}
                invalid={form.touched.last_name && form.errors.last_name}
              />
              {form.touched.last_name && form.errors.last_name && (
                <CFormText className="text-danger">{form.errors.last_name}</CFormText>
              )}
            </CCol>
            <CCol md={4}>
              <CFormInput
                type="text"
                label={requiredField('First Name')}
                name="first_name"
                onChange={handleInputChange}
                value={form.values.first_name}
                invalid={form.touched.first_name && form.errors.first_name}
              />
              {form.touched.first_name && form.errors.first_name && (
                <CFormText className="text-danger">{form.errors.first_name}</CFormText>
              )}
            </CCol>
            <CCol md={3}>
              <CFormInput
                type="text"
                label="Middle Name"
                name="middle_name"
                onChange={handleInputChange}
                value={form.values.middle_name}
              />
            </CCol>
            <CCol md={1}>
              <CFormInput
                type="text"
                label="Suffix"
                name="suffix"
                onChange={handleInputChange}
                value={form.values.suffix}
              />
            </CCol>

            <CCol md={3}>
              <CFormInput
                type="date"
                label={requiredField('Birthdate')}
                name="birthdate"
                onChange={handleInputChange}
                value={form.values.birthdate}
                invalid={form.touched.birthdate && form.errors.birthdate}
              />
              {form.touched.birthdate && form.errors.birthdate && (
                <CFormText className="text-danger">{form.errors.birthdate}</CFormText>
              )}
            </CCol>
            <CCol md={3}>
              <CFormSelect
                feedbackInvalid="Gender is required."
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
            </CCol>
            <CCol md={3}>
              <CFormInput
                type="text"
                label="Contact #"
                name="contact_number"
                onChange={handleInputChange}
                value={form.values.contact_number}
              />
            </CCol>
            <CCol md={3}>
              <CFormInput
                type="text"
                label="Email"
                name="email"
                onChange={handleInputChange}
                value={form.values.email}
              />
            </CCol>
            <CCol md={12}>
              <CFormInput
                type="text"
                label={requiredField('Address')}
                name="address"
                onChange={handleInputChange}
                value={form.values.address}
                invalid={form.touched.address && form.errors.address}
              />
              {form.touched.address && form.errors.address && (
                <CFormText className="text-danger">{form.errors.address}</CFormText>
              )}
            </CCol>

            <hr />
            <CCol xs={12}>
              <CButton color="primary" type="submit" className="float-end">
                {form.values.id ? 'Update' : 'Submit'}
              </CButton>
            </CCol>
          </CForm>
          {(insertPetOwner.isPending || updatePetOwner.isPending) && <DefaultLoading />}
        </CModalBody>
      </CModal>
    </>
  )
}

export default PetOwner
