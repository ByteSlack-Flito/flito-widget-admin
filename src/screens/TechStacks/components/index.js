import { AnimatePresence, motion } from 'framer-motion'
import {
  BsCheck2,
  BsCheckAll,
  BsFillCheckCircleFill,
  BsPlusCircleDotted
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
  InputLeftAddon
} from '@chakra-ui/react'
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import validator from 'validator'
import { BiCheck, BiPlus, BiTrash, BiX } from 'react-icons/bi'

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
  isSelected,
  icon,
  value,
  title,
  description,
  onSelectChange
}) => {
  return (
    <Box
      transition='all 200ms'
      w='250px'
      h='full'
      {...SiteStyles.ClickableContainer}
      onClick={() => onSelectChange(value)}
      justifyContent='space-between'
      {...getSelectedStyle(isSelected)}
    >
      <VStack textAlign='left' align='flex-start'>
        <HStack>
          <AnimatePresence mode='wait'>
            <motion.div
              key={isSelected}
              initial={{ x: 10, opacity: 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              style={{
                width: '20px'
              }}
            >
              {isSelected ? <BsFillCheckCircleFill color='white' /> : icon}
            </motion.div>
          </AnimatePresence>
          <Text fontSize='md' fontWeight='normal' display='flex'>
            {title}
          </Text>
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
  const [serviceDetails, setServiceDetails] = useState({
    name: ''
  })
  const { isUpdating, add } = useMicroServices()
  const toast = useToastGenerator()

  function open () {
    setIsOpen(true)
  }

  useImperativeHandle(ref, () => ({
    open
  }))

  function addMicroService (key) {
    setMicroServices(prev => [
      ...prev,
      {
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
        microService.variations = [...micro_variations, { name: '' }]
      }

      spread[microIndex] = microService
      return spread
    })
  }

  function removeMicro (microIndex) {
    let spread = [...microServices]
    spread.splice(microIndex, 1)
    setMicroServices(prev => {
      let spread = [...microServices]
      spread.splice(microIndex, 1)

      return spread
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
    const result = await add(service)
    toast.show(result)
    if (result.success) {
      setIsOpen(false)
      onSuccessClose()
    }
  }

  function formValidity () {
    if (microServices?.length <= 0) {
      return {
        isValid: false,
        message: 'Add at-least one micro service'
      }
    }

    const service_propValid = !StringHelper.isPropsEmpty(serviceDetails)

    const microService_propValid = microServices.every(
      micro => !StringHelper.isPropsEmpty(micro)
    )

    const variation_propValid = microServices.every(micro =>
      micro.variations?.every(
        variation =>
          !StringHelper.isPropsEmpty(variation) &&
          variation.pricing?.type &&
          variation.pricing?.amount
      )
    )

    const propertyCountMet =
      service_propValid && microService_propValid && variation_propValid

    if (propertyCountMet) {
      return {
        isValid: true
      }
    } else {
      return {
        isValid: false,
        message: 'Property not set for one or more variations.'
      }
    }
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
          bg='#143554'
          display='flex'
          justifyContent='space-between'
          alignItems='center'
        >
          <Text w='max-content' fontSize='lg'>
            Offer A New Service
          </Text>
        </ModalHeader>
        <ModalCloseButton mt='1.5' />
        <ModalBody h='100%'>
          <VStack
            w='full'
            h='max-content'
            justify='flex-start'
            align='start'
            pt='3'
          >
            <Input
              placeholder='Add Your Service Name'
              onChange={e =>
                setServiceDetails(prev => ({ ...prev, name: e.target.value }))
              }
              {...SiteStyles.InputStyles}
            />
            <Input
              placeholder={`Explain ${serviceDetails?.name || 'this'} service in a few words`}
              onChange={e =>
                setServiceDetails(prev => ({
                  ...prev,
                  description: e.target.value
                }))
              }
              {...SiteStyles.InputStyles}
            />
            <Box h='2px' />
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
        </ModalBody>

        <ModalFooter>
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
              // isDisabled={!formValidity().isValid}
              onClick={e => {
                formValidity().isValid && performUpdate()
              }}
              cursor={formValidity().isValid ? 'pointer' : 'not-allowed'}
              isLoading={isUpdating}
              {...SiteStyles.ButtonStyles}
            >
              Create Service
            </Button>
          </Tooltip>
        </ModalFooter>
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
              <Text>{name || 'Micro Service 1'}</Text>
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
                placeholder='Micro Service Name'
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
              <InputGroup>
                <InputLeftAddon
                  bg='#143554'
                  children={'Base Price :'}
                  border='none'
                />
                <Input
                  {...SiteStyles.InputStyles}
                  placeholder='$10.00'
                  value={basePrice || ''}
                  onChange={e =>
                    onUpdate({ key: 'basePrice', value: e.target.value })
                  }
                />
              </InputGroup>
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
              <Button
                size='xs'
                // isDisabled={!formValidity().isValid}
                onClick={onAddVariation}
                leftIcon={<BiPlus />}
                colorScheme='cyan'
                // {...SiteStyles.ButtonStyles}
              >
                Add Variation
              </Button>
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
