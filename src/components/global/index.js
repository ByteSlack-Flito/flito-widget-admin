import React, { useEffect, useRef, useState } from 'react'
import './global.css'
import Logo from '../../logo-trans.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faExclamation } from '@fortawesome/free-solid-svg-icons'
import '../global/global.css'
import IconParser from '../../misc/iconParser'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Grid,
  GridItem,
  HStack,
  Image,
  useDisclosure,
  ButtonGroup,
  Menu as ChakraMenu,
  Avatar,
  MenuButton,
  Text,
  MenuList,
  MenuItem,
  AlertDialogFooter,
  Link,
  Stack,
  VStack,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  PopoverFooter
} from '@chakra-ui/react'
import { IoExitOutline } from 'react-icons/io5'
import { TbExternalLink } from 'react-icons/tb'
import moment from 'moment'
import { GrUser } from 'react-icons/gr'
import { AuthActions } from '../../data/actions/userActions'
import { SiteRoutes } from '../../misc/routes'
import { useDispatch } from 'react-redux'

/**
 * The global Title component
 * @param {object} props Component props
 * @param {'dark' | 'light'} props.theme Defines the theme for the component, along with `color` property. Defaults to `light`
 * @param {'bold' | 'light'} props.fontType Defines the font-weight. Defaults to `light`.
 * @param {string} props.className Assign additional CSS classes to the component.
 * @param {string} props.link If passed a value, will set the component's additional styles.
 * @param {React.CSSProperties} props.style Defines additional styles for the component.
 * @param {'large' | 'large-2' | 'large-3' | 'medium' | 'small'  | 'xs'} props.size Defines the size of the component, affecting `padding`, `border` etc. properties. Defaults to `medium`
 * @param {object} props.content Renders any HTML content within the component.
 * @param {boolean} props.isLoading If `true`, will render a loading spinner instead of any content.
 */
export const Title = ({
  content,
  style,
  theme,
  size,
  link,
  fontType,
  className,
  isLoading
}) => {
  return (
    <>
      {isLoading && (
        <div className='main spinner-fullScreen'>
          <div className='spinner-border text-primary' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
        </div>
      )}
      {size === 'small' ? (
        <h6
          className={`title theme_${theme} font_${fontType} ${className} ${isLoading &&
            'opacity_hidden'}`}
          style={style}
        >
          {content}
        </h6>
      ) : size === 'xs' ? (
        <h6
          className={`title theme_${theme} font_${fontType} ${className} ${isLoading &&
            'opacity_hidden'} font_xs`}
          style={style}
        >
          {content}
        </h6>
      ) : size === 'large' ? (
        <h4
          className={`title theme_${theme} font_${fontType} ${className} ${isLoading &&
            'opacity_hidden'}`}
          style={style}
        >
          {content}
        </h4>
      ) : size === 'large-2' ? (
        <h2
          className={`title theme_${theme} font_${fontType} ${className} ${isLoading &&
            'opacity_hidden'}`}
          style={style}
        >
          {content}
        </h2>
      ) : size === 'large-3' ? (
        <h1
          className={`title theme_${theme} font_${fontType} ${className} large_3 ${isLoading &&
            'opacity_hidden'}`}
          style={style}
        >
          {content}
        </h1>
      ) : (
        <h5
          className={`title theme_${theme} font_${fontType} ${className} ${isLoading &&
            'opacity_hidden'}`}
          style={style}
        >
          {content}
        </h5>
      )}
    </>
  )
}

/**
 * The global SubTitle component
 * @param {object} props Component props
 * @param {'dark' | 'light'} props.theme Defines the theme for the component, along with `color` property. Defaults to `light`
 * @param {'bold' | 'light'} props.fontType Defines the font-weight. Defaults to `light`.
 * @param {string} props.className Assign additional CSS classes to the component.
 * @param {string} props.link If passed a value, will set the component's additional styles.
 * @param {React.CSSProperties} props.style Defines additional styles for the component.
 * @param {'large' | 'medium' | 'small' | 'xs'} props.size Defines the size of the component, affecting `padding`, `border` etc. properties. Defaults to `medium`
 * @param {string} props.id Defines the ID of the component.
 * @param {object} props.content Renders any HTML content within the component.
 */
