import {
  Box,
  HStack,
  VStack,
  Text,
  Button,
  Link,
  Divider,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Image,
  SimpleGrid,
  Input,
  Badge,
  AvatarGroup,
  Avatar
} from '@chakra-ui/react'
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import { BiCheck, BiCheckCircle, BiPlus, BiXCircle } from 'react-icons/bi'
import { IoColorPaletteOutline } from 'react-icons/io5'
import { DiReact } from 'react-icons/di'
import { Link as ReactRouterLink } from 'react-router-dom'
import { BsCode, BsCodeSlash, BsFillCheckCircleFill } from 'react-icons/bs'
import { TbTestPipeOff } from 'react-icons/tb'
import { FaAws } from 'react-icons/fa'
import { MdDevices, MdOutlineManageAccounts } from 'react-icons/md'
import '../index.css'
import { SiteStyles, useToastGenerator } from '../../../components/global'
import { groupBy } from '../../../misc/featureHelper'
import { AnimatePresence, motion, useElementScroll } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { useWidget } from '../../../data/database/users/profile'
import { useSelector } from 'react-redux'
import { arrayUnion } from 'firebase/firestore'
import Select from 'react-select'
import { ReactSelectStyles } from '..'

export const VariantAppView = ({ variant, apps, onClick, pricing }) => {
  const { data } = useWidget()

  return (
    <VStack
      transition='all 300ms'
      align='flex-start'
      role='group'
      {...SiteStyles.ClickableContainer}
      onClick={onClick}
    >
      <Text fontSize='md' fontWeight='medium' textTransform='capitalize'>
        {variant} Apps
      </Text>
      {/* <HStack flexWrap='wrap' fontSize='sm'>
        <Text>Examples: </Text>
        <AvatarGroup size='xs' max={2}>
          {apps
            .filter((app, index) => index < 3)
            .map((app, index) => (
              <Avatar
                key={`${app.name}${index}`}
                name={app.label}
                src={app.iconSrc}
              />
            ))}
        </AvatarGroup>
      </HStack> */}
      <Text
        transition='all 300ms'
        fontSize='xs'
        fontWeight='semibold'
        opacity='0.5'
        _groupHover={{
          color: 'teal.400',
          opacity: 1
        }}
      >
        {pricing
          ? `${pricing.minAmount}-${pricing.maxAmount} ${
              data?.pricing?.currency || ''
            }`
          : 'Click To Set Price'}
      </Text>
    </VStack>
  )
}

const LoadingOption = props => (
  <div {...props}>
    <VStack p='3' fontSize='sm' fontWeight='normal'>
      <Text>
        You are either not providing the specific service(s). Please go to My
        Services and complete the set-up
      </Text>
    </VStack>
  </div>
)

