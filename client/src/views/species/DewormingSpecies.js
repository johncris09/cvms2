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
      accessorKey: 'name',
      header: 'Name',
    },
  ]

  const dewormingSpecies = useQuery({
    queryFn: async () =>
      await api.get('deworming_species').then((response) => {
        return response.data
      }),
    queryKey: ['dewormingSpecies'],
    staleTime: Infinity,
    refetchInterval: 1000,
  })

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name of species is required'),
  })
  const form = useFormik({
    initialValues: {
      id: '',
      name: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.id) {
        await updateDewormingSpecies.mutate(values)
      } else {
        await insertDewormingSpecies.mutate(values)
      }
    },
  })

  const insertDewormingSpecies = useMutation({
    mutationKey: ['insertDewormingSpecies'],
    mutationFn: async (values) => {
      return await api.post('deworming_species/insert', values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      await queryClient.invalidateQueries({ queryKey: ['dewormingSpecies'] })
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const updateDewormingSpecies = useMutation({
    mutationFn: async (values) => {
      return await api.put('deworming_species/update/' + values.id, values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      setModalVisible(false)
      await queryClient.invalidateQueries({ queryKey: ['dewormingSpecies'] })
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
              <FontAwesomeIcon icon={faPlus} /> Add Species
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          <MaterialReactTable
            columns={column}
            data={!dewormingSpecies.isLoading && dewormingSpecies.data}
            state={{
              isLoading:
                dewormingSpecies.isLoading ||
                insertDewormingSpecies.isPending ||
                updateDewormingSpecies.isPending,
              isSaving:
                dewormingSpecies.isLoading ||
                insertDewormingSpecies.isPending ||
                updateDewormingSpecies.isPending,
              showLoadingOverlay:
                dewormingSpecies.isLoading ||
                insertDewormingSpecies.isPending ||
                updateDewormingSpecies.isPending,
              showProgressBars:
                dewormingSpecies.isLoading ||
                insertDewormingSpecies.isPending ||
                updateDewormingSpecies.isPending,
              showSkeletons:
                dewormingSpecies.isLoading ||
                insertDewormingSpecies.isPending ||
                updateDewormingSpecies.isPending,
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
                        name: row.original.name,
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
                              .delete('deworming_species/delete/' + id)
                              .then(async (response) => {
                                await queryClient.invalidateQueries({
                                  queryKey: ['dewormingSpecies'],
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
          />
        </CCardBody>
      </CCard>

      <CModal alignment="center" visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader onClose={() => setModalVisible(false)}>
          <CModalTitle> {isEnableEdit ? `Edit Species` : `Add New Species`}</CModalTitle>
        </CModalHeader>

        <CForm id="form" className="row g-3  " onSubmit={form.handleSubmit}>
          <CModalBody>
            <RequiredFieldNote />

            <CRow className="my-2">
              <CCol md={12}>
                <CFormInput
                  type="text"
                  label={requiredField('Name of species')}
                  name="name"
                  onChange={handleInputChange}
                  value={form.values.name}
                />
              </CCol>
              {form.touched.name && form.errors.name && (
                <CFormText className="text-danger">{form.errors.name}</CFormText>
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
        {/* { insertDewormingSpecies.isPending || updateDewormingSpecies.isPending) && <DefaultLoading />} */}
      </CModal>
    </>
  )
}

export default Course
