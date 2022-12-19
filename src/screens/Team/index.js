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
  IconButton,
  Flex,
  SimpleGrid,
  Badge
} from '@chakra-ui/react'
import { AddMemberModal, RoleBoxEditable, RoleBoxSingle } from './components'
import { BiTrash, BiX } from 'react-icons/bi'
import { FiUserPlus } from 'react-icons/fi'
import './index.css'
import { useProfile } from '../../data/database/users/profile'
import { Constants } from '../../data/constants'
import { RoleBox } from '../PricingStrategy/components'
import { ScreenContainer, SiteStyles } from '../../components/global'

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

  const RoleIcons = []

  return (
    <ScreenContainer description='Set up your team. The Estimator uses your team-data to generate more accurate quotations.'>
      <VStack align='flex-start' pr='2'>
        <HStack spacing='2' pb='2'>
          <Button
            size='sm'
            leftIcon={<FiUserPlus />}
            onClick={showAddMemberScreen}
            {...SiteStyles.ButtonStyles}
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

        {!isFetching && data?.team?.length > 0 && (
          <TableContainer
            w='100%'
            overflowY='scroll !important'
            maxH='500px'
            borderRadius='md'
            borderWidth='thin'
            borderColor='#0f283d'
          >
            <Table className='custom-table' size='sm'>
              <Thead bg='#0f283d' h='35px'>
                <Tr>
                  <Th>Member</Th>
                  <Th>Role</Th>
                  <Th>Employment Type</Th>
                  {/* <Th>Salary Type</Th> */}
                  <Th>Salary/Rate</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody fontWeight='normal'>
                {data?.team?.map((member, index) => {
                  const empType = Constants.MemberEmploymentTypes.find(
                    x => x.value === member.employmentType
                  ).label.split('(')[0]

                  return (
                    <Tr
                      transition='all 200ms'
                      _hover={{
                        bg: '#0f283d50'
                      }}
                      key={index}
                    >
                      <Td>{member.name}</Td>
                      <Td textTransform='capitalize'>{member.role}</Td>
                      <Td textTransform='capitalize'>
                        <HStack>
                          <Badge
                            bg='#143554'
                            color='white'
                            p='0.5'
                            pl='2'
                            pr='2'
                            borderRadius='sm'
                          >
                            {empType}
                          </Badge>
                          <Badge
                            bg='#543d63'
                            color='white'
                            p='0.5'
                            pl='2'
                            pr='2'
                            borderRadius='sm'
                          >
                            {member.salary.type}
                          </Badge>
                        </HStack>
                      </Td>
                      {/* <Td textTransform='capitalize'>{member.salary.type}</Td> */}
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
                  )
                })}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </VStack>
    </ScreenContainer>
  )
}

export default TeamScreen
