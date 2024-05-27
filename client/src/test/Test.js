import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
} from '@coreui/react'
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify'
import { ListItemIcon, MenuItem } from '@mui/material'
import MaterialReactTable from 'material-react-table'
import { DeleteOutline, EditSharp } from '@mui/icons-material'
import { api, decrypted, handleError, requiredField } from 'src/components/SystemConfiguration'

const Test = () => {
  const [loading, setLoading] = useState(false)
  const [validated, setValidated] = useState(false)
  const [data, setData] = useState([])
  const [isEnableEdit, setIsEnableEdit] = useState(false)
  const [editId, setEditId] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    api
      .get('test')
      .then((response) => {
        setData(decrypted(response.data))
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const formik = useFormik({
    initialValues: {
      user_id: '',
      group: '',
      created_at: '2022-11-13 18:40:41',
    },
    onSubmit: async (values) => {
      const areAllFieldsFilled = Object.keys(values).every((key) => !!values[key])

      if (areAllFieldsFilled) {
        setLoading(true)

        !isEnableEdit
          ? // add new data
            await api
              .post('test/insert', values)
              .then((response) => {
                toast.success(response.data.message)

                formik.resetForm()
                setValidated(false)
                fetchData()
              })
              .catch((error) => {
                toast.error(handleError(error))
              })
              .finally(() => {
                setLoading(false)
              })
          : // update data
            await api
              .put('test/update/' + editId, values)
              .then((response) => {
                toast.success(response.data.message)

                formik.resetForm()
                setValidated(false)
                fetchData()
              })
              .catch((error) => {
                toast.error(handleError(error))
              })
              .finally(() => {
                setLoading(false)
              })
      } else {
        setValidated(true)
      }
    },
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    formik.setFieldValue(name, value)
  }

  const column = [
    {
      accessorKey: 'user_id',
      header: 'User ID',
    },
    {
      accessorKey: 'group',
      header: 'Group',
    },
    {
      accessorKey: 'created_at',
      header: 'Created At',
    },
  ]

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <ToastContainer />
      <CContainer>
        <CRow>
          <CCol>
            <CCard className="p-4">
              <CCardBody>
                <>
                  <h2>Test Crud</h2>
                  <CForm
                    id="form"
                    className="row g-3 needs-validation mb-5"
                    noValidate
                    validated={validated}
                    onSubmit={formik.handleSubmit}
                  >
                    <CRow className="my-2">
                      <CCol md={12}>
                        <CFormInput
                          type="number"
                          feedbackInvalid="User ID is required."
                          label={requiredField('User ID')}
                          name="user_id"
                          onChange={handleInputChange}
                          value={formik.values.user_id}
                          required
                        />
                      </CCol>
                      <CCol md={12}>
                        <CFormSelect
                          feedbackInvalid="Group is required."
                          label={requiredField('Group')}
                          name="group"
                          onChange={handleInputChange}
                          value={formik.values.group}
                          required
                        >
                          <option value="">Select</option>
                          <option value="test">test user</option>
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                          <option value="superadmin">superadmin</option>
                        </CFormSelect>
                      </CCol>
                    </CRow>
                    <CRow className="mt-2">
                      <div className="d-grid gap-2">
                        <CButton color="primary" type="submit">
                          Submit
                        </CButton>
                      </div>
                    </CRow>
                  </CForm>

                  <MaterialReactTable
                    columns={column}
                    data={data}
                    enableRowVirtualization
                    enableColumnVirtualization
                    state={{
                      isLoading: loading,
                      isSaving: loading,
                      showLoadingOverlay: loading,
                      showProgressBars: loading,
                      showSkeletons: loading,
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
                    enableRowSelection
                    enableGrouping
                    enableSelectAll={true}
                    columnFilterDisplayMode="popover"
                    paginationDisplayMode="pages"
                    positionToolbarAlertBanner="bottom"
                    enableStickyHeader
                    enableStickyFooter
                    enableRowActions
                    selectAllMode="all"
                    initialState={{ density: 'compact' }}
                    renderRowActionMenuItems={({ closeMenu, row }) => [
                      <MenuItem
                        key={0}
                        onClick={async () => {
                          closeMenu()
                          let id = row.original.id

                          setEditId(id)
                          setIsEnableEdit(true)

                          formik.setValues({
                            ...formik.initialValues,
                            user_id: row.original.user_id,
                            group: row.original.group,
                          })
                        }}
                        sx={{ m: 0 }}
                      >
                        <ListItemIcon>
                          <EditSharp />
                        </ListItemIcon>
                        Edit
                      </MenuItem>,
                      <MenuItem
                        key={1}
                        onClick={() => {
                          closeMenu()

                          let id = row.original.id

                          setLoading(true)

                          api
                            .delete('test/delete/' + id)
                            .then((response) => {
                              fetchData()

                              toast.success(response.data.message)
                            })
                            .catch((error) => {
                              toast.error(handleError(error))
                            })
                            .finally(() => {
                              setLoading(false)
                            })
                        }}
                        sx={{ m: 0 }}
                      >
                        <ListItemIcon>
                          <DeleteOutline />
                        </ListItemIcon>
                        Delete
                      </MenuItem>,
                    ]}
                  />
                </>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Test
