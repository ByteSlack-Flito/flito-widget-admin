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
  PopoverBody,
  Spinner,
  Box,
  IconButton
} from '@chakra-ui/react'
import { AddMemberModal, RoleBoxEditable, RoleBoxSingle } from './components'
import { BiTrash, BiX } from 'react-icons/bi'
import { FiUserPlus } from 'react-icons/fi'
import './index.css'
import { useProfile } from '../../data/database/users/profile'
import { Constants } from '../../data/constants'
import { RoleBox } from '../PricingStrategy/components'

const TeamScreen = () => {
  const detailsModalRef = useRef()
  const addMemberModalRef = useRef()
  const { isFetching, data, get, update } = useProfile()
  const [deletingIndex, setDeletingIndex] = useState(-1)
  function showAddMemberScreen () {
    addMemberModalRef.current.open()
  }

  async function removeMember (index) {
    setDeletingIndex(index)

    const updatedTeam = data.team.filter((item, idx) => idx !== index)
    const updateResult = await update({
      team: updatedTeam
    })
    if (updateResult.success) {
      setDeletingIndex(-1)
      await get()
    }
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
      {/* <MemberDetailsModal ref={detailsModalRef} /> */}
      <AddMemberModal ref={addMemberModalRef} onSuccessClose={() => get()} />
      {isFetching && <Spinner size='md' color='blue.400' />}
      {!isFetching && (data.team?.length <= 0 || !data.team) && (
        <Text fontSize='md' fontWeight='normal'>
          Start adding team-members
        </Text>
      )}
      {/* <Box display='flex' flexWrap='wrap'>
        {Constants.MemberRoles.map(({ label, value }) => (
          <RoleBoxEditable roleName={label}/>
        ))}
      </Box> */}
      {!isFetching && data?.team?.length > 0 && (
        <TableContainer w='100%' overflowY='scroll !important' maxH='500px'>
          <Table size='sm'>
            <Thead bg='gray.100'>
              <Tr>
                <Th>Member</Th>
                <Th>Role</Th>
                <Th>Employment Type</Th>
                <Th>Salary Type</Th>
                <Th>Salary/Rate</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody fontWeight='normal'>
              {data?.team?.map((member, index) => (
                <Tr
                  _hover={{
                    bg: 'gray.100'
                  }}
                  key={index}
                >
                  <Td>{member.name}</Td>
                  <Td textTransform='capitalize'>{member.role}</Td>
                  <Td textTransform='capitalize'>
                    {
                      Constants.MemberEmploymentTypes.find(
                        x => x.value === member.employmentType
                      ).label
                    }
                  </Td>
                  <Td textTransform='capitalize'>{member.salary.type}</Td>
                  <Td textAlign='left' fontWeight='medium'>
                    {member.salary.principalAmount || member.salary.rate}
                    {member.salary.type?.toLowerCase() === 'hourly'
                      ? '/hr'
                      : '/yr'}
                  </Td>
                  <Td>
                    <Popover isLazy>
                      <PopoverTrigger>
                        <IconButton
                          onClick={e => e.stopPropagation()}
                          colorScheme='red'
                          // bg="red.300"
                          variant='solid'
                          p='2'
                          // pb='4'
                          // pt='4'
                          size='xs'
                          icon={<BiTrash />}
                        />
                      </PopoverTrigger>
                      <PopoverContent
                        color='white'
                        bg='blue.800'
                        borderColor='blue.800'
                        cursor='default'
                        onClick={e => e.stopPropagation()}
                      >
                        <PopoverArrow bg='blue.800' />
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
                            <Button
                              variant='solid'
                              colorScheme='red'
                              size='xs'
                              onClick={() => removeMember(index)}
                              isLoading={deletingIndex == index}
                              loadingText='Deleting'
                            >
                              Yes, Remove
                            </Button>
                          </HStack>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </VStack>
  )
}

export default TeamScreen

