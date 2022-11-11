import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import { Button } from '../../../components/form'
import { Spacer, SubTitle } from '../../../components/global'
import './index.css'
export const SignUpBanner = ({ onClick }) => {
  return (
    <div className='signup_banner'>
      <SubTitle className='no_margin' content='New to our platform?' />
      <Spacer />
      <Button
        className='signUp_btn small_button'
        label='Sign Up'
        icon={faAngleRight}
        animateIcon
        theme='dark'
        onClick={onClick && onClick}
      />
    </div>
  )
}

export const SignInBanner = ({ onClick }) => {
  return (
    <div className='signup_banner'>
      <SubTitle className='no_margin' content='Already a member?' />
      <Spacer />
      <Button
        className='signUp_btn small_button'
        label='Sign In'
        icon={faAngleRight}
        animateIcon
        theme='dark'
        onClick={onClick && onClick}
      />
    </div>
  )
}
