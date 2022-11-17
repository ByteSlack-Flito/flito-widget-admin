import React, { useEffect, useState } from 'react'
import '../components/index.css'
import { useDispatch, useSelector } from 'react-redux'
import { AuthActions } from '../../../data/actions/userActions'
import { Formik } from 'formik'
import { StringHelper } from '../../../data/extensions/stringHelper'
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
  Spinner
} from '@chakra-ui/react'
import { AiOutlineArrowRight } from 'react-icons/ai'

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ onSwitchRequest = () => { } }) => {
  const [globalLoading, setGlobalLoading] = useState(false)
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()

  function performLogin(values) {
    // console.log('values:', values)
    dispatch({
      type: AuthActions.PERFORM_SIGNIN,
      data: {
        email: values.email,
        password: values.password
      }
    })
  }

  useEffect(() => {
    const { loadingState } = user
    if (loadingState == Constants.LoadingState.LOADING) {
      setGlobalLoading(true)
      dispatch({
        type: AuthActions.PERFORM_SIGNIN_LOCAL,
        data: {}
      })
    } else {
      setGlobalLoading(false)
    }
  }, [user.loadingState])

  function isBusy(isSubmitting) {
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
          errMessage: '',
          showPassword: false
        }}
        validate={values => {
          const errors = {}
          if (StringHelper.isPropsEmpty(values, ['errMessage', 'showPassword']))
            errors.errMessage = 'Please fill in all details.'
          return errors
        }}
        validateOnChange={false}
        onSubmit={(values, { setSubmitting }) => {
          if (StringHelper.isEmpty(values.errMessage)) {
            // console.log('Should try SignIn now...')
            setSubmitting(true)
            performLogin(values)
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
          <>
            {globalLoading && (
              <div className='spinner-fullScreen'>
                <Spinner size='xl' />
              </div>
            )}
            <Stack direction='column' spacing='2'>
              <Text
                fontSize='smaller'
                fontWeight='medium'
                align='center !important'
              >
                Log-in to your existing Flito account
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
                  fontSize='sm'
                  onChange={handleChange('password')}
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
              <Spacer h='4' />
              <Button
                rightIcon={<AiOutlineArrowRight />}
                colorScheme='blue'
                variant='solid'
                onClick={handleSubmit}
                isLoading={isBusy(isSubmitting)}
                loadingText='Logging In'
              >
                Log In
              </Button>
              <Spacer h='3' />
              {errors.errMessage || user.error?.message ? (
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
              ) : (
                <Text fontSize='x-small' lineHeight='shorter'>
                  By clicking 'Log-In', you agree to our Terms of Services and
                  our cookie-usage policies. Flito will utilise certain cookies
                  to ensure better user-experience.
                </Text>
              )}
            </Stack>
            {/* <Title
                className='font_gradient no_margin'
                content="Let's Make Your App!"
                size='large-2'
                fontType='bold'
                style={{
                  paddingBottom: '10px'
                }}
              />
              <SubTitle
                size='medium'
                fontType='light'
                content='Log-in and start building your app now!'
              />
              <Spacer size='large' />
              <Input
                className={`col col-lg-9 margin_xs ${isBusy(isSubmitting) &&
                  'disabled'}`}
                placeholder='Email Address'
                onValueChange={handleChange('email')}
              />
              <Spacer />
              <Input
                className={`col col-lg-9 margin_xs ${isBusy(isSubmitting) &&
                  'disabled'}`}
                placeholder='Password'
                isPassword
                onValueChange={handleChange('password')}
              />
              {errors.errMessage || user.error?.message ? (
                <>
                  <SubTitle
                    content={errors.errMessage || user.error.message}
                    className='font_xs no_margin font_error margin_xs col col-lg-9'
                    fontType={'bold'}
                  />
                  <Spacer size='small' />
                </>
              ) : (
                <Spacer size='medium' />
              )}
              <div className='row'>
                <div className='col col-sm-5'>
                  <Button
                    hasShadow
                    isRounded
                    theme='dark'
                    label='Log In'
                    icon={faArrowRight}
                    animateIcon
                    onClick={handleSubmit}
                    isBusy={isBusy(isSubmitting)}
                    animateScale
                  />
                </div>
              </div>
              <Spacer size={'medium'} />
              <div className='row'>
                <SubTitle
                  className='col col-lg-12 font_xs'
                  content={
                    <>
                      By clicking{' '}
                      <i>
                        <b className='font_link'>Log In</b>
                      </i>
                      , you agree to our{' '}
                      <i className='font_link'>Terms and Conditions</i>. And you
                      also agree to allow us to save cookies in your local
                      browser.
                    </>
                  }
                />
              </div> */}
          </>
        )}
      </Formik>
    </div>
  )
}
