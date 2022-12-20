import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  HStack,
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
  VStack
} from '@chakra-ui/react'
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import validator from 'validator'
import { BiCheck, BiX } from 'react-icons/bi'

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
import '../index.css'
import { BsChevronDown } from 'react-icons/bs'

export const AddMemberModal = React.forwardRef(({ onSuccessClose }, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const [inviteeList, setInviteeList] = useState([])
  const nameInputRef = useRef()
  const { update, isUpdating } = useProfile()
  const toast = useToastGenerator()

  function open () {
    setIsOpen(true)
  }

  useImperativeHandle(ref, () => ({
    open
  }))

  function addMemberToList (key) {
    const name = nameInputRef.current.value
    if (key === 'Enter') {
      if (!inviteeList.some(x => x.name === name))
        setInviteeList(prev => [
          ...prev,
          {
            name
          }
        ])
    }
  }

  function removeInvitee (index) {
    let invitees = [...inviteeList]
    invitees.splice(index, 1)
    setInviteeList(invitees)
  }

  useEffect(() => {
    if (nameInputRef.current) nameInputRef.current.value = ''
  }, [inviteeList?.length])

  function updateInvitee ({ key, nestedKey, val, inviteeName }) {
    setInviteeList(prev => {
      let spread = [...prev]
      const updIndex = inviteeList.findIndex(x => x.name === inviteeName)
      if (nestedKey) {
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
    // console.log('Result:', inviteeList)
    const spread = inviteeList.map(single => {
      let invitee = { ...single }
      if (invitee.salary.type === 'yearly') {
        invitee.salary.principalAmount = invitee.salary.rate

        const hoursInWeek =
          invitee.employmentType === Constants.MemberEmploymentTypes[0].value
            ? 35
            : 25
        invitee.salary.rate = Math.floor(
          invitee.salary.principalAmount / 12 / (hoursInWeek * 4)
        )
        /// ^^^ Above, We devide yearly salary by 12 (months in a year),
        /// So we have their monthly salary. Then we devide it by hoursInWeek (considering they work, say, 35 hrs/week, so we multiply 35 * 4(number of weeks in a month))
      }

      return invitee
    })
    const result = await update({ team: arrayUnion(...spread) })
    toast.show(result)
    if (result.success) {
      setIsOpen(false)
      onSuccessClose()
    }
  }

  const memberTags = {
    Role: { key: 'role', values: Constants.MemberRoles },
    Employment: {
      key: 'employmentType',
      values: Constants.MemberEmploymentTypes
    },
    'Salary Type': { key: 'salary.type', values: Constants.MemberSalaryTypes }
  }

  function getTagbtnTitle (inviteeName) {
    const invitee = { ...inviteeList.find(x => x === inviteeName) }
    delete invitee.name
    if (Object.keys(invitee)?.length > 0) {
      if (Object.keys(invitee)?.length < Object.keys(memberTags)?.length) {
        /// If any property value has been added to an invitee
        return `${
          Object.keys(memberTags)?.length - Object.keys(invitee)?.length
        } Pending`
      } else {
        /// If all property values have been added to invitee
        return 'Selected'
      }
    } else {
      /// If not property value has been added to invtee
      return 'Select Tags'
    }
  }

  function formValidity () {
    if (inviteeList?.length <= 0) {
      return {
        isValid: false,
        message: 'Add at-least one team member'
      }
    }

    const propertyCountMet = inviteeList.every(invitee => {
      let spread = { ...invitee }
      delete spread.name
      return (
        Object.keys(spread)?.length >= Object.keys(memberTags)?.length &&
        spread.salary.rate
      )
    })

    if (propertyCountMet) {
      return {
        isValid: true
      }
    } else {
      return {
        isValid: false,
        message: 'One or more members have missing properties.'
      }
    }
  }

  return (
    <Modal
      onClose={() => setIsOpen(false)}
      isOpen={isOpen}
      size={'2xl'}
      motionPreset='slideInBottom'
      onCloseComplete={() => setInviteeList([])}
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
            Add New Members
          </Text>
        </ModalHeader>
        <ModalCloseButton mt='0.5' />
        <ModalBody pt='5' pb='5'>
          <VStack spacing='1' align='flex-start'>
            <Text fontSize='sm'>
              Add new team-members and set their roles, employment type,
              salaries etc.
            </Text>
            <Text fontSize='sm' pb='3'>
              The provided data improves the Estimator's accuracy.
            </Text>
            <Input
              ref={nameInputRef}
              placeholder="Enter member's name & hit ENTER ↵"
              size='md'
              maxW='350px'
              onKeyDown={e => addMemberToList(e.key)}
              // {...SiteStyles}
              {...SiteStyles.InputStyles}
            />
          </VStack>
          {inviteeList?.length > 0 && (
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
                    <Th>Tags</Th>
                    {/* <Th>Employment Type</Th>*/}
                    <Th>Salary/Rate</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody fontWeight='normal'>
                  {inviteeList?.map((invitee, index) => (
                    <Tr
                      transition='all 200ms'
                      _hover={{
                        bg: '#0f283d50'
                      }}
                      key={index}
                    >
                      <Td>
                        <Text fontSize='smaller' fontWeight='medium'>
                          {invitee.name}
                        </Text>
                      </Td>
                      <Td>
                        <Menu closeOnSelect={false}>
                          <MenuButton
                            as={Button}
                            rightIcon={
                              getTagbtnTitle(invitee) === 'Selected' ? (
                                <BiCheck />
                              ) : (
                                <BsChevronDown />
                              )
                            }
                            {...SiteStyles.ButtonStyles}
                            size='sm'
                          >
                            {getTagbtnTitle(invitee)}
                          </MenuButton>
                          <MenuList
                            minWidth='240px'
                            maxH='200px'
                            overflow='scroll'
                            bg='#143554'
                          >
                            {Object.keys(memberTags).map((tag, index) => (
                              <>
                                <MenuOptionGroup
                                  // defaultValue='asc'
                                  title={tag}
                                  type='radio'
                                  key={`${tag}${index}`}
                                >
                                  {memberTags[tag].values.map(
                                    (tagItem, index) => (
                                      <MenuItemOption
                                        value={tagItem.value}
                                        _hover={{
                                          bg: '#0f283d'
                                        }}
                                        onClick={e => {
                                          const key = memberTags[
                                            tag
                                          ].key?.includes('.')
                                            ? memberTags[tag].key.split('.')[0]
                                            : memberTags[tag].key

                                          const nestedKey = memberTags[
                                            tag
                                          ].key?.includes('.')
                                            ? memberTags[tag].key.split('.')[1]
                                            : null

                                          updateInvitee({
                                            key: key,
                                            nestedKey: nestedKey,
                                            val: tagItem.value,
                                            inviteeName: invitee.name
                                          })
                                        }}
                                      >
                                        {tagItem.label}
                                      </MenuItemOption>
                                    )
                                  )}
                                </MenuOptionGroup>
                                {index < Object.keys(memberTags).length - 1 && (
                                  <MenuDivider />
                                )}
                              </>
                            ))}
                          </MenuList>
                        </Menu>
                      </Td>
                      <Td maxW='200px'>
                        <Input
                          size='sm'
                          placeholder='Amount'
                          onChange={e =>
                            updateInvitee({
                              key: 'salary',
                              nestedKey: 'rate',
                              val: e.target.value,
                              inviteeName: invitee.name
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
                          onClick={() => removeInvitee(index)}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
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
              Add Members
            </Button>
          </Tooltip>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
})
