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
  Input
} from '@chakra-ui/react'
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import { BiCheck, BiCheckCircle, BiXCircle } from 'react-icons/bi'
import { IoColorPaletteOutline } from 'react-icons/io5'
import { DiReact } from 'react-icons/di'
import { Link as ReactRouterLink } from 'react-router-dom'
import { BsCode, BsCodeSlash } from 'react-icons/bs'
import { TbTestPipeOff } from 'react-icons/tb'
import { FaAws } from 'react-icons/fa'
import { MdDevices, MdOutlineManageAccounts } from 'react-icons/md'
import '../index.css'
import { useToastGenerator } from '../../../components/global'
import AppListing from '../../../assets/jsons/appListing-v2.json'
import { groupBy } from '../../../misc/featureHelper'
import { AnimatePresence, motion } from 'framer-motion'
import { useForm } from 'react-hook-form'

export const FixedPricingSetupModal = React.forwardRef(
  ({ onSuccessClose }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const appVariants = groupBy(AppListing.options, 'type')
    const [variantIndex, setVariantIndex] = useState(0)
    const [isValid, setIsValid] = useState(false)
    const submitBtnRef = useRef()

    const { register, handleSubmit, reset, getValues, watch } = useForm({
      mode: 'onChange'
    })

    const toast = useToastGenerator()

    useEffect(() => {
      const subscription = watch((value, { name, type }) => {
        setIsValid(checkValidity(value))
      })
      return () => subscription.unsubscribe()
    }, [watch])

    function open () {
      setIsOpen(true)
    }

    useImperativeHandle(ref, () => ({
      open
    }))

    function goNext () {
      setVariantIndex(prev =>
        prev < Object.keys(appVariants).length - 1 ? ++prev : prev
      )
      reset()
    }

    function handleSave (vals) {
      console.log(vals)
    }

    const checkValidity = values => {
      const isNotEmptyOrZero = Object.keys(values).every(
        key => values[key]?.length > 0 && Number(values[key]) > 0
      )
      const isMaxGreater = Number(values?.maxAmount) > Number(values?.minAmount)
      return isNotEmptyOrZero && isMaxGreater
    }

    function performReset () {
      reset()
      setVariantIndex(0)
    }

    const AppViews = React.memo(() => {
      const apps = appVariants[Object.keys(appVariants)[variantIndex]].filter(
        (item, index) => index < 3
      )
      return (
        <SimpleGrid w='full' columns={3} gap='2'>
          {apps.map(app => {
            return (
              <HStack
                key={app.id}
                transition='all 300ms'
                pos='relative'
                h='max-content'
                spacing='3'
                borderRadius='md'
                borderWidth='thin'
                borderColor='gray.100'
                _hover={{
                  borderColor: 'teal.200'
                }}
                p='3'
                align='flex-start'
              >
                {/* <BiCheck/> */}
                <Image
                  src={app.iconSrc}
                  h='30px'
                  w='auto'
                  objectFit='contain'
                />
                <VStack align='flex-start' spacing='0'>
                  <Text fontSize='xs' fontWeight='medium'>
                    {app.title}
                  </Text>
                  <Text fontSize='xs' fontWeight='normal'>
                    {app.description?.substring(0, 55) + '...'}
                  </Text>
                </VStack>
              </HStack>
            )
          })}
        </SimpleGrid>
      )
    }, [appVariants, variantIndex])

    return (
      <Modal
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
        size={'3xl'}
        motionPreset='slideInBottom'
        onCloseComplete={performReset}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            bg='gray.50'
            display='flex'
            justifyContent='space-between'
            alignItems='center'
          >
            <Text w='max-content' fontSize='medium'>
              Setup Fixed Pricing Strategy
            </Text>
          </ModalHeader>
          <ModalCloseButton mt='1' />
          <ModalBody pt='5' pb='5'>
            <VStack>
              <AnimatePresence mode='wait'>
                <motion.div
                  key={variantIndex}
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -30, opacity: 0 }}
                  style={{ width: '100%' }}
                >
                  <VStack w='full' spacing='5'>
                    <Text fontSize='md' fontWeight='medium'>
                      Take a look at some
                      <span
                        style={{
                          color: 'teal',
                          fontWeight: 'bold',
                          textTransform: 'capitalize'
                        }}
                      >
                        {' '}
                        {Object.keys(appVariants)[variantIndex]}
                      </span>
                      -like projects
                    </Text>
                    <AppViews />
                    <VStack>
                      <Text>How much will you charge for similar apps?</Text>
                      <form onSubmit={handleSubmit(handleSave)}>
                        <HStack>
                          <Input
                            size='sm'
                            placeholder='Min. Amount'
                            {...register('minAmount', {
                              required: true,
                              maxLength: 8
                            })}
                          />
                          <Input
                            size='sm'
                            placeholder='Max. Amount'
                            {...register('maxAmount', {
                              required: true,
                              maxLength: 8
                            })}
                          />
                        </HStack>
                      </form>
                    </VStack>
                  </VStack>
                </motion.div>
              </AnimatePresence>
            </VStack>
          </ModalBody>
          <Divider />
          <ModalFooter bg='gray.50'>
            <Button
              ref={submitBtnRef}
              size='sm'
              colorScheme='blue'
              isDisabled={!isValid}
              onClick={goNext}
            >
              Move Next
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
      bg='#f1e8fc'
      color='#5d06c7'
      pl='2'
      pr='4'
      pt='2'
      pb='2'
      borderLeftWidth='medium'
      borderLeftColor='#5d06c7'
      borderRadius='sm'
      align='flex-start'
      borderRightRadius='md'
      {...containerProps}
    >
      <BiCheckCircle size='16' style={{ marginTop: '1px' }} />
      <VStack fontSize='xs' fontWeight='medium'>
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
      bg='#fce8e8'
      color='red.700'
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
      <BiXCircle size='16' style={{ marginTop: '1px' }} />
      <VStack fontSize='xs' fontWeight='medium' align='flex-start'>
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
