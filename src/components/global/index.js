import React, { useEffect, useState, useCallback } from 'react'
import './global.css'
import Logo from '../../logo-trans.png'
import '../global/global.css'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Button,
  Grid,
  GridItem,
  HStack,
  Image,
  Text,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  VStack,
  useToast,
  Tooltip
} from '@chakra-ui/react'
import { IoArrowBackSharp, IoExitOutline } from 'react-icons/io5'
import { TbExternalLink } from 'react-icons/tb'
import moment from 'moment'
import { AuthActions } from '../../data/actions/userActions'
import { getRoutes, SiteRoutes } from '../../misc/routes'
import { useDispatch } from 'react-redux'
import { StorageHelper } from '../../data/storage'
import { GrUser } from 'react-icons/gr'
import { signOut, useFirebaseInstance } from '../../data/database/users/auth'
import { BsChevronRight } from 'react-icons/bs'
import { AiOutlineRight } from 'react-icons/ai'
import { BiUser, BiX } from 'react-icons/bi'
import { IoIosArrowRoundBack } from 'react-icons/io'

const ButtonStyles = {
  transition: 'all 300ms',
  bg: '#0f283d',
  dropShadow: 'md',
  borderWidth: 'thin',
  borderColor: 'teal.400',
  color: 'white',
  _active: {
    bg: 'teal'
  },
  _hover: {
    bg: 'teal'
  }
}

const LinkStyles = {
  color: 'teal',
  fontWeight: 'semibold'
}

const InputStyles = {
  bg: '#0f283d',
  border: 'none'
}

const FocusableInputStyles = {
  transition: 'padding-left 300ms',
  bg: 'transparent',
  border: 'none !important',
  pl: 0,
  resize: 'none',
  _focus: {
    ...InputStyles,
    pl: '4',
    resize: 'vertical'
  },
  boxShadow: 'none !important'
}
const ClickableContainer = {
  transition: 'all 200ms',
  userSelect: 'none',
  borderWidth: 'thin',
  borderColor: '#543d63',
  cursor: 'pointer',
  borderRadius: 'md',
  _hover: {
    bg: '#0f283d',
    borderColor: 'transparent',
    // color: '#3b154d',
    shadow: 'md'
  },
  p: '5'
}
const DeleteButton_Main = {
  ...ButtonStyles,
  borderColor: 'red.400',
  _hover: {
    bg: 'red.600',
    borderColor: 'red.400',
    color: 'white'
  },
  _active: {
    bg: 'red.400',
    borderColor: 'red.400',
    color: 'white'
  }
}
const DeleteButton = {
  bg: '#14344f',
  variant: 'solid',
  p: '2',
  size: 'xs',
  h: '30px',
  _active: {
    bg: '#3d0f1b'
  },
  _hover: {
    bg: '#61162a'
  },
  icon: <BiX size={16} />
}

const BadgeStyle = {
  bg: '#543d63',
  color: 'white'
}

export const SiteStyles = {
  LinkStyles,
  ButtonStyles,
  InputStyles,
  FocusableInputStyles,
  ClickableContainer,
  DeleteButton,
  DeleteButton_Main,
  BadgeStyle
}

export const Header = ({ onLinkClick = link => {} }) => {
  const [isLogginOut, setIsLoggingOut] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const fireInstance = useFirebaseInstance()

  async function performLogOut () {
    setIsLoggingOut(true)
    const signoutResult = await signOut(fireInstance)
    if (signoutResult.success) {
      StorageHelper.Remove('auth')
      dispatch({
        type: AuthActions.SET_USER,
        data: null
      })
      navigate(SiteRoutes.Onboarding.Init.path)
    }
  }

  return (
    <Grid h='100%' gridTemplateColumns='1fr 1fr'>
      <GridItem colSpan='1'>
        <Image
          boxSize='45px'
          objectFit='contain'
          src={Logo}
          alt='Flito Logo'
          ml='4'
        />
      </GridItem>
      <GridItem colSpan='1' justifyContent='flex-end' pr='2'>
        <HStack align='center' h='100%' justify='flex-end'>
          <Popover isLazy>
            <PopoverTrigger>
              <Button
                rightIcon={<IoExitOutline />}
                transition='all 200ms'
                size='xs'
                bg='#d885ff20'
                color='whiteAlpha.600'
                // borderColor='#d885ff70'
                // borderWidth='thin'
                fontWeight='light'
                _active={{
                  bg: '#d885ff20'
                }}
                _hover={{
                  color: 'white',
                  transform: 'scale(1.05)'
                }}
              >
                Log Out
              </Button>
            </PopoverTrigger>
            <PopoverContent
              bg='blue.800'
              color='#fff'
              onClick={e => e.stopPropagation()}
              cursor='default'
            >
              <PopoverArrow bg='blue.800' />
              <PopoverCloseButton />
              <PopoverHeader textAlign='left' borderColor='blue.600'>
                <Text fontSize='sm'>Log Out ?</Text>
              </PopoverHeader>
              <PopoverBody
                whiteSpace='pre-line'
                overflowWrap='break-word'
                fontSize='smaller'
                fontWeight='normal'
                textAlign='left'
              >
                Are you sure you want to log out? All unsaved changes will be
                dismissed.
              </PopoverBody>
              <PopoverFooter
                justifyContent='flex-start'
                borderColor='blue.600'
                display='flex'
              >
                <Button
                  size='xs'
                  colorScheme='red'
                  onClick={performLogOut}
                  isLoading={isLogginOut}
                >
                  Yes, Log Out
                </Button>
              </PopoverFooter>
            </PopoverContent>
          </Popover>
        </HStack>
      </GridItem>
    </Grid>
  )
}

