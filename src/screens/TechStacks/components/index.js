import { AnimatePresence, motion } from 'framer-motion'
import {
  BsCheck2,
  BsCheckAll,
  BsFillCheckCircleFill,
  BsPlusCircleDotted,
  BsThreeDotsVertical
} from 'react-icons/bs'
import {
  Badge,
  Box,
  HStack,
  VStack,
  Button,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  Textarea,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  InputGroup,
  InputLeftElement,
  InputLeftAddon,
  Spinner,
  Switch,
  Checkbox
} from '@chakra-ui/react'
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import validator from 'validator'
import { BiCheck, BiPencil, BiPlus, BiTrash, BiX } from 'react-icons/bi'

import DropDown from 'react-dropdown'
import 'react-dropdown/style.css'
import {
  updateProfile,
  useProfile,
  useWidget
} from '../../../data/database/users/profile'
import { useSelector } from 'react-redux'
import { SiteStyles, useToastGenerator } from '../../../components/global'
import { arrayUnion } from 'firebase/firestore'
import { Constants } from '../../../data/constants'
// import '../index.css'
import { BsChevronDown } from 'react-icons/bs'
import { uuidv4 } from '@firebase/util'
import './components.css'
import { useMicroServices } from '../../../data/database/users/services'
import { StringHelper } from '../../../data/extensions/stringHelper'
import { FiEdit, FiEdit2 } from 'react-icons/fi'
import { AiFillTool, AiOutlineSetting } from 'react-icons/ai'
import { DeleteButton } from '../../ProjectRequests/components'
import axios from 'axios'

function getSelectedStyle (selected) {
  if (selected)
    return {
      // bgGradient: 'linear(to-tr, #7928CA, #FF0080)',
      // borderWidth: 'medium',
      bg: '#0f283d',
      borderWidth: 'thin',
      borderColor: 'transparent',
      color: 'white',
      _hover: {
        color: 'white'
        // borderColor: 'blue.300'
      }
    }
}

export const AppTypeSingle = ({
  isEditable,
  isEnabled,
  icon,
  value,
  title,
  description,
  onClick = () => {},
  onEdit
}) => {
  return (
    <Box
      transition='all 200ms'
      w='300px'
      h='auto'
      {...SiteStyles.ClickableContainer}
      onClick={onClick}
      justifyContent='space-between'
      {...getSelectedStyle(isEnabled)}
    >
      <VStack textAlign='left' align='flex-start' role='group'>
        <HStack w='full' justify='space-between'>
          <HStack align='flex-start'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={isEnabled}
                initial={{ x: 10, opacity: 1 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -10, opacity: 0 }}
                style={{
                  width: '20px',
                  marginTop: '4px'
                }}
              >
                {isEnabled ? <BsFillCheckCircleFill color='white' /> : icon}
              </motion.div>
            </AnimatePresence>
            <Text fontSize='md' fontWeight='normal'>
              {title}
            </Text>
          </HStack>
          {isEditable && (
            <Tooltip
              bg='white'
              color='black'
              label='Edit'
              fontSize='xs'
              hasArrow
            >
              <IconButton
                icon={<FiEdit2 />}
                size='xs'
                // {...SiteStyles.DeleteButton}
                bg='#0f283d'
                borderWidth='thin'
                borderColor='transparent'
                _hover={{
                  bg: 'teal'
                }}
                _active={{
                  bg: 'teal'
                }}
                _groupHover={{
                  borderColor: '#205480'
                }}
                onClick={e => {
                  e.stopPropagation()
                  onEdit && onEdit()
                }}
              />
            </Tooltip>
          )}
        </HStack>
        <Text fontWeight='thin' fontSize='sm'>
          {description}
        </Text>
      </VStack>
    </Box>
  )
}

