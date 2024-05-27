import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CImage,
  CRow,
} from '@coreui/react'
import logo from './../../../assets/images/logo.png'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { DefaultLoading, api } from 'src/components/SystemConfiguration'
import { jwtDecode } from 'jwt-decode'
import * as Yup from 'yup'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const isTokenExist = localStorage.getItem('cvmsToken') !== null
    if (isTokenExist) {
      const user = jwtDecode(localStorage.getItem('cvmsToken'))

      if (user.school !== null) {
        navigate('/home', { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
    }
  }, [navigate])

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  })

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },

    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true)
      await api
        .post('login', values)
        .then((response) => {
          if (response.data.status) {
            toast.success(response.data.message)
            localStorage.setItem('cvmsToken', response.data.token)
            navigate('/dashboard', { replace: true })
          } else {
            toast.error(response.data.message)
          }
        })
        .catch((error) => {
          console.info(error.response)
          // toast.error(HandleError(error))
        })
        .finally(() => {
          setLoading(false)
        })
    },
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    formik.setFieldValue(name, value)
  }

  return (
    <>
      <ToastContainer />
      <div className=" min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol xs={12} sm={12} lg={6} xl={6}>
              <CCard
                className="p-4"
                style={{
                  boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                }}
              >
                <CCardBody>
                  <div className="text-center">
                    <CImage
                      rounded
                      src={logo}
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxWidth: '150px',
                        maxHeight: '150px',
                      }}
                    />
                  </div>

                  <CForm className="row g-3  " onSubmit={formik.handleSubmit}>
                    <h3 className="text-center">
                      Office of the City <br />
                      Veterinarian Monitoring System
                    </h3>
                    <p className="text-medium-emphasis text-center">Sign In to your account</p>

                    <CFormInput
                      className="text-center py-2"
                      type="text"
                      placeholder="Username"
                      name="username"
                      onChange={handleInputChange}
                      value={formik.values.username}
                      required
                    />
                    <CFormInput
                      className="text-center py-2"
                      type="password"
                      placeholder="Password"
                      name="password"
                      onChange={handleInputChange}
                      value={formik.values.password}
                      required
                    />
                    <CButton type="submit" color="primary">
                      Login
                    </CButton>
                  </CForm>
                  {loading && <DefaultLoading />}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: -5,
                      right: 33,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <p style={{ fontSize: '10px' }}>
                      Version: {process.env.REACT_APP_DATE_UPDATED}
                    </p>
                  </div>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    </>
  )
}

export default Login