export const SubTitle = ({
  content,
  style,
  theme,
  size,
  link,
  onClick,
  fontType,
  className,
  id
}) => {
  return size === 'large' ? (
    <h5
      id={id}
      className={`title font_${fontType} theme_${theme} ${className} ${link &&
        'font_link'}`}
      style={style}
      onClick={onClick && onClick}
    >
      {content}
    </h5>
  ) : size === 'medium' || size === 'regular' ? (
    <h6
      id={id}
      className={`title font_${fontType} theme_${theme} ${className} ${link &&
        'font_link'}`}
      style={style}
      onClick={onClick && onClick}
    >
      {content}
    </h6>
  ) : size === 'xs' ? (
    <p
      className={`title theme_${theme} font_${fontType} ${className} font_xs`}
      style={style}
    >
      {content}
    </p>
  ) : (
    <p
      id={id}
      className={`title font_${fontType} theme_${theme} ${className} ${link &&
        'font_link'}`}
      style={style}
      onClick={onClick && onClick}
    >
      {content}
    </p>
  )
}

/**
 * The global Card component
 * @param {object} props Component props
 * @param {'dark' | 'light'} props.theme Defines the theme for the component, along with `color` property. Defaults to `light`
 * @param {boolean} props.animateScale If true, will apply `scale(1.4)` transition on hover.
 * @param {string} props.className Assign additional CSS classes to the component.
 * @param {boolean} props.clickable If true, will set `cursor: 'pointer'`. Defaults to `true`
 * @param {React.CSSProperties} props.style Defines additional styles for the component.
 * @param {'compact' | 'default'} props.size Defines the size of the component, affecting `padding`, `border` etc. properties.
 * @param {'dark' | 'light'} props.theme Defines the theme of the component. Defaults to `light`.
 */
export function Card({
  children,
  theme = 'light',
  size,
  id,
  className,
  animateScale = true,
  style,
  clickable = true
}) {
  return (
    <div
      className={`card card_${theme} ${size === 'compact' ? 'card_compact' : ''
        } ${className} ${animateScale ? 'card_animate_scale' : ''}`}
      style={{
        ...style,
        cursor: clickable ? 'pointer' : 'default'
      }}
    >
      {children}
    </div>
  )
}

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