const CreateService = ({ onClick }) => {
  return (
    <Box
      transition='all 200ms'
      w='250px'
      h='100%'
      {...SiteStyles.ClickableContainer}
      onClick={onClick}
      justifyContent='space-between'
      role='group'
    >
      <VStack textAlign='center' align='center' justify='center'>
        <HStack>
          <BsPlusCircleDotted size={20} />
          <Text fontSize='md' fontWeight='normal' display='flex'>
            Create Service
          </Text>
        </HStack>
        <Text fontWeight='thin' fontSize='sm'>
          Offer new services like SEO, Backlinking etc, to your clients
        </Text>
      </VStack>
    </Box>
  )
}

export const AddServiceModal = React.forwardRef(({ onSuccessClose }, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const [microServices, setMicroServices] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isExistingData, setIsExistingData] = useState(false)
  const [serviceDetails, setServiceDetails] = useState({
    chargeType: 'bundle',
    description: '',
    enabled: false,
    name: ''
  })
  const { isUpdating, add, update, isDeleting, _delete } = useMicroServices()
  const toast = useToastGenerator()

  function open (param) {
    if (param) {
      setIsExistingData(false)
      setIsLoading(true)
      const spread = { ...param }
      const micros = spread.microServices
      delete spread.microServices
      setServiceDetails(spread)
      setMicroServices(micros)

      setTimeout(() => {
        setIsLoading(false)
        setIsExistingData(true)
      }, 1000)
    } else {
      setIsExistingData(false)
    }
    setIsOpen(true)
  }

  useImperativeHandle(ref, () => ({
    open
  }))

  function addMicroService () {
    setMicroServices(prev => [
      ...prev,
      {
        uid: uuidv4(),
        enabled: false,
        name: ''
      }
    ])
  }

  function addVariationToMicro (microIndex) {
    setMicroServices(prev => {
      let spread = [...prev]
      const microService = { ...spread[microIndex] }
      if (microService) {
        const micro_variations = microService.variations
          ? [...microService.variations]
          : []
        microService.variations = [
          ...micro_variations,
          { uid: uuidv4(), name: '' }
        ]
      }

      spread[microIndex] = microService
      return spread
    })
  }

  function removeMicro (microIndex) {
    let spread = [...microServices]
    spread.splice(microIndex, 1)
    setMicroServices(prev => {
      const spreadMicros = [...prev]
      spreadMicros.splice(microIndex, 1)

      return spreadMicros
    })
  }

  function removeVariation ({ microIndex, variationIndex }) {
    setMicroServices(prev => {
      let spread = [...prev]
      const microService = { ...spread[microIndex] }
      if (microService) {
        const micro_variations = [...microService.variations]
        micro_variations.splice(variationIndex, 1)

        microService.variations = micro_variations
      }
      spread[microIndex] = microService

      return spread
    })
  }

  function updateMicroService ({ key, nestedKey, value, microIndex }) {
    setMicroServices(prev => {
      let spread = [...prev]
      const updIndex = microIndex
      if (nestedKey) {
        if (!spread[updIndex][key]) {
          spread[updIndex][key] = {}
        }
        spread[updIndex][key][nestedKey] = value
      } else {
        spread[updIndex][key] = value
      }
      return spread
    })
  }

  function updateMicro_Variation ({
    key,
    nestedKey,
    value,
    microIndex,
    variationIndex
  }) {
    setMicroServices(prev => {
      let spread = [...prev]

      const microService = spread[microIndex]

      if (microService && microService?.variations?.length > 0) {
        const micro_variations = [...microService.variations]
        const updatingIndex = variationIndex
        if (nestedKey) {
          if (!micro_variations[updatingIndex][key]) {
            micro_variations[updatingIndex][key] = {}
          }
          micro_variations[updatingIndex][key][nestedKey] = value
        } else {
          micro_variations[updatingIndex][key] = value
        }
      }

      return spread
    })
  }

  async function performUpdate () {
    const service = {
      ...serviceDetails,
      microServices: microServices
    }
    const result = !isExistingData
      ? await add(service)
      : await update(serviceDetails.uid, service)
    toast.show(result)
    if (result.success) {
      setIsOpen(false)
      onSuccessClose()
    }
  }

  async function performDelete () {
    const result = await _delete(serviceDetails?.uid)
    if (result.success) {
      setIsOpen(false)
      onSuccessClose()
    } else {
      toast.show(result)
    }
  }

  function formValidity () {
    if (microServices?.length <= 0) {
      return {
        isValid: false,
        message: 'Add at-least one micro service'
      }
    }

    const service_propValid = !StringHelper.isPropsEmpty(serviceDetails, [
      'enabled'
    ])

    console.log('Service prop:', serviceDetails)

    const microService_propValid = microServices.every(
      micro => !StringHelper.isPropsEmpty(micro, ['enabled'])
    )

    const propertyCountMet = service_propValid && microService_propValid

    if (propertyCountMet) {
      return {
        isValid: true
      }
    } else {
      return {
        isValid: false,
        message: 'One or more micro-services have missing properties.'
      }
    }
  }

  async function performTest () {
    const api = process.env.REACT_APP_API_URL
    const result = await axios.post(`${api}/static/generateSample`, {
      uid: 'nuAmtvjqwVMeDyWN7QPJP8qXUZe2'
    })

    console.log('API Response is:', result.status)
  }

  return (
    <Modal
      onClose={() => setIsOpen(false)}
      isOpen={isOpen}
      size={'4xl'}
      motionPreset='slideInBottom'
      onCloseComplete={() => {
        setMicroServices([])
        setServiceDetails()
      }}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      scrollBehavior='inside'
    >
      <ModalOverlay />
      <ModalContent color='white' bg='#091927' h='full'>
        <ModalHeader
          // bg='#143554'
          display='flex'
          justifyContent='space-between'
          alignItems='center'
        >
          <Text w='max-content' fontSize='lg'>
            Offer A New Service
          </Text>
        </ModalHeader>
        <ModalCloseButton
          mt='1.5'
          _hover={{
            bg: '#143554'
          }}
        />
        <ModalBody h='100%' position='relative'>
          {isLoading && (
            <Spinner
              size='md'
              color='blue.400'
              position='absolute'
              top='50%'
              left='50%'
            />
          )}
          {!isLoading && (
            <VStack
              w='full'
              h='max-content'
              justify='flex-start'
              align='start'
              pt='3'
            >
              {isExistingData && (
                <Checkbox
                  defaultChecked={serviceDetails?.enabled}
                  onClick={() =>
                    setServiceDetails(prev => ({
                      ...prev,
                      enabled: !prev.enabled
                    }))
                  }
                >
                  Service is Enabled
                </Checkbox>
              )}
              <Input
                placeholder='Add Your Service Name'
                onChange={e =>
                  setServiceDetails(prev => ({ ...prev, name: e.target.value }))
                }
                value={serviceDetails?.name || ''}
                {...SiteStyles.InputStyles}
              />
              <Input
                placeholder={`Explain ${
                  serviceDetails?.name || 'this'
                } service in a few words`}
                value={serviceDetails?.description || ''}
                onChange={e =>
                  setServiceDetails(prev => ({
                    ...prev,
                    description: e.target.value
                  }))
                }
                {...SiteStyles.InputStyles}
              />
              <Text>How do you want to charge for this service?</Text>
              <RadioGroup
                value={serviceDetails?.chargeType}
                onChange={val =>
                  setServiceDetails(prev => ({
                    ...prev,
                    chargeType: val
                  }))
                }
              >
                <HStack>
                  <Radio value='bundle'>Bundle Wise</Radio>
                  <Radio value='feature'>Feature Wise</Radio>
                </HStack>
              </RadioGroup>
              <Box h='5px' />
              <Accordion
                w='full'
                allowMultiple={true}
                defaultIndex={[0]}
                allowToggle={false}
              >
                {microServices?.map((micro, index) => (
                  <SingleMicroService
                    key={`${index}`}
                    {...micro}
                    onUpdate={values =>
                      updateMicroService({ ...values, microIndex: index })
                    }
                    onVariationUpdate={values =>
                      updateMicro_Variation({ ...values, microIndex: index })
                    }
                    onAddVariation={() => addVariationToMicro(index)}
                    onRemove={() => removeMicro(index)}
                    onRemoveVariation={({ variationIndex }) =>
                      removeVariation({ microIndex: index, variationIndex })
                    }
                  />
                ))}
              </Accordion>
              <Button
                size='sm'
                onClick={addMicroService}
                leftIcon={<BiPlus />}
                {...SiteStyles.ButtonStyles}
                borderStyle='dashed'
              >
                Add New Micro-Service
              </Button>
            </VStack>
          )}
        </ModalBody>

        {!isLoading && (
          <ModalFooter
            justifyContent={isExistingData ? 'space-between' : 'flex-end'}
          >
            {isExistingData && (
              <DeleteButton
                onConfirm={performDelete}
                popoverTitle={'Delete service?'}
                popoverBody='If confirmed, the service will be deleted. This action is irreversible.'
                customButton={
                  <Button
                    size='sm'
                    // onClick={e => {
                    //   formValidity().isValid && performUpdate()
                    // }}
                    cursor={formValidity().isValid ? 'pointer' : 'not-allowed'}
                    // isLoading={isUpdating}
                    {...SiteStyles.DeleteButton_Main}
                  >
                    Delete
                  </Button>
                }
              ></DeleteButton>
            )}
            <Button {...SiteStyles.ButtonStyles} onClick={performTest}>
              Create Test
            </Button>
            <Tooltip
              placement='top'
              hasArrow
              label={formValidity().message}
              bg='white'
              color='#0f283d'
              p='2'
              pl='4'
              pr='4'
            >
              <Button
                size='sm'
                onClick={e => {
                  formValidity().isValid && performUpdate()
                }}
                cursor={formValidity().isValid ? 'pointer' : 'not-allowed'}
                isLoading={isUpdating}
                {...SiteStyles.ButtonStyles}
              >
                {isExistingData ? 'Update Service' : 'Create Service'}
              </Button>
            </Tooltip>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  )
})

/**
 *
 * @param {Object} props
 * @param {''} props.name The name of the micro service
 * @param {''} props.stepQuestion The question to ask for this micro service
 * @param {0} props.basePrice The base price for this micro service
 * @param {[{ name: '', uid: '', pricing: { type: '', rate: 0 } }] | []} props.variations The base price for this micro service
 * @param {({key, nestedKey, value}) => {}} props.onUpdate Function invoked when the micro-service has been updated
 * @param {({key, nestedKey, value, variationIndex}) => {}} props.onVariationUpdate Function invoked when any of the variation has been updated
 * @param {({}) => {}} props.onRemove Function invoked when the micro-service has been removed
 * @param {({variationIndex}) => {}} props.onRemoveVariation Function invoked when any of the variations has been removed
 * @param {() => {}} props.onAddVariation Function invoked when any of the variation has been removed
 * @returns
 */
const SingleMicroService = ({
  name,
  stepQuestion,
  basePrice,
  variations,
  onUpdate,
  onVariationUpdate,
  onRemove,
  onRemoveVariation,
  onAddVariation
}) => {
  const pricingOptions = {
    key: 'pricing.type',
    values: Constants.CustomServicePricingOptions
  }

  return (
    <AccordionItem
      borderWidth='thin'
      borderRadius='sm'
      borderColor='#143554'
      overflow='visible'
    >
      {({ isExpanded }) => (
        <>
          <AccordionButton cursor='default'>
            <Box as='span' flex='1' textAlign='left'>
              <Text>{name || 'Micro Service Name'}</Text>
            </Box>
            <IconButton
              icon={<BiTrash />}
              mr='2'
              {...SiteStyles.DeleteButton}
              onClick={e => {
                e.stopPropagation()
                onRemove()
              }}
            />
            <AccordionIcon cursor='pointer' />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <VStack align='flex-start' spacing='4'>
              <Input
                {...SiteStyles.InputStyles}
                placeholder={'Micro Service Name'}
                value={name || ''}
                onChange={e => onUpdate({ key: 'name', value: e.target.value })}
              />
              <Input
                {...SiteStyles.InputStyles}
                value={stepQuestion || ''}
                placeholder='Step Question. Ex. How Much Traffic Do You Want'
                onChange={e =>
                  onUpdate({ key: 'stepQuestion', value: e.target.value })
                }
              />
              {variations?.length > 0 && (
                <TableContainer
                  className='table-container'
                  w='100%'
                  maxH='500px'
                  borderRadius='md'
                  borderWidth='thin'
                  borderColor='teal.700'
                  mt='3'
                  pos='relative'
                >
                  <Table className='custom-table' size='sm'>
                    <Thead bg='#0f283d' h='35px' borderTopRadius='md'>
                      <Tr>
                        <Th borderTopLeftRadius='md'>Variation Name</Th>
                        <Th>Pricing Type</Th>
                        {/* <Th>Employment Type</Th>*/}
                        <Th>Rate</Th>
                        <Th borderTopRightRadius='md'></Th>
                      </Tr>
                    </Thead>
                    <Tbody fontWeight='normal'>
                      {variations?.map((micro, index) => (
                        <Tr
                          transition='all 200ms'
                          _hover={{
                            bg: '#0f283d50'
                          }}
                          key={`${index}`}
                        >
                          <Td>
                            <Input
                              size='sm'
                              placeholder='Set Name'
                              onChange={e =>
                                onVariationUpdate({
                                  key: 'name',
                                  value: e.target.value,
                                  variationIndex: index
                                })
                              }
                              value={micro.name || ''}
                              {...SiteStyles.InputStyles}
                            />
                          </Td>
                          <Td>
                            <RadioGroup
                              size='sm'
                              onChange={val => {
                                const key = 'pricing'
                                const nestedKey = 'type'
                                onVariationUpdate({
                                  key: key,
                                  nestedKey: nestedKey,
                                  value: val,
                                  variationIndex: index
                                })
                              }}
                              value={micro?.pricing?.type}
                            >
                              <HStack>
                                {pricingOptions.values.map((pricing, index) => (
                                  <Radio
                                    key={`${pricing.value}${index}`}
                                    value={pricing.value}
                                  >
                                    {pricing.label}
                                  </Radio>
                                ))}
                              </HStack>
                            </RadioGroup>
                          </Td>
                          <Td maxW='200px'>
                            <Input
                              size='sm'
                              placeholder='$10.00'
                              onChange={e =>
                                onVariationUpdate({
                                  key: 'pricing',
                                  nestedKey: 'amount',
                                  value: e.target.value,
                                  variationIndex: index
                                })
                              }
                              value={micro?.pricing?.amount || ''}
                              {...SiteStyles.InputStyles}
                            />
                            {/* </HStack> */}
                          </Td>
                          <Td textAlign='right'>
                            <IconButton
                              // onClick={e => e.stopPropagation()}
                              bg='#0f283d'
                              variant='solid'
                              p='2'
                              size='xs'
                              _active={{
                                bg: '#3d0f1b'
                              }}
                              _hover={{
                                bg: '#61162a'
                              }}
                              icon={<BiX size={16} />}
                              onClick={() =>
                                onRemoveVariation({ variationIndex: index })
                              }
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              )}
              {/* {isDigital && (
                <Button
                  size='xs'
                  onClick={onAddVariation}
                  leftIcon={<BiPlus />}
                  colorScheme='cyan'
                >
                  Add Variation
                </Button>
              )} */}
            </VStack>
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  )
}

export const StackCreatable = {
  CreateService
}

export const StackModals = {
  AddServiceModal
}
