import React, { useState, useEffect, useRef } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormText,
  CRow,
  CSpinner,
} from '@coreui/react'
import Select from 'react-select'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCancel, faFilter } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import { CChartBar } from '@coreui/react-chartjs'
import { jwtDecode } from 'jwt-decode'
import 'animate.css'
import {
  api,
  requiredField,
  RequiredFieldNote,
  DefaultLoading,
} from 'src/components/SystemConfiguration'
import * as Yup from 'yup'
import 'intro.js/introjs.css'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const Dashboard = ({ cardTitle }) => {
  const selectAntiRabiesSpeciesIputRef = useRef()
  const selectDewormingSpeciesIputRef = useRef()
  const selectTreatmentIputRef = useRef()
  const queryClient = useQueryClient()

  // Dog Pound
  const dogPound = useQuery({
    queryFn: async () =>
      await Promise.all([
        api.get('dog_pound/get_gender_by_barangay'),
        api.get('dog_pound/get_total_gender'),
      ]).then((responses) => {
        const response = responses.map((response) => response.data)
        return {
          dogPound: response[0],
          dogPoundGender: response[1],
        }
      }),
    queryKey: ['dogPoundByBarangay'],
    // refetchInterval: refetchInterval ? 1000 : false,
    staleTime: Infinity,
  })

  const dogPoundFilterFormValidationSchema = Yup.object().shape({
    start_date: Yup.string().required('Start date is required'),
    end_date: Yup.string().required('Edn Date is required'),
  })
  const dogPoundFilterForm = useFormik({
    initialValues: {
      start_date: '',
      end_date: '',
    },
    validationSchema: dogPoundFilterFormValidationSchema,
    onSubmit: async (values) => {
      dogPoundFilter.mutate(values)
    },
  })

  const dogPoundFilter = useMutation({
    mutationFn: async (values) => {
      return await Promise.all([
        api.post('dog_pound/filter_gender_by_barangay', values),
        api.post('dog_pound/filter_total_gender', values),
      ])
    },
    onSuccess: async (responses) => {
      const response = responses.map((response) => response.data)

      await queryClient.setQueryData(['dogPoundByBarangay'], {
        dogPound: response[0],
        dogPoundGender: response[1],
      })
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const handleRemoveDogPoundFilter = async () => {
    dogPoundFilterForm.resetForm()
    await queryClient.invalidateQueries({ queryKey: ['dogPoundByBarangay'] })
  }

  // Anti Rabies Vaccination

  const antiRabiesVaccination = useQuery({
    queryFn: async () =>
      await Promise.all([
        api.get('anti_rabies_vaccination/get_gender_by_barangay'),
        api.get('anti_rabies_vaccination/get_total_gender'),
      ]).then((responses) => {
        const response = responses.map((response) => response.data)
        return {
          antiRabiesVaccination: response[0],
          antiRabiesVaccinationGender: response[1],
        }
      }),
    queryKey: ['antiRabiesVaccinationByBarangay'],
    // refetchInterval: refetchInterval ? 1000 : false,
    staleTime: Infinity,
  })
  const validationSchemaAntiRabiesVaccinationFilterForm = Yup.object().shape({
    species: Yup.string().required('Species is required'),
    start_date: Yup.string().required('Start Date Type is required'),
    end_date: Yup.string().required('End Date Type is required'),
  })
  const antiRabiesVaccinationFilterForm = useFormik({
    initialValues: {
      species: '',
      neutered: '',
      start_date: '',
      end_date: '',
    },
    validationSchema: validationSchemaAntiRabiesVaccinationFilterForm,
    onSubmit: async (values) => {
      antiRabiesVaccinationFilter.mutate(values)
    },
  })

  const antiRabiesVaccinationFilter = useMutation({
    mutationFn: async (values) => {
      return await Promise.all([
        api.post('anti_rabies_vaccination/filter_gender_by_barangay', values),
        api.post('anti_rabies_vaccination/filter_total_gender', values),
      ])
    },
    onSuccess: async (responses) => {
      const response = responses.map((response) => response.data)

      await queryClient.setQueryData(['antiRabiesVaccinationByBarangay'], {
        antiRabiesVaccination: response[0],
        antiRabiesVaccinationGender: response[1],
      })
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const handleRemoveAntiRabiesVaccinationFilter = async () => {
    antiRabiesVaccinationFilterForm.resetForm()
    await queryClient.invalidateQueries({ queryKey: ['antiRabiesVaccinationByBarangay'] })
  }

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

  const handleSelectChange = (selectedOption, ref) => {
    // form.setFieldValue(ref.name, selectedOption ? selectedOption.value : '')
    antiRabiesVaccinationFilterForm.setFieldValue(
      ref.name,
      selectedOption ? selectedOption.value : '',
    )
    dewormingFilterForm.setFieldValue(ref.name, selectedOption ? selectedOption.value : '')
  }

  // Deworming

  const deworming = useQuery({
    queryFn: async () =>
      await Promise.all([
        api.get('deworming/get_gender_by_barangay'),
        api.get('deworming/get_total_gender'),
      ]).then((responses) => {
        const response = responses.map((response) => response.data)

        return {
          deworming: response[0],
          dewormingGender: response[1],
        }
      }),
    queryKey: ['dewormingByBarangay'],
    // refetchInterval: refetchInterval ? 1000 : false,
    staleTime: Infinity,
  })

  const validationSchemaDewormingFilterForm = Yup.object().shape({
    species: Yup.string().required('Species is required'),

    start_date: Yup.string().required('Start Date Type is required'),
    end_date: Yup.string().required('End Date Type is required'),
  })
  const dewormingFilterForm = useFormik({
    initialValues: {
      species: '',
      treatment: '',
      start_date: '',
      end_date: '',
    },
    validationSchema: validationSchemaDewormingFilterForm,
    onSubmit: async (values) => {
      dewormingFilter.mutate(values)
    },
  })

  const dewormingFilter = useMutation({
    mutationFn: async (values) => {
      return await Promise.all([
        api.post('deworming/filter_gender_by_barangay', values),
        api.post('deworming/filter_total_gender', values),
      ])
    },
    onSuccess: async (responses) => {
      const response = responses.map((response) => response.data)

      await queryClient.setQueryData(['dewormingByBarangay'], {
        deworming: response[0],
        dewormingGender: response[1],
      })
    },
    onError: (error) => {
      console.info(error.response.data)
      // toast.error(error.response.data.message)
    },
  })

  const handleRemoveDewormingFilter = async () => {
    dewormingFilterForm.resetForm()
    await queryClient.invalidateQueries({ queryKey: ['dewormingByBarangay'] })
  }

  const dewormingSpecies = useQuery({
    queryFn: async () =>
      await api.get('deworming_species').then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.id
          const label = `${item.name}`
          return { value, label }
        })
        return formattedData
      }),
    queryKey: ['dewormingSpecies'],
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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    dogPoundFilterForm.setFieldValue(name, value)
    antiRabiesVaccinationFilterForm.setFieldValue(name, value)
    dewormingFilterForm.setFieldValue(name, value)
  }
  return (
    <>
      <CRow>
        <CCol md={12}>
          <CCard className="mb-4">
            <CCardHeader>Dog Pound</CCardHeader>
            <CCardBody>
              <CRow className="justify-content-center">
                <CCol sm={6}>
                  <h6>
                    <FontAwesomeIcon icon={faFilter} /> Filter
                  </h6>
                  <CForm
                    id="filterForm"
                    className="row g-3  mb-4"
                    onSubmit={dogPoundFilterForm.handleSubmit}
                    style={{ position: 'relative' }}
                  >
                    <RequiredFieldNote />

                    <CRow className="my-1">
                      <CCol md={6}>
                        <CFormInput
                          type="date"
                          label={requiredField('Start Date')}
                          name="start_date"
                          onChange={handleInputChange}
                          value={dogPoundFilterForm.values.start_date}
                        />
                        {dogPoundFilterForm.touched.start_date &&
                          dogPoundFilterForm.errors.start_date && (
                            <CFormText className="text-danger">
                              {dogPoundFilterForm.errors.start_date}
                            </CFormText>
                          )}
                      </CCol>

                      <CCol md={6}>
                        <CFormInput
                          type="date"
                          label={requiredField('End Date')}
                          name="end_date"
                          onChange={handleInputChange}
                          value={dogPoundFilterForm.values.end_date}
                        />

                        {dogPoundFilterForm.touched.end_date &&
                          dogPoundFilterForm.errors.end_date && (
                            <CFormText className="text-danger">
                              {dogPoundFilterForm.errors.end_date}
                            </CFormText>
                          )}
                      </CCol>
                      <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-2">
                        <CButton
                          color="danger"
                          size="sm"
                          variant="outline"
                          onClick={handleRemoveDogPoundFilter}
                        >
                          <FontAwesomeIcon icon={faCancel} /> Remove Filter
                        </CButton>
                        <CButton color="primary" size="sm" type="submit">
                          <FontAwesomeIcon icon={faFilter} /> Filter
                        </CButton>
                      </div>
                    </CRow>
                  </CForm>
                </CCol>
              </CRow>
              <hr />
              <CRow>
                <CCol style={{ position: 'relative' }}>
                  <CChartBar
                    height={120}
                    data={!dogPound.isLoading && dogPound.data.dogPound}
                    labels="dog-pound"
                  />
                </CCol>
                {(dogPound.isFetching || dogPound.isLoading || dogPoundFilter.isPending) && (
                  <DefaultLoading />
                )}
              </CRow>
            </CCardBody>
            <CCardFooter>
              <span className="text-muted">
                Female: {!dogPound.isFetching && dogPound.data.dogPoundGender.female}
                <br />
                Male: {!dogPound.isFetching && dogPound.data.dogPoundGender.male}
              </span>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol md={12} style={{ position: 'relative' }}>
          <CCard className="mb-4">
            <CCardHeader>
              Anti-Rabies Vaccination{' '}
              {antiRabiesVaccinationFilterForm.values.species && (
                <strong>
                  {JSON.stringify(selectAntiRabiesSpeciesIputRef.current.props.value?.label)}
                </strong>
              )}
            </CCardHeader>
            <CCardBody>
              <CRow className="justify-content-center">
                <CCol sm={6}>
                  <h6>
                    <FontAwesomeIcon icon={faFilter} /> Filter
                  </h6>
                  <CForm
                    className="row g-3  mb-4"
                    onSubmit={antiRabiesVaccinationFilterForm.handleSubmit}
                    style={{ position: 'relative' }}
                  >
                    <RequiredFieldNote />

                    <CRow className="my-1">
                      <CCol md={12}>
                        <CFormLabel>
                          {
                            <>
                              {(antiRabiesSpecies.isLoading || antiRabiesSpecies.isFetching) && (
                                <CSpinner size="sm" />
                              )}
                              {requiredField(' Species')}
                            </>
                          }
                        </CFormLabel>
                        <Select
                          ref={selectAntiRabiesSpeciesIputRef}
                          value={
                            (!antiRabiesSpecies.isLoading || !antiRabiesSpecies.isFetching) &&
                            antiRabiesSpecies.data?.find(
                              (option) =>
                                option.value === antiRabiesVaccinationFilterForm.values.species,
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

                        {antiRabiesVaccinationFilterForm.touched.species &&
                          antiRabiesVaccinationFilterForm.errors.species && (
                            <CFormText className="text-danger">
                              {antiRabiesVaccinationFilterForm.errors.species}
                            </CFormText>
                          )}
                      </CCol>
                      <CCol md={12}>
                        <CFormSelect
                          aria-label="Neutered"
                          label="Neutered"
                          name="neutered"
                          onChange={handleInputChange}
                          value={antiRabiesVaccinationFilterForm.values.neutered}
                        >
                          <option value="">Choose...</option>
                          <option value="Y">Yes</option>
                          <option value="N">No</option>
                        </CFormSelect>
                        {antiRabiesVaccinationFilterForm.touched.neutered &&
                          antiRabiesVaccinationFilterForm.errors.neutered && (
                            <CFormText className="text-danger">
                              {antiRabiesVaccinationFilterForm.errors.neutered}
                            </CFormText>
                          )}
                      </CCol>
                      <CCol md={6}>
                        <CFormInput
                          type="date"
                          label={requiredField('Start Date')}
                          name="start_date"
                          onChange={handleInputChange}
                          value={antiRabiesVaccinationFilterForm.values.start_date}
                        />
                        {antiRabiesVaccinationFilterForm.touched.start_date &&
                          antiRabiesVaccinationFilterForm.errors.start_date && (
                            <CFormText className="text-danger">
                              {antiRabiesVaccinationFilterForm.errors.start_date}
                            </CFormText>
                          )}
                      </CCol>

                      <CCol md={6}>
                        <CFormInput
                          type="date"
                          label={requiredField('End Date')}
                          name="end_date"
                          onChange={handleInputChange}
                          value={antiRabiesVaccinationFilterForm.values.end_date}
                        />
                        {antiRabiesVaccinationFilterForm.touched.end_date &&
                          antiRabiesVaccinationFilterForm.errors.end_date && (
                            <CFormText className="text-danger">
                              {antiRabiesVaccinationFilterForm.errors.end_date}
                            </CFormText>
                          )}
                      </CCol>
                      <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-2">
                        <CButton
                          color="danger"
                          size="sm"
                          variant="outline"
                          onClick={handleRemoveAntiRabiesVaccinationFilter}
                        >
                          <FontAwesomeIcon icon={faCancel} /> Remove Filter
                        </CButton>
                        <CButton color="primary" size="sm" type="submit">
                          <FontAwesomeIcon icon={faFilter} /> Filter
                        </CButton>
                      </div>
                    </CRow>
                  </CForm>
                </CCol>
              </CRow>
              <hr />

              <CRow>
                <CCol style={{ position: 'relative' }}>
                  <CChartBar
                    height={120}
                    data={
                      !antiRabiesVaccination.isLoading &&
                      antiRabiesVaccination.data.antiRabiesVaccination
                    }
                    labels="anti-rabies vaccination"
                  />
                </CCol>
                {(antiRabiesVaccination.isFetching || antiRabiesVaccination.isLoading) && (
                  <DefaultLoading />
                )}
              </CRow>
            </CCardBody>
            <CCardFooter>
              <span className="text-muted">
                Female:
                {!antiRabiesVaccination.isFetching &&
                  antiRabiesVaccination.data.antiRabiesVaccinationGender.female}
                <br />
                Male:
                {!antiRabiesVaccination.isFetching &&
                  antiRabiesVaccination.data.antiRabiesVaccinationGender.male}
              </span>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol md={12} style={{ position: 'relative' }}>
          <CCard className="mb-4">
            <CCardHeader>
              Deworming{' '}
              {dewormingFilterForm.values.species && (
                <strong>
                  {JSON.stringify(selectDewormingSpeciesIputRef.current.props.value?.label)}
                </strong>
              )}
            </CCardHeader>
            <CCardBody>
              <CRow className="justify-content-center">
                <CCol sm={6}>
                  <h6>
                    <FontAwesomeIcon icon={faFilter} /> Filter
                  </h6>
                  <CForm
                    className="row g-3 mb-4"
                    onSubmit={dewormingFilterForm.handleSubmit}
                    style={{ position: 'relative' }}
                  >
                    <RequiredFieldNote />

                    <CRow className="my-1">
                      <CCol md={12}>
                        <CFormLabel>
                          {
                            <>
                              {(dewormingSpecies.isLoading || dewormingSpecies.isFetching) && (
                                <CSpinner size="sm" />
                              )}
                              {requiredField(' Species')}
                            </>
                          }
                        </CFormLabel>
                        <Select
                          ref={selectDewormingSpeciesIputRef}
                          value={
                            (!dewormingSpecies.isLoading || !dewormingSpecies.isFetching) &&
                            dewormingSpecies.data?.find(
                              (option) => option.value === dewormingFilterForm.values.species,
                            )
                          }
                          onChange={handleSelectChange}
                          options={
                            (!dewormingSpecies.isLoading || !dewormingSpecies.isFetching) &&
                            dewormingSpecies.data
                          }
                          name="species"
                          isSearchable
                          placeholder="Search..."
                          isClearable
                        />
                        {dewormingFilterForm.touched.species &&
                          dewormingFilterForm.errors.species && (
                            <CFormText className="text-danger">
                              {dewormingFilterForm.errors.species}
                            </CFormText>
                          )}
                      </CCol>
                      <CCol md={12}>
                        <CFormLabel>
                          {
                            <>
                              {(treatment.isLoading || treatment.isFetching) && (
                                <CSpinner size="sm" />
                              )}
                              {' Treatment'}
                            </>
                          }
                        </CFormLabel>
                        <Select
                          ref={selectTreatmentIputRef}
                          value={
                            (!treatment.isLoading || !treatment.isFetching) &&
                            treatment.data?.find(
                              (option) => option.value === dewormingFilterForm.values.treatment,
                            )
                          }
                          onChange={handleSelectChange}
                          options={
                            (!treatment.isLoading || !treatment.isFetching) && treatment.data
                          }
                          name="treatment"
                          isSearchable
                          placeholder="Search..."
                          isClearable
                        />
                        {dewormingFilterForm.touched.treatment &&
                          dewormingFilterForm.errors.treatment && (
                            <CFormText className="text-danger">
                              {dewormingFilterForm.errors.treatment}
                            </CFormText>
                          )}
                      </CCol>
                      <CCol md={6}>
                        <CFormInput
                          type="date"
                          label={requiredField('Start Date')}
                          name="start_date"
                          onChange={handleInputChange}
                          value={dewormingFilterForm.values.start_date}
                        />
                        {dewormingFilterForm.touched.start_date &&
                          dewormingFilterForm.errors.start_date && (
                            <CFormText className="text-danger">
                              {dewormingFilterForm.errors.start_date}
                            </CFormText>
                          )}
                      </CCol>

                      <CCol md={6}>
                        <CFormInput
                          type="date"
                          label={requiredField('End Date')}
                          name="end_date"
                          onChange={handleInputChange}
                          value={dewormingFilterForm.values.end_date}
                        />
                        {dewormingFilterForm.touched.end_date &&
                          dewormingFilterForm.errors.end_date && (
                            <CFormText className="text-danger">
                              {dewormingFilterForm.errors.end_date}
                            </CFormText>
                          )}
                      </CCol>
                      <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-2">
                        <CButton
                          color="danger"
                          size="sm"
                          variant="outline"
                          onClick={handleRemoveDewormingFilter}
                        >
                          <FontAwesomeIcon icon={faCancel} /> Remove Filter
                        </CButton>
                        <CButton color="primary" size="sm" type="submit">
                          <FontAwesomeIcon icon={faFilter} /> Filter
                        </CButton>
                      </div>
                    </CRow>
                  </CForm>
                </CCol>
              </CRow>
              <hr />

              <CRow>
                <CCol style={{ position: 'relative' }}>
                  <CChartBar
                    height={120}
                    data={!deworming.isLoading && deworming.data.deworming}
                    labels="deworming"
                  />
                </CCol>
                {(deworming.isFetching || deworming.isLoading) && <DefaultLoading />}
              </CRow>
            </CCardBody>
            <CCardFooter>
              <span className="text-muted">
                Female:
                {!deworming.isFetching && deworming.data.dewormingGender.female}
                <br />
                Male:
                {!deworming.isFetching && deworming.data.dewormingGender.male}
              </span>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
