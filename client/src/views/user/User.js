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
  CFormSelect,
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
import { DeleteOutline, EditSharp, Key } from '@mui/icons-material'
import {
  DefaultLoading,
  RequiredFieldNote,
  api,
  requiredField,
  validationPrompt,
} from 'src/components/SystemConfiguration'
import * as Yup from 'yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const User = ({ cardTitle }) => {
  const queryClient = useQueryClient()
  const [modalVisible, setModalVisible] = useState(false)
  const [isEnableEdit, setIsEnableEdit] = useState(false)
  const [modalChangePasswordFormVisible, setModalChangePasswordFormVisible] = useState(false)

  const column = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'username',
      header: 'Username',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },

    {
      accessorKey: 'role_type',
      header: 'Role Type',
    },
  ]

  const user = useQuery({
    queryFn: async () =>
      await api.get('user').then((response) => {
        return response.data
      }),
    queryKey: ['user'],
    staleTime: Infinity,
    refetchInterval: 1000,
  })

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required'),
    username: Yup.string().required('Username is required'),
    password: !isEnableEdit && Yup.string().required('Pis required'),
    role_type: Yup.string().required('Role Type is required'),
  })
  const form = useFormik({
    initialValues: {
      id: '',
      name: '',
      email: '',
      username: '',
      password: '',
      role_type: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.id) {
        await updateUser.mutate(values)
      } else {
        await insertUser.mutate(values)
      }
    },
  })

  const insertUser = useMutation({
    mutationKey: ['insertUser'],
    mutationFn: async (values) => {
      return await api.post('user/insert', values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      await queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const updateUser = useMutation({
    mutationFn: async (values) => {
      return await api.put('user/update/' + values.id, values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      form.resetForm()
      setModalVisible(false)
      await queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    form.setFieldValue(name, value)
    updatePasswordForm.setFieldValue(name, value)
  }

  const updatePasswordForm = useFormik({
    initialValues: {
      id: '',
      password: '',
    },
    onSubmit: async (values) => {
      updatePassword.mutate(values)
    },
  })

  const updatePassword = useMutation({
    mutationFn: async (values) => {
      return await api.put('user/change_password/' + values.id, values)
    },
    onSuccess: async (response) => {
      if (response.data.status) {
        toast.success(response.data.message)
      }
      updatePasswordForm.resetForm()
      setModalChangePasswordFormVisible(false)
      await queryClient.invalidateQueries({ queryKey: ['user'] })
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })
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
            data={!user.isLoading && user.data}
            state={{
              isLoading: user.isLoading || insertUser.isPending || updateUser.isPending,
              isSaving: user.isLoading || insertUser.isPending || updateUser.isPending,
              showLoadingOverlay: user.isLoading || insertUser.isPending || updateUser.isPending,
              showProgressBars: user.isLoading || insertUser.isPending || updateUser.isPending,
              showSkeletons: user.isLoading || insertUser.isPending || updateUser.isPending,
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
                size: 130, //if using layoutMode that is not 'semantic', the columns will not auto-size, so you need to set the size manually
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
                        name: row.original.name,
                        email: row.original.email,
                        username: row.original.username,
                        role_type: row.original.role_type,
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
                              .delete('user/delete/' + id)
                              .then(async (response) => {
                                await queryClient.invalidateQueries({ queryKey: ['user'] })
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
                <Tooltip title="Change Password">
                  <IconButton
                    color="warning"
                    onClick={() => {
                      updatePasswordForm.setValues({
                        id: row.original.id,
                      })
                      setModalChangePasswordFormVisible(true)
                      // setIsEnableEdit(true)
                    }}
                  >
                    <Key />
                  </IconButton>
                </Tooltip>
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
          <CModalTitle>{isEnableEdit ? 'Edit User' : 'Add New User'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm className="row g-3" onSubmit={form.handleSubmit} style={{ position: 'relative' }}>
            <RequiredFieldNote />
            <CCol md={12}>
              <CFormInput
                type="text"
                label={requiredField('Name')}
                name="name"
                onChange={handleInputChange}
                value={form.values.name}
              />
              {form.touched.name && form.errors.name && (
                <CFormText className="text-danger">{form.errors.name}</CFormText>
              )}
              <CFormInput
                type="email"
                label={requiredField('Email')}
                name="email"
                onChange={handleInputChange}
                value={form.values.email}
              />
              {form.touched.email && form.errors.email && (
                <CFormText className="text-danger">{form.errors.email}</CFormText>
              )}
              <CFormInput
                type="text"
                label={requiredField('Username')}
                name="username"
                onChange={handleInputChange}
                value={form.values.username}
              />
              {form.touched.username && form.errors.username && (
                <CFormText className="text-danger">{form.errors.username}</CFormText>
              )}
              {!isEnableEdit && (
                <>
                  <CFormInput
                    type="password"
                    feedbackInvalid="Password is required."
                    label={requiredField('Password')}
                    name="password"
                    onChange={handleInputChange}
                    value={form.values.password}
                  />
                  {form.touched.password && form.errors.password && (
                    <CFormText className="text-danger">{form.errors.password}</CFormText>
                  )}
                </>
              )}

              <CFormSelect
                aria-label="Role Type"
                feedbackInvalid="Role Type is required."
                label={requiredField('Role Type')}
                name="role_type"
                onChange={handleInputChange}
                value={form.values.role_type}
              >
                <option value="">Select</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
              </CFormSelect>
              {form.touched.role_type && form.errors.role_type && (
                <CFormText className="text-danger">{form.errors.role_type}</CFormText>
              )}
            </CCol>

            <hr />
            <CCol xs={12}>
              <CButton color="primary" type="submit" className="float-end">
                {isEnableEdit ? 'Update' : 'Submit'}
              </CButton>
            </CCol>
          </CForm>
          {(insertUser.isPending || updateUser.isPending) && <DefaultLoading />}
        </CModalBody>
      </CModal>

      <CModal
        alignment="center"
        visible={modalChangePasswordFormVisible}
        onClose={() => setModalChangePasswordFormVisible(false)}
        backdrop="static"
        keyboard={false}
        size="md"
      >
        <CModalHeader>
          <CModalTitle>Change Password</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <RequiredFieldNote />
          <CForm
            className="row g-3  "
            onSubmit={updatePasswordForm.handleSubmit}
            style={{ position: 'relative' }}
          >
            <CCol md={12}>
              <CFormInput
                type="password"
                feedbackInvalid="Password is required."
                label={requiredField('Password')}
                name="password"
                onChange={handleInputChange}
                value={updatePasswordForm.values.password}
              />
              {updatePasswordForm.touched.password && updatePasswordForm.errors.password && (
                <CFormText className="text-danger">{updatePasswordForm.errors.password}</CFormText>
              )}
            </CCol>

            <hr />
            <CCol xs={12}>
              <CButton color="primary" type="submit" className="float-end">
                Change Password
              </CButton>
            </CCol>
          </CForm>
          {updatePasswordForm.isPending && <DefaultLoading />}
        </CModalBody>
      </CModal>
    </>
  )
}

export default User
