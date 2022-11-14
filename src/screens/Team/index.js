import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Text,
  VStack,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  HStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody
} from '@chakra-ui/react'
import { AddMemberModal, MemberDetailsModal } from './components'
import { BiX } from 'react-icons/bi'
import { FiUserPlus } from 'react-icons/fi'
import './index.css'

const MemberQuickActions = [
  [
    {
      title: 'Remove Member',
      tooltip:
        'Remove this user from your team. The user will be disassociated from teams, projects and will not be able to access this organization data.',
      icon: <BiX color='red' />
    }
  ]
]

const TeamScreen = () => {
  const detailsModalRef = useRef()
  const addMemberModalRef = useRef()

  function showDetailsScreen () {
    detailsModalRef.current.open()
  }
  function showAddMemberScreen () {
    addMemberModalRef.current.open()
  }
  return (
    <VStack align='flex-start' pt='3'>
      <Text fontSize='lg' fontWeight='normal'>
        My Team
      </Text>
      <Text fontSize='sm' fontWeight='normal'>
        List of all of your team members, tech stacks and more.
      </Text>
      <HStack spacing='2'>
        <Button
          size='xs'
          leftIcon={<FiUserPlus />}
          onClick={showAddMemberScreen}
          colorScheme='teal'
        >
          Add Team Members
        </Button>
      </HStack>
      <MemberDetailsModal ref={detailsModalRef} />
      <AddMemberModal ref={addMemberModalRef} />
      <TableContainer w='100%' overflowY='scroll !important' maxH='500px'>
        <Table size='sm'>
          <Thead bg='gray.100'>
            <Tr>
              <Th>Member</Th>
              <Th>Role</Th>
              <Th>Rate</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody fontWeight='normal'>
            <Tr
              _hover={{
                bg: 'gray.100'
              }}
              onClick={() => showDetailsScreen()}
              cursor='pointer'
            >
              <Td>
                <VStack
                  align='flex-start'
                  flexWrap='wrap'
                  spacing='0'
                  justify='flex-start'
                  whiteSpace='pre-line'
                  overflowWrap='break-word'
                >
                  <Text
                    color='blue.500'
                    fontWeight='semibold'
                    fontSize='smaller'
                  >
                    Aousaf Rashid
                  </Text>
                  <Text fontSize='small' fontWeight='medium'>
                    aousaf@flito.io
                  </Text>
                </VStack>
              </Td>
              <Td>
                <Text whiteSpace='pre-line' overflowWrap='break-word'>
                  Font-End Developer
                </Text>
              </Td>
              <Td textAlign='left' fontWeight='medium'>
                $45/hr
              </Td>
              <Td>
                <Popover isLazy>
                  <PopoverTrigger>
                    <Button
                      onClick={e => e.stopPropagation()}
                      colorScheme='red'
                      // bg="red.300"
                      variant='solid'
                      size='xs'
                    >
                      Remove
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    onClick={e => e.stopPropagation()}
                    cursor='default'
                  >
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>Remove member?</PopoverHeader>
                    <PopoverBody
                      whiteSpace='pre-line'
                      overflowWrap='break-word'
                    >
                      <Text fontSize='smaller'>
                        Are you sure you want to remove this member?
                      </Text>
                      <HStack mt='2'>
                        <Button variant='solid' colorScheme='red' size='xs'>
                          Yes, Remove
                        </Button>
                      </HStack>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  )
}

export default TeamScreen
