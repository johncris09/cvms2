import React, { useState } from 'react'
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
  CFormText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import MaterialReactTable from 'material-react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
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

const Course = ({ cardTitle }) => {
  const queryClient = useQueryClient()
  const [modalVisible, setModalVisible] = useState(false)
  const [isEnableEdit, setIsEnableEdit] = useState(false)

  const column = [
    {
      accessorKey: 'medication',
      header: 'Medication',
    },
  ]

  const medication = useQuery({
    queryFn: async () =>
      await api.get('medication').then((response) => {
        return response.data
      }),
    queryKey: ['medication'],
    staleTime: Infinity,
    refetchInterval: 1000,
  })

  const validationSchema = Yup.object().shape({
    medication: Yup.string().required('Medication is required'),
  })
  const form = useFormik({
    initialValues: {
      id: '',
      medication: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.id) {
        await updateMedication.mutate(values)
      } else {
        await insertMedication.mutate(values)
      }
    },
  })

  const insertMedication = useMutation({
    mutationKey: ['insertMedication'],
    mutationFn: async (values) => {
      return await api.post('medication/insert', values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      await queryClient.invalidateQueries({ queryKey: ['medication'] })
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const updateMedication = useMutation({
    mutationFn: async (values) => {
      return await api.put('medication/update/' + values.id, values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      setModalVisible(false)
      await queryClient.invalidateQueries({ queryKey: ['medication'] })
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

  return (
    <>
      <ToastContainer autoClose={10000} />
      <CCard className="mb-4">
        <CCardHeader>
          {cardTitle}
          <div className="float-end">
            <CButton
              size="sm"
              color="primary"
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
            data={!medication.isLoading && medication.data}
            state={{
              isLoading:
                medication.isLoading || insertMedication.isPending || updateMedication.isPending,
              isSaving:
                medication.isLoading || insertMedication.isPending || updateMedication.isPending,
              showLoadingOverlay:
                medication.isLoading || insertMedication.isPending || updateMedication.isPending,
              showProgressBars:
                medication.isLoading || insertMedication.isPending || updateMedication.isPending,
              showSkeletons:
                medication.isLoading || insertMedication.isPending || updateMedication.isPending,
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
                size: 2, //if using layoutMode that is not 'semantic', the columns will not auto-size, so you need to set the size manually
                grow: false,
              },
            }}
            enableColumnResizing
            columnFilterDisplayMode="popover"
            paginationDisplayMode="pages"
            positionToolbarAlertBanner="bottom"
            enableStickyHeader
            enableStickyFooter
            enableRowActions
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
                        medication: row.original.medication,
                      })
                      setModalVisible(true)
                      setIsEnableEdit(true)
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
                              .delete('medication/delete/' + id)
                              .then(async (response) => {
                                await queryClient.invalidateQueries({ queryKey: ['medication'] })
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
          />
        </CCardBody>
      </CCard>

      <CModal alignment="center" visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader onClose={() => setModalVisible(false)}>
          <CModalTitle> {isEnableEdit ? `Edit ${cardTitle}` : `Add New ${cardTitle}`}</CModalTitle>
        </CModalHeader>

        <CForm id="form" className="row g-3  " onSubmit={form.handleSubmit}>
          <CModalBody>
            <RequiredFieldNote />

            <CRow className="my-2">
              <CCol md={12}>
                <CFormInput
                  type="text"
                  label={requiredField('Medication')}
                  name="medication"
                  onChange={handleInputChange}
                  value={form.values.medication}
                />
              </CCol>
              {form.touched.medication && form.errors.medication && (
                <CFormText className="text-danger">{form.errors.medication}</CFormText>
              )}
            </CRow>
          </CModalBody>

          <CModalFooter>
            <CButton
              className="btn btn-sm"
              color="secondary"
              onClick={() => setModalVisible(false)}
            >
              Close
            </CButton>
            <CButton className="btn btn-sm" color="primary" type="submit">
              {!isEnableEdit ? 'Save' : 'Update'}
            </CButton>
          </CModalFooter>
        </CForm>
        {(insertMedication.isPending || updateMedication.isPending) && <DefaultLoading />}
      </CModal>
    </>
  )
}

export default Course
