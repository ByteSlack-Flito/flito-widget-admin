import React, { useState } from 'react'
import '../components/index.css'
import { useDispatch, useSelector } from 'react-redux'
import { AuthActions } from '../../../data/actions/userActions'
import { Formik } from 'formik'
import { StringHelper } from '../../../data/extensions/stringHelper'
import {
  Input,
  Spacer,
  Stack,
  Text,
  Button,
  InputGroup,
  InputRightElement,
  useToast
} from '@chakra-ui/react'
import { AiOutlineArrowRight } from 'react-icons/ai'

export default ({ onSwitchRequest = () => {}, projectMetaData }) => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  function performSignUp (values) {
    dispatch({
      type: AuthActions.PERFORM_SIGNUP,
      data: {
        email: values.email,
        password: values.password,
        projects: [projectMetaData]
      }
    })
  }

  function isBusy (isSubmitting) {
    if (isSubmitting) {
      if (user.error?.message) {
        return false
      }
      return true
    }
    return isSubmitting
  }

  return (
    <div>
      <Formik
        initialValues={{
          email: '',
          password: '',
          rePassword: '',
          errMessage: '',
          showPassword: false
        }}
        validate={values => {
          const errors = {}
          if (StringHelper.isPropsEmpty(values, ['errMessage', 'showPassword']))
            errors.errMessage = 'Please fill in all details.'
          else if (!StringHelper.isSame([values.password, values.rePassword]))
            errors.errMessage = 'Your passwords do not match.'
          return errors
        }}
        validateOnChange={false}
        onSubmit={(values, { setSubmitting }) => {
          if (StringHelper.isEmpty(values.errMessage)) {
            console.log('Should try signup now...')
            setSubmitting(true)
            performSignUp(values)
          }
        }}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          errors
        }) => (
          <Stack direction='column' spacing='2'>
            <Text
              fontSize='smaller'
              fontWeight='medium'
              align='center !important'
            >
              Create your new Flito account!
            </Text>
            <Spacer h='2' />
            <Input
              placeholder='Enter Email'
              fontSize='sm'
              onChange={handleChange('email')}
            />
            <InputGroup size='md'>
              <Input
                pr='4.5rem'
                type={values.showPassword ? 'text' : 'password'}
                placeholder='Enter password'
                onChange={handleChange('password')}
                fontSize='sm'
              />
              <InputRightElement width='4.5rem'>
                <Button
                  h='1.75rem'
                  size='sm'
                  onClick={() =>
                    setFieldValue('showPassword', !values.showPassword)
                  }
                >
                  {values.showPassword ? 'Hide' : 'Show'}
                </Button>
              </InputRightElement>
            </InputGroup>
            <Input
              pr='4.5rem'
              type={values.showPassword ? 'text' : 'password'}
              placeholder='Confirm password'
              onChange={handleChange('rePassword')}
              fontSize='sm'
            />
            <Spacer h='4' />
            <Button
              colorScheme='blue'
              variant='solid'
              onClick={handleSubmit}
              isLoading={isBusy(isSubmitting)}
              loadingText='Creating Account'
            >
              Create Account
            </Button>
            <Spacer h='3' />
            {errors.errMessage ||
              (user.error?.message && (
                <Text
                  fontSize='xs'
                  bg='red.400'
                  color='white'
                  align='left'
                  pt='1'
                  pb='1'
                  pl='3'
                  fontWeight='semibold'
                >
                  {errors.errMessage || user.error?.message}
                </Text>
              ))}
          </Stack>
        )}
      </Formik>
    </div>
  )
}
