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
  Textarea
} from '@chakra-ui/react'
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import validator from 'validator'
import { BiCheck, BiPlus, BiX } from 'react-icons/bi'

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
  const [microList, setMicroList] = useState([])
  const [serviceDetails, setServiceDetails] = useState({
    name: '',
    description: ''
  })
  const { isFetching, isUpdating, data, update } = useWidget()
  const toast = useToastGenerator()

  function open () {
    setIsOpen(true)
  }

  useImperativeHandle(ref, () => ({
    open
  }))

  function addMicroToList (key) {
    setMicroList(prev => [
      ...prev,
      {
        uid: uuidv4(),
        name: '',
        enabled: true
      }
    ])
  }

  function removeMicroService (index) {
    let invitees = [...microList]
    invitees.splice(index, 1)
    setMicroList(invitees)
  }

  function updateMicroService ({ key, nestedKey, val, microIndex }) {
    setMicroList(prev => {
      let spread = [...prev]
      // console.log('Main:', spread)
      const updIndex = microIndex
      if (nestedKey) {
        // console.log(`Key: ${key}, neseted: ${nestedKey}, val: ${val}`)
        if (!spread[updIndex][key]) {
          spread[updIndex][key] = {}
        }
        spread[updIndex][key][nestedKey] = val
      } else {
        spread[updIndex][key] = val
      }
      return spread
    })
  }

  async function performUpdate () {
    const service = {
      ...serviceDetails,
      uid: uuidv4(),
      microServices: microList,
      enabled: true
    }
    const result = await update({ serviceTypes: arrayUnion(service) })
    toast.show(result)
    if (result.success) {
      setIsOpen(false)
      onSuccessClose()
    }
  }

  const pricingOptions = {
    Options: {
      key: 'pricing.type',
      values: Constants.CustomServicePricingOptions
    }
  }

  function formValidity () {
    if (microList?.length <= 0) {
      return {
        isValid: false,
        message: 'Add at-least one micro service'
      }
    }

    const propertyCountMet =
      microList.every(micro => {
        let spread = { ...micro }
        return spread?.name && spread?.pricing?.type && spread?.pricing?.amount
      }) &&
      Object.keys(serviceDetails).every(
        key =>
          serviceDetails[key] !== undefined && serviceDetails[key]?.length > 0
      )

    if (propertyCountMet) {
      return {
        isValid: true
      }
    } else {
      return {
        isValid: false,
        message: 'One or more properties have not been set yet.'
      }
    }
  }

  return (
    <Modal
      onClose={() => setIsOpen(false)}
      isOpen={isOpen}
      size={'3xl'}
      motionPreset='slideInBottom'
      onCloseComplete={() => setMicroList([])}
    >
      <ModalOverlay />
      <ModalContent color='white' bg='#143554'>
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
        <ModalCloseButton mt='0.5' />
        <ModalBody pt='5' pb='5'>
          <VStack align='flex-start'>
            <Input
              placeholder='Service Name'
              size='md'
              // {...SiteStyles}
              onChange={e =>
                setServiceDetails(prev => ({ ...prev, name: e.target.value }))
              }
              {...SiteStyles.InputStyles}
            />
            <Textarea
              placeholder='Explain the service in a few words'
              size='md'
              maxH='100px'
              onChange={e =>
                setServiceDetails(prev => ({
                  ...prev,
                  description: e.target.value
                }))
              }
              // {...SiteStyles}
              {...SiteStyles.InputStyles}
            />
            {microList?.length > 0 && (
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
                  <Thead bg='#0f283d' h='35px'>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Pricing Options</Th>
                      {/* <Th>Employment Type</Th>*/}
                      <Th>Rate</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody fontWeight='normal'>
                    {microList?.map((micro, index) => (
                      <Tr
                        transition='all 200ms'
                        _hover={{
                          bg: '#0f283d50'
                        }}
                        key={index}
                      >
                        <Td>
                          <Input
                            size='sm'
                            placeholder='Set Name'
                            onChange={e =>
                              updateMicroService({
                                key: 'name',
                                val: e.target.value,
                                microIndex: index
                              })
                            }
                            {...SiteStyles.InputStyles}
                          />
                        </Td>
                        <Td>
                          <Menu closeOnSelect={false}>
                            <MenuButton
                              as={Button}
                              rightIcon={
                                microList[index]?.pricing?.type ? (
                                  <BiCheck />
                                ) : (
                                  <BsChevronDown />
                                )
                              }
                              {...SiteStyles.ButtonStyles}
                              size='sm'
                            >
                              {microList[index]?.pricing?.type
                                ? 'Selected'
                                : 'Select'}
                            </MenuButton>
                            <MenuList
                              minWidth='240px'
                              maxH='200px'
                              overflow='scroll'
                              bg='#143554'
                            >
                              {Object.keys(pricingOptions).map(
                                (tag, tagIndex) => (
                                  <>
                                    <MenuOptionGroup
                                      // defaultValue='asc'
                                      title={tag}
                                      type='radio'
                                      key={`${tag}${tagIndex}`}
                                    >
                                      {pricingOptions[tag].values.map(
                                        (tagItem, tagItemIndex) => (
                                          <MenuItemOption
                                            key={`${tagItem}${tagItemIndex}`}
                                            value={tagItem.value}
                                            _hover={{
                                              bg: '#0f283d'
                                            }}
                                            _focus={{
                                              bg: '#0f283d'
                                            }}
                                            onClick={e => {
                                              const key = pricingOptions[
                                                tag
                                              ].key?.includes('.')
                                                ? pricingOptions[tag].key.split(
                                                    '.'
                                                  )[0]
                                                : pricingOptions[tag].key

                                              const nestedKey = pricingOptions[
                                                tag
                                              ].key?.includes('.')
                                                ? pricingOptions[tag].key.split(
                                                    '.'
                                                  )[1]
                                                : null

                                              updateMicroService({
                                                key: key,
                                                nestedKey: nestedKey,
                                                val: tagItem.value,
                                                microIndex: index
                                              })
                                            }}
                                          >
                                            {tagItem.label}
                                          </MenuItemOption>
                                        )
                                      )}
                                    </MenuOptionGroup>
                                    {index <
                                      Object.keys(pricingOptions).length -
                                        1 && <MenuDivider />}
                                  </>
                                )
                              )}
                            </MenuList>
                          </Menu>
                        </Td>
                        <Td maxW='200px'>
                          <Input
                            size='sm'
                            placeholder='Amount'
                            onChange={e =>
                              updateMicroService({
                                key: 'pricing',
                                nestedKey: 'amount',
                                val: e.target.value,
                                microIndex: index
                              })
                            }
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
                            onClick={() => removeMicroService(index)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}

            <Button
              size='sm'
              // isDisabled={!formValidity().isValid}
              onClick={addMicroToList}
              leftIcon={<BiPlus />}
              {...SiteStyles.ButtonStyles}
            >
              {microList.length <= 0 ? 'Add micro-service' : 'Add another'}
            </Button>
          </VStack>
        </ModalBody>
        {!formValidity().message?.includes('at-least one') && (
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
        )}
      </ModalContent>
    </Modal>
  )
})

export const StackCreatable = {
  CreateService
}

export const StackModals = {
  AddServiceModal
}
