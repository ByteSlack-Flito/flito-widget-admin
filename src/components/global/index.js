import './global.css'
import Logo from '../../logo-trans.png'
import '../global/global.css'
import { useNavigate } from 'react-router-dom'
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
  useToast
} from '@chakra-ui/react'
import { IoExitOutline } from 'react-icons/io5'
import { TbExternalLink } from 'react-icons/tb'
import moment from 'moment'
import { AuthActions } from '../../data/actions/userActions'
import { SiteRoutes } from '../../misc/routes'
import { useDispatch } from 'react-redux'
import { StorageHelper } from '../../data/storage'

/**
 * The global Spacer component
 * @param {object} props Component props
 * @param {'small' | 'medium' | 'large'} props.size Defines the size of the component, affecting `padding`, `border` etc. properties. Defaults to `small`.
 * @param {number} props.times Multiply the size of the spacer.
 */
export const Spacer = ({ size = 'small', times }) => {
  const initSize = 10 * times
  return !times ? (
    <div className={`spacer_${size ? size : 'small'}`} />
  ) : (
    <div
      style={{
        height: initSize,
        widows: initSize
      }}
    />
  )
}

export const Header = ({ onLinkClick = link => {} }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function performLogOut () {
    setTimeout(() => {
      StorageHelper.Remove('auth')
      dispatch({
        type: AuthActions.SET_USER,
        data: undefined
      })
    }, 1000)
    navigate(SiteRoutes.Onboarding.Init.path)
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
              <Button rightIcon={<IoExitOutline />} size='xs'>
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
                <Button size='xs' colorScheme='red' onClick={performLogOut}>
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
      © {moment(Date.now()).format('YYYY')} Flito Pvt. Ltd. All Rights Reserved
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
 * @param {string | JSX.Element} props.title Text/Component to render as the title of the screen. This will render in a pre-defined `<Text>` component.
 * @param {string | JSX.Element} props.description Text/Component to render as the description of the screen. This will render in a pre-defined `<Text>` component.
 * @param {JSX.Element} props.children Component(s) to render as the children of this component. Render all your screen components here.
 * @returns
 */
export function ScreenContainer ({ title, description, children }) {
  return (
    <Grid gridTemplateRows='auto 1fr' w='100%' h='100%'>
      <GridItem>
        <VStack align='flex-start' pt='3'>
          <Text fontSize='lg' fontWeight='normal'>
            {title}
          </Text>
          <Text fontSize='sm' fontWeight='normal'>
            {description}
          </Text>
        </VStack>
      </GridItem>
      <GridItem justifyContent='flex-start' textAlign='left' pt='3'>
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
  const show = (dbCallback) =>
    toast({
      ...toastVariants[dbCallback.success ? 'success' : 'error'],
      duration: 3500,
      isClosable: true
    })

  return { show }
}
