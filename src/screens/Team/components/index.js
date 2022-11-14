import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  HStack,
  IconButton,
  Input,
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
  Tr,
  VStack
} from '@chakra-ui/react'
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import validator from 'validator'
import { BiX } from 'react-icons/bi'

import DropDown from 'react-dropdown'
import 'react-dropdown/style.css'

const OrgAccessOptions = [
  {
    label: 'Developer',
    value: 'developer',
    tooltip: 'User will have access to the project(s), his team is assigned to.'
  },
  {
    label: 'Manager',
    value: 'manager',
    tooltip:
      'User can manage/see all projects, project requests, client lists and invoices. The user will not have access to organization profile settings incl. payment methods.'
  },
  {
    label: 'Admin',
    value: 'admin',
    tooltip:
      'User will have full-admin access of your organization. However, user cannot remove other admins.'
  }
]

export const MemberDetailsModal = React.forwardRef(({ projectId }, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const [orgAccessLevel, setOrgAccessLevel] = useState(
    OrgAccessOptions[0].value
  )

  function open () {
    setIsOpen(true)
  }

  useImperativeHandle(ref, () => ({
    open
  }))

  return (
    <Modal
      onClose={() => setIsOpen(false)}
      isOpen={isOpen}
      scrollBehavior='inside'
      size={'xl'}
      motionPreset='slideInBottom'
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
            User Details
          </Text>
        </ModalHeader>
        <ModalCloseButton mt='1' />
        <ModalBody pt='5'>
          <VStack spacing='4' align='flex-start' w='100%'>
            <HStack>
              <Avatar size='lg' name='Aousaf Rashid' borderRadius='md' />
              <Text fontSize='md' fontWeight='semibold'>
                aousafr<Text fontSize='xs'>aousafr@gmail.com</Text>
                <Badge colorScheme='orange'>Developer</Badge>
              </Text>
            </HStack>
            <Box w='100%' shadow='md'>
              <Text
                fontSize='xs'
                fontWeight='semibold'
                w='100%'
                bg='gray.100'
                p='2'
                pl='4'
              >
                PROJECT ACCESS
              </Text>
              <Box p='2' pl='4' pr='4'>
                <Text fontSize='xs' fontWeight='medium'>
                  If this team member is added to a team, you can manage the
                  team's <i>Project Access</i> instead
                </Text>
                <Text fontSize='xs' fontWeight='medium' mt='2'>
                  Team Name: <Badge colorScheme='purple'>Agile Front-End</Badge>
                </Text>
              </Box>
            </Box>
            <Box w='100%' shadow='md'>
              <Text
                fontSize='xs'
                fontWeight='semibold'
                w='100%'
                bg='gray.100'
                p='2'
                pl='4'
              >
                ORGANIZATION ACCESS
              </Text>
              <Box p='2' pl='4' pr='4'>
                <RadioGroup
                  defaultValue={OrgAccessOptions[0].value}
                  onChange={val => setOrgAccessLevel(val)}
                >
                  {OrgAccessOptions.map(option => (
                    <Radio
                      key={option.value}
                      colorScheme='green'
                      value={option.value}
                      mr='2'
                      mb='2'
                    >
                      <Text fontSize='xs' fontWeight='medium'>
                        {option.label}
                      </Text>
                    </Radio>
                  ))}
                </RadioGroup>

                <Text fontSize='xs' fontWeight='medium'>
                  {
                    OrgAccessOptions.filter(x => x.value === orgAccessLevel)[0]
                      .tooltip
                  }
                </Text>
              </Box>
            </Box>
          </VStack>
        </ModalBody>
        <Divider />
        <ModalFooter justifyContent='flex-end'>
          <Button size='xs' colorScheme='blue' variant='solid' ml='2'>
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
})

const Roles = [
  'Front-End Developer',
  'Back-End Developer',
  'QA Tester',
  'DevOps Engineer',
  'Project Manager',
  'UI Designer'
]

const EmploymentTypes = ['Full-Time (> 30hrs/week)', 'Part-Time (< 30hrs/week)']

const SalaryTypes = ['Yearly', 'Hourly']

export const AddMemberModal = React.forwardRef(({ projectId }, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const [inviteeList, setInviteeList] = useState([])
  const emailInputRef = useRef()

  function open () {
    setIsOpen(true)
  }

  useImperativeHandle(ref, () => ({
    open
  }))

  function addMemberToList (key) {
    const email = emailInputRef.current.value
    if (key === 'Enter') {
      if (!inviteeList.some(x => x.email === email))
        setInviteeList(prev => [
          ...prev,
          {
            email
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
    if (emailInputRef.current) emailInputRef.current.value = ''
  }, [inviteeList?.length])

  return (
    <Modal
      onClose={() => setIsOpen(false)}
      isOpen={isOpen}
      size={'5xl'}
      motionPreset='slideInBottom'
      onCloseComplete={() => setInviteeList([])}
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
            Add New Members
          </Text>
        </ModalHeader>
        <ModalCloseButton mt='1' />
        <ModalBody pt='5' pb='5'>
          <VStack spacing='1' align='flex-start'>
            <Text fontSize='sm'>
              Add your team members to your Flito organization account. You can
              assign roles to each member.
            </Text>
            <Text fontSize='sm' pb='3'>
              Your team members' salary affects{' '}
              <b>
                <i>quotations generated by the widget,</i>
              </b>{' '}
              if you set your pricing strategy as{' '}
              <b>
                <i>Horuly</i>
              </b>
            </Text>
            <Input
              ref={emailInputRef}
              placeholder="Enter member's full name & hit ENTER ↵"
              size='sm'
              maxW='350px'
              onKeyDown={e => addMemberToList(e.key)}
            />
          </VStack>
          {inviteeList?.length > 0 && (
            <TableContainer
              w='100%'
              // overflowY='scroll !important'
              maxH='500px'
              borderWidth='1px'
              borderColor='blue.100'
              borderRadius='md'
              mt='3'
              pos='relative'
              className='custom-table'
            >
              <Table size='sm'>
                <Thead bg='gray.100'>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Role</Th>
                    <Th>Employment Type</Th>
                    <Th>Salary Type</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody fontWeight='normal'>
                  {inviteeList?.map((invitee, index) => (
                    <Tr
                      _hover={{
                        bg: 'gray.50'
                      }}
                      key={index}
                    >
                      <Td>
                        <Text fontSize='smaller' fontWeight='medium'>
                          {invitee.email}
                        </Text>
                      </Td>
                      <Td maxW='140px'>
                        <DropDown
                          menuClassName='custom-dropdown'
                          options={Roles}
                          placeholder='Select ...'
                        />
                      </Td>
                      <Td maxW='160px'>
                        <DropDown
                          menuClassName='custom-dropdown'
                          options={EmploymentTypes}
                          placeholder='Select ...'
                        />
                      </Td>
                      <Td maxW='200px'>
                        <HStack>
                          <DropDown
                            menuClassName='custom-dropdown'
                            options={SalaryTypes}
                            placeholder='Select ...'
                          />
                          <Input size='sm' placeholder='Amount in USD' />
                        </HStack>
                      </Td>
                      <Td textAlign='right'>
                        <IconButton
                          size='xs'
                          icon={<BiX size={16} />}
                          colorScheme='gray'
                          variant='solid'
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
        <Divider />
        <ModalFooter bg='gray.50'>
          <Button
            size='sm'
            colorScheme='blue'
            isDisabled={inviteeList?.length <= 0}
          >
            Add Members
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
})
