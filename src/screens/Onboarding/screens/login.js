import React, { useEffect, useState } from 'react'
import '../components/index.css'
import { useDispatch, useSelector } from 'react-redux'
import { AuthActions, ProfileActions } from '../../../data/actions/userActions'
import { Formik } from 'formik'
import {
  StringHelper,
  validateEmail
} from '../../../data/extensions/stringHelper'
import { Constants } from '../../../data/constants'
import {
  Input,
  Spacer,
  Stack,
  Text,
  Button,
  InputGroup,
  InputRightElement,
  useToast,
  Spinner,
  VStack
} from '@chakra-ui/react'
import { AiOutlineArrowRight } from 'react-icons/ai'
import {
  signInWithCreds,
  useFirebaseInstance
} from '../../../data/database/users/auth'
import { motion } from 'framer-motion'
import { getProfile, useProfile } from '../../../data/database/users/profile'
import { SiteStyles } from '../../../components/global'

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ onSwitchRequest = () => {} }) => {
  const [globalLoading, setGlobalLoading] = useState(false)
  const user = useSelector(state => state?.user)
  const dispatch = useDispatch()
  const instance = useFirebaseInstance()
  const toast = useToast()

  async function performLogin (values, setSubmitting) {
    const signnResult = await signInWithCreds(instance, {
      ...values
    })
    if (signnResult?.success) {
      const profileResult = await getProfile(signnResult.user.uid, instance)
      if (profileResult.success) {
        dispatch({
          type: AuthActions.SET_USER,
          data: signnResult.user.uid
        })
        dispatch({
          type: ProfileActions.SET_PROFILE,
          data: profileResult.data
        })
        dispatch({
          type: ProfileActions.SET_LOADING_STATE,
          data: Constants.LoadingState.SUCCESS
        })
      } else {
        setSubmitting(false)
        console.log(profileResult.error.message)
        toast({
          title: "Couldn't fetch profile.",
          description:
            profileResult.error.message || 'Something went wrong. Try again.',
          status: 'error',
          duration: 3500,
          isClosable: true
        })
      }
    } else {
      setSubmitting(false)
      console.log(signnResult.error.message)
      toast({
        title: "Couldn't log in.",
        description:
          signnResult.error.message || 'Something went wrong. Try again.',
        status: 'error',
        duration: 3500,
        isClosable: true
      })
    }
  }

  // useEffect(() => {
  //   const { loadingState } = user
  //   if (loadingState == Constants.LoadingState.LOADING) {
  //     setGlobalLoading(true)
  //     dispatch({
  //       type: AuthActions.PERFORM_SIGNIN_LOCAL,
  //       data: {}
  //     })
  //   } else {
  //     setGlobalLoading(false)
  //   }
  // }, [user.loadingState])

  function isBusy (isSubmitting) {
    if (isSubmitting) {
      if (user?.error?.message) {
        return false
      }
      return true
    }
    return isSubmitting
  }

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          // errMessage: '',
          showPassword: false
        }}
        validateOnMount
        validateOnChange
        validate={values => {
          const errors = {}
          if (!validateEmail(values.email)) {
            errors.email = 'Invalid email address'
          } else if (values.password?.length <= 0) {
            errors.password = 'Please type in password'
          }
          return errors
        }}
        onSubmit={(values, { setSubmitting }) => {
          // console.log('Should try SignIn now...')
          setSubmitting(true)
          performLogin(values, setSubmitting)
        }}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          errors,
          isValid
        }) => (
          <>
            {globalLoading && (
              <div className='spinner-fullScreen'>
                <Spinner size='xl' />
              </div>
            )}
            <VStack w='100%' spacing='3' align='flex-start'>
              <Input
                placeholder='Enter Email'
                fontSize='sm'
                onChange={handleChange('email')}
                size='lg'
                {...SiteStyles.InputStyles}
              />
              <InputGroup size='lg'>
                <Input
                  pr='4.5rem'
                  type={values.showPassword ? 'text' : 'password'}
                  placeholder='Enter password'
                  fontSize='sm'
                  onChange={handleChange('password')}
                  {...SiteStyles.InputStyles}

                />
                <InputRightElement width='4.5rem'>
                  <Button
                    h='1.75rem'
                    size='sm'
                    onClick={() =>
                      setFieldValue('showPassword', !values.showPassword)
                    }
                    bg='#091927'
                    _hover={{
                      bg: '#09192760'
                    }}
                  >
                    {values.showPassword ? 'Hide' : 'Show'}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Spacer h='4' />
              <Button
                w='100%'
                // rightIcon={<AiOutlineArrowRight />}
                colorScheme='blue'
                bg='#2564eb'
                _hover={{
                  bg: '#154bbf'
                }}
                variant='solid'
                disabled={!isValid}
                onClick={handleSubmit}
                isLoading={isBusy(isSubmitting)}
                loadingText='Logging In'
              >
                Log In
              </Button>
              <Spacer h='3' />
              {/* <Text
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
              </Text> */}
            </VStack>
          </>
        )}
      </Formik>
    </>
  )
}
