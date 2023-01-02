import React, { useRef, useState } from 'react'
import '../components/index.css'
import { useDispatch, useSelector } from 'react-redux'
import { AuthActions, ProfileActions } from '../../../data/actions/userActions'
import { Formik } from 'formik'
import {
  StringHelper,
  validateEmail
} from '../../../data/extensions/stringHelper'
import {
  Input,
  Spacer,
  Stack,
  Text,
  Button,
  InputGroup,
  InputRightElement,
  useToast,
  HStack,
  VStack,
  Checkbox,
  Link
} from '@chakra-ui/react'
import { AiOutlineArrowRight } from 'react-icons/ai'
import {
  useFirebaseInstance,
  signUpWithCreds,
  getUserIdToken
} from '../../../data/database/users/auth'
import { StorageHelper } from '../../../data/storage'
import { updateProfile } from '../../../data/database/users/profile'
import { motion } from 'framer-motion'
import { TOUModal } from '../components'
import { Constants } from '../../../data/constants'
import { SiteStyles } from '../../../components/global'

export default ({ onSwitchRequest = () => {}, projectMetaData }) => {
  const dispatch = useDispatch()
  const user = useSelector(state => state?.user)
  const instance = useFirebaseInstance()
  const toumodalRef = useRef()
  const toast = useToast()

  async function performSignUp (values, setSubmitting) {
    const signUpResult = await signUpWithCreds(instance, {
      ...values
    })
    if (signUpResult.success) {
      /// Constructing profile
      var profileData = {
        ...values
      }
      delete profileData.password
      delete profileData.rePassword
      delete profileData.showPassword

      if (String(profileData.fullName).includes(' ')) {
        profileData.firstName = profileData.fullName.split(' ')[0]
        profileData.lastName = profileData.fullName.split(' ')[1]
      }
      /// Ending profile
      const profileResult = await updateProfile(
        instance,
        signUpResult.user.uid,
        {
          data: profileData
        }
      )
      profileResult.success && console.log('Profile created successfully!')
      dispatch({
        type: AuthActions.SET_USER,
        data: signUpResult.user.uid
      })
      dispatch({
        type: ProfileActions.SET_LOADING_STATE,
        data: Constants.LoadingState.SUCCESS
      })
    } else {
      setSubmitting(false)
      console.log(signUpResult.error.message)
      toast({
        title: "Couldn't create account.",
        description:
          signUpResult.error.message || 'Something went wrong. Try again.',
        status: 'error',
        duration: 3500,
        isClosable: true
      })
    }
  }

  function showTouModal () {
    toumodalRef.current?.open()
  }

  return (
    <>
      <TOUModal ref={toumodalRef} />
      <Formik
        initialValues={{
          email: '',
          password: '',
          rePassword: '',
          organizationName: '',
          termsAgreed: false,
          // errMessage: '',
          showPassword: false
        }}
        validateOnMount
        validate={values => {
          const errors = {}
          if (!validateEmail(values.email)) {
            errors.email = 'Invalid email address'
          }
          if (
            StringHelper.isPropsEmpty(values, [
              'errMessage',
              'showPassword',
              'termsAgreed'
            ])
          )
            errors.email = 'Please fill in all details.'
          else if (!StringHelper.isSame([values.password, values.rePassword]))
            errors.password = 'Your passwords do not match.'

          if (!values.termsAgreed)
            errors.agreed = 'You must agree to our ToU and Privacy Policy'

          return errors
        }}
        onSubmit={(values, { setSubmitting }) => {
          console.log('Should try signup now...')
          performSignUp(values, setSubmitting)
          // }
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
          <VStack w='full' spacing='3' align='flex-start'>
            <HStack w='100%' spacing='3'>
              <Input
                placeholder='Your Name'
                fontSize='sm'
                onChange={handleChange('fullName')}
                size='lg'
                {...SiteStyles.InputStyles}

              />
              <Input
                placeholder='Organization Name'
                fontSize='sm'
                onChange={handleChange('organizationName')}
                size='lg'
                {...SiteStyles.InputStyles}

              />
            </HStack>
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
                onChange={handleChange('password')}
                fontSize='sm'
                {...SiteStyles.InputStyles}

              />
              <InputRightElement width='4.5rem'>
                <Button
                  transition='all 200ms'
                  h='1.75rem'
                  size='sm'
                  onClick={() =>
                    setFieldValue('showPassword', !values.showPassword)
                  }
                  bg='#091927'
                  _hover={{
                    bg: '#09192760'
                  }}
                  // bgGradient='radial(circle farthest-corner at 90% 90%, #543d63, #3b154d, #091927 300px)'
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
              size='lg'
              {...SiteStyles.InputStyles}
            />
            <Checkbox onChange={handleChange('termsAgreed')}>
              <Text fontSize='sm' display='flex'>
                I agree to Flito's{' '}
                <Link onClick={showTouModal} pl='1' {...SiteStyles.LinkStyles}>
                  Terms Of Use
                </Link>
              </Text>
            </Checkbox>
            <Spacer h='4' />
            {/* {console.log('Validity:', errors)} */}
            <Button
              w='full'
              colorScheme='blue'
              bg='#2564eb'
              _hover={{
                bg: '#154bbf'
              }}
              disabled={!isValid}
              variant='solid'
              onClick={handleSubmit}
              isLoading={isSubmitting}
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
          </VStack>
        )}
      </Formik>
    </>
  )
}