export function Slider({
  children,
  onClose = () => { },
  onOpen = () => { },
  isOpen
}) {
  const containerRef = useRef()
  useEffect(() => {
    !isOpen ? onClose() : onOpen()
  }, [isOpen])
  return (
    <div className={`modal_slider ${!isOpen && 'modal_hidden'}`}>
      <div className='row cols-3 bg_dim modal_main' style={{ height: '100%' }}>
        <div className='col' />
        <div className='col' />
        <div className='col col-sm-5 slider_container'>
          <div
            ref={containerRef}
            className={`modal_container shadow_light ${isOpen &&
              'modal_container_visible'}`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export const InfoBox = ({ type, content, visible, onHide }) => {
  const infoboxRef = useRef()

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        infoboxRef && infoboxRef.current.classList.add('infobox_hidden')
      }, 2000)
      setTimeout(() => {
        onHide && onHide()
      }, 2500)
    }
  }, [visible])

  return (
    <div className={`infobox_parent`}>
      <div
        ref={infoboxRef}
        className={`infobox_container infobox_${type} ${!visible &&
          'infobox_hidden'}`}
      >
        <div className='row'>
          <div
            className='col col-sm-1'
            style={{
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <FontAwesomeIcon
              icon={type === 'success' ? faCheck : faExclamation}
              color='#fff'
            />
          </div>
          <div className='col'>
            <div>
              <Spacer />
              <SubTitle
                content={type[0].toUpperCase() + type.substring(1)}
                theme='light'
                size='medium'
                fontType='bold'
                className='margin_xs'
              />
              <SubTitle className='margin_xs' content={content} theme='light' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const ContentSwitcher = ({ data }) => {
  return (
    <div>
      <div className='col'>
        <SubTitle
          fontType='bold'
          className='font_xs no_margin'
          content='Front-End Engineers'
        />
        <SubTitle
          className='font_xs no_margin line_s'
          content='2 Front-End Engineer suggested for the project.'
        />
      </div>
      <div className='col col-sm-1'></div>
    </div>
  )
}

export const PageTitle = ({ title, icon }) => {
  return (
    <>
      <Spacer times={2.5} />
      <div
        className='page_title'
        style={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {/* <IconParser itemId={location.pathname} /> */}
        {icon}
        <SubTitle
          content={title}
          fontType='bold'
          className='no_margin'
          style={{
            paddingLeft: 5
          }}
        />
      </div>
      <Spacer times={2.5} />
    </>
  )
}

/**
 * The global Info component
 * @param {object} props Component props
 * @param {string} props.className Assign additional CSS classes to the component.
 * @param {object} props.icon Icon to render inside the component.
 * @param {object} props.link If passed a value, allow the component to navigate to the specified link.
 * @param {React.CSSProperties} props.style Defines additional styles for the component.
 * @param {React.CSSProperties} props.contentStyle Defines additional styles for the nested contents.
 * @param {HTMLElement} props.content Renders any HTML content within the component.
 * @param {boolean} props.animateScale Renders any HTML content within the component.
 */
export const Info = ({
  className,
  icon,
  content,
  style,
  link = {},
  animateScale,
  contentStyle
}) => {
  return (
    <p
      className={`font_xs no_margin ${animateScale && 'scale'} ${link &&
        'link'} ${className}`}
      style={{
        padding: 2,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 5,
        fontSize: '0.7rem',
        display: 'flex',
        alignItems: 'center',
        ...style
      }}
    >
      {icon}
      <div
        style={{
          // fontWeight: 600,
          paddingLeft: icon ? 5 : 0,
          ...contentStyle
        }}
      >
        {content}
      </div>
    </p>
  )
}

export const Header = ({ onLinkClick = link => { } }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  function performLogOut() {
    setTimeout(() => {
      dispatch({
        type: AuthActions.PERFORM_SIGNOUT
      })
    }, 200)
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
          {/* <ChakraMenu size='sm' isLazy>
            <MenuButton
              as={Button}
              bg='white'
              borderColor='blue.100'
              borderWidth='thin'
              borderRadius='md'
              p='0'
              _hover={{
                borderColor: 'blue.500'
              }}
            >
              <Avatar
                name='Software Comp'
                src='https://bit.ly/broken-link'
                size='xs'
                borderRadius='md'
              />
            </MenuButton>
            <MenuList zIndex={999}>
              <MenuItem
                icon={<FiUser />}
                onClick={() => onLinkClick('/profile')}
              >
                <Text fontSize='xs'> Profile</Text>
              </MenuItem>
              <MenuItem
                icon={<IoExitOutline />}
                onClick={() => onLinkClick('/logout')}
              >
                <Text fontSize='xs'> Log Out</Text>
              </MenuItem>
              <MenuItem
                icon={<IoHelpOutline />}
                onClick={() => onLinkClick('/help')}
              >
                <Text fontSize='xs'> Get Help</Text>
              </MenuItem>
            </MenuList>
          </ChakraMenu> */}
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

export const PopupAlert = ({
  cancelText = 'No',
  confirmText = 'Yes',
  onConfirm = () => { },
  onCancel = () => { },
  onClose = () => { },
  title = 'Are you sure?',
  description = '',
  isOpen
}) => {
  const cancelRef = React.useRef()

  return (
    <AlertDialog
      motionPreset='slideInBottom'
      leastDestructiveRef={cancelRef}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent>
        <AlertDialogHeader>{title}</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody>{description}</AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose}>
            {cancelText}
          </Button>
          <Button colorScheme='red' ml={3} onClick={onConfirm}>
            {confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export const UserInfo = ({
  size = 'compact',
  firstName,
  lastName,
  fullName,
  tooltipText = 'View Client Info',
  email,
  navLink
}) => {
  return (
    size === 'compact' && (
      <Tooltip label={tooltipText} aria-label='user-info'>
        <Button
          leftIcon={<GrUser />}
          //   rightIcon={<TbExternalLink size={12} />}
          size='xs'
          variant='solid'
          colorScheme='gray'
          ml='2'
        >
          {fullName
            ? fullName
            : email
              ? `${firstName} - ${email}`
              : `${firstName} ${lastName}`}
        </Button>
      </Tooltip>
    )
  )
}

/**
 * A global component to render screens with titles and descriptions.
 * @param {object} props Component Props
 * @param {string | JSX.Element} props.title Text/Component to render as the title of the screen. This will render in a pre-defined `<Text>` component.
 * @param {string | JSX.Element} props.description Text/Component to render as the description of the screen. This will render in a pre-defined `<Text>` component.
 * @param {JSX.Element} props.children Component(s) to render as the children of this component. Render all your screen components here.
 * @returns
 */
export function ScreenContainer({ title, description, children }) {
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
      <GridItem justifyContent='flex-start' textAlign='left' pt='3'>{children}</GridItem>
    </Grid>
  )
}