export const AddVariantPriceModal = React.forwardRef(
  ({ onSuccessClose }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [variantData, setVariantData] = useState()
    const profile = useSelector(state => state?.user?.profile)
    const { update, isUpdating, getLatest } = useWidget(false)
    const toast = useToastGenerator()

    const { getValues, reset, handleSubmit, watch, register } = useForm()

    function open () {
      setIsOpen(true)
    }

    useImperativeHandle(ref, () => ({
      open,
      setVariantData
    }))

    useEffect(() => {
      reset(variantData)
    }, [variantData])

    async function performUpdate () {
      const widgetData = await getLatest()

      const priceData = {
        name: variantData.name,
        avgAmount: Math.floor(
          (Number(getValues().minAmount) + Number(getValues().maxAmount)) / 2
        ),
        ...getValues()
      }
      const { fixedAppPrices } = widgetData.data

      const setFixedPrices = () => {
        if (fixedAppPrices && fixedAppPrices.length > 0) {
          let spread = [...fixedAppPrices]
          const currentVariantIndex = fixedAppPrices.findIndex(
            x => x.name === variantData.name
          )
          if (currentVariantIndex > -1) {
            spread[currentVariantIndex] = priceData
          } else {
            spread = [...spread, priceData]
          }

          return spread
        }

        return [priceData]
      }

      const fixedPrices = setFixedPrices()
      const updateResult = await update({ fixedAppPrices: fixedPrices })
      if (updateResult.success) {
        onSuccessClose({ name: variantData.name, ...getValues() })
        setIsOpen(false)
        reset()
      } else {
        toast.show(updateResult)
      }
    }

    function handleClose () {
      setIsOpen(false)
      reset()
    }

    return (
      <Modal
        onClose={handleClose}
        isOpen={isOpen}
        size={'4xl'}
        motionPreset='slideInBottom'
        // onCloseComplete={() => reset()}
        scrollBehavior='inside'
      >
        <ModalOverlay />
        <ModalContent color='white' bg='#091927' h='full'>
          <ModalHeader
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            fontSize='md'
          >
            <Text>Pricing Strategy Setup For</Text>
          </ModalHeader>
          <ModalCloseButton
            mt='1'
            _hover={{
              bg: '#143554'
            }}
          />
          <ModalBody pb='5'>
            <Button
              {...SiteStyles.ButtonStyles}
              borderStyle='dashed'
              leftIcon={<BiPlus />}
              size='sm'
            >
              Create Variation
            </Button>
            <Select
              // options={currencies}
              className='react_select'
              isMulti
              placeholder='Select currency...'
              // onChange={e => updatePricingStrategy('currency', e.value)}
              components={{
                NoOptionsMessage: LoadingOption
              }}
              // value={pricingData.currency}
              isLoading={isUpdating}
              styles={ReactSelectStyles}
            />
            {/* <VStack>
              <Text fontSize='md'>
                How much will you charge for{' '}
                <span
                  style={{
                    textTransform: 'capitalize',
                    color: 'teal',
                    fontWeight: 'bold'
                  }}
                >
                  {variantData?.name}
                </span>
                -like apps?
              </Text>
              <form>
                <HStack>
                  <Input placeholder='Min. Amount' {...register('minAmount')} />
                  <Divider
                    w='20px'
                    orientation='horizontal'
                    borderColor='gray.400'
                  />
                  <Input placeholder='Max. Amount' {...register('maxAmount')} />
                </HStack>
              </form>
            </VStack> */}
          </ModalBody>
          <ModalFooter bg='#143554' border='none'>
            <Button
              size='sm'
              colorScheme='blue'
              // isDisabled={}
              onClick={performUpdate}
              isLoading={isUpdating}
              loadingText='Updating'
            >
              Set Price
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }
)

/**
 *
 * @param {object} props The component props
 * @param {'success' | 'error'} props.type The type of info to show.
 * @param {''} props.title The title.
 * @param {Object} props.description The description.
 * @param {import('@chakra-ui/react').StackProps} props.containerProps The props for the parent `<HStack/>`.
 * @param {} props.children The description.
 * @param {'vertical' | 'horizontal'} props.childNestingType The description.
 */
export const InfoBox = ({
  type,
  title,
  description,
  containerProps,
  children,
  childNestingType = 'vertical'
}) => {
  return type === 'success' ? (
    <HStack
      bg='#5a207560'
      color='white'
      pl='2'
      pr='4'
      pt='2'
      pb='2'
      borderLeftWidth='medium'
      borderLeftColor='#5d06c7'
      borderRadius='sm'
      align='flex-start'
      borderRightRadius='md'
      fontSize='sm'
      {...containerProps}
    >
      <BsFillCheckCircleFill size={20} style={{ marginTop: '3px' }} />
      <VStack fontSize='md' fontWeight='medium'>
        <Text className='infobox_title'>
          {title}
          <br style={{ lineHeight: '10px' }} />
          <span className='infobox_desc' style={{ fontWeight: 'normal' }}>
            {description}
          </span>
        </Text>
        {childNestingType === 'vertical' && children}
      </VStack>
    </HStack>
  ) : (
    <HStack
      bg='#75204d60'
      color='white'
      pl='2'
      pr='4'
      pt='2'
      pb='2'
      borderLeftWidth='medium'
      borderLeftColor='red.600'
      borderRadius='sm'
      align='flex-start'
      borderRightRadius='md'
      {...containerProps}
    >
      <BiXCircle size={20} style={{ marginTop: '1px' }} />
      <VStack fontSize='md' fontWeight='medium' align='flex-start'>
        <Text className='infobox_title'>
          {title}
          <br style={{ lineHeight: '10px' }} />
          <span className='infobox_desc' style={{ fontWeight: 'normal' }}>
            {description}
          </span>
        </Text>
        {childNestingType === 'vertical' && children}
      </VStack>
    </HStack>
  )
}

const Role_Icons = ({ size = '20', color = '#000' }) => ({
  'front-end': <DiReact size={size} color={color} />,
  'back-end': <BsCode size={size} color={color} />,
  'qa-tester': <TbTestPipeOff size={size} color={color} />,
  devops: <FaAws size={size} color={color} />,
  'project-manager': <MdOutlineManageAccounts size={size} color={color} />,
  'ui-designer': <IoColorPaletteOutline size={size} color={color} />,
  'ux-designer': <MdDevices size={size} color={color} />
})

const shadowColor = index => {
  const colors = ['83,140,255', '253,83,255', '255,147,83']
  return colors[index] || colors[0]
}

export const RoleBox = ({ index, role, rate, currency, roleCount }) => {
  return (
    <VStack
      transition='all 300ms'
      h='max-content'
      w='full'
      shadow='sm'
      // boxShadow={`-2px 13px 23px -5px rgba(${shadowColor(index)},0.19)`}
      borderRadius='md'
      borderWidth='thin'
      borderColor='gray.200'
      pl='4'
      pr='4'
      pt='2'
      pb='2'
      minW='200px'
      maxW='250px'
      align='flex-start'
      _hover={{
        borderColor: 'blue.200',
        shadow: 'lg'
      }}
    >
      <HStack align='flex-start'>
        <Box p='1' borderRadius='full' bg='gray.100' color={shadowColor(index)}>
          {
            Role_Icons({
              color: `rgb(${shadowColor(index)})`
            })[role]
          }
        </Box>
        <VStack spacing='0' align='flex-start'>
          <HStack>
            <Text fontSize='sm' fontWeight='normal' textTransform='capitalize'>
              {role}
            </Text>
          </HStack>
          <Text fontSize='xx-small' fontWeight='bold'>
            {roleCount} People
          </Text>
          <Text fontSize='sm' fontWeight='thin' pt='2'>
            {rate} {currency}
          </Text>
        </VStack>
      </HStack>
    </VStack>
  )
}