export const Footer = () => (
  <HStack w='100%' h='100%' align='center' justifyContent='flex-end' pr='4'>
    <Text fontSize='x-small'>
      ?? {moment(Date.now()).format('YYYY')} Flito Pvt. Ltd. All Rights Reserved
    </Text>
    <Link
      href='https://flito.io/terms-of-use'
      isExternal
      fontSize='x-small'
      color='blue.400'
      colorScheme='purple'
      maxW='fit-content'
      display='flex'
    >
      Terms Of Use <TbExternalLink size={12} />
    </Link>
    <Link
      href='https://flito.io/privacy-policy'
      isExternal
      fontSize='x-small'
      color='blue.400'
      colorScheme='purple'
      maxW='fit-content'
      display='flex'
    >
      Privacy Policy <TbExternalLink size={12} />
    </Link>
    <Link
      href='https://flito.io/report-bug'
      isExternal
      fontSize='x-small'
      color='blue.400'
      colorScheme='purple'
      maxW='fit-content'
      display='flex'
    >
      Report A Bug <TbExternalLink size={12} />
    </Link>
  </HStack>
)

/**
 * A global component to render screens with titles and descriptions.
 * @param {object} props Component Props
 * @param {string | JSX.Element} props.title Text/Component to render as the description of the screen. This will render in a pre-defined `<Text>` component.
 * @param {string | JSX.Element} props.description Text/Component to render as the description of the screen. This will render in a pre-defined `<Text>` component.
 * @param {true | false} props.allowGoBack If `true`, it will render an additional button at the top-left corner, which allows to go back.
 * @param {true | false} props.preventChildScroll
 * @param {JSX.Element} props.children Component(s) to render as the children of this component. Render all your screen components here.
 * @returns
 */
export const ScreenContainer = ({
  title,
  description,
  children,
  allowGoBack,
  preventChildScroll
}) => {
  const navigate = useNavigate()
  return (
    <Grid gridTemplateRows='auto 1fr' w='100%' h='100%'>
      <GridItem>
        <VStack align='flex-start' pt='3' textAlign='left' pr='5'>
          {allowGoBack && (
            <Button
              transition='all 300ms'
              variant='unstyled'
              fontSize='sm'
              display='flex'
              leftIcon={<IoArrowBackSharp />}
              h='max-content'
              p='1'
              onClick={() => navigate(-1)}
              _hover={{
                color: 'teal.400'
              }}
            >
              Go Back
            </Button>
          )}
          {title && (
            <Text fontSize='lg' fontWeight='normal'>
              {title}
            </Text>
          )}
          <Text fontSize='md' fontWeight='normal'>
            {description}
          </Text>
        </VStack>
      </GridItem>
      <GridItem
        justifyContent='flex-start'
        textAlign='left'
        pt='3'
        pr='2'
        overflow={preventChildScroll ? 'hidden' : 'scroll'}
      >
        {children}
      </GridItem>
    </Grid>
  )
}

export const useToastGenerator = () => {
  const toast = useToast()
  const toastVariants = {
    success: {
      title: 'Successfully Updated!',
      description: 'Your changes will affect in real-time.',
      status: 'success'
    },
    error: {
      title: "Couldn't update!",
      description: 'Sorry, something went wrong. Please try again.',
      status: 'error'
    }
  }

  /**
   *
   * @param {{success: boolean; error?: object;}} dbCallback The callback method containing `success` and/or `error` object.
   */
  const show = dbCallback =>
    toast({
      ...toastVariants[dbCallback.success ? 'success' : 'error'],
      duration: 3500,
      isClosable: true
    })

  return { show }
}

export const UserInfo = ({
  size = 'compact',
  name,
  email,
  tooltipText = 'View Client Info',
  navLink
}) => {
  const [copied, setCopied] = useState(false)
  const copyCode = useCallback(() => {
    !copied &&
      navigator.clipboard.writeText(email).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      })
  }, [])
  return (
    size === 'compact' && (
      <Tooltip hasArrow label='Click to copy email'>
        <Button
          leftIcon={<BiUser style={{ color: 'white' }} />}
          size='xs'
          ml='2'
          {...ButtonStyles}
        >
          {name} - {email}
        </Button>
      </Tooltip>
    )
  )
}
