import React, { useState, useEffect, useRef } from 'react'
import { Constants } from '../../data/constants'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Input,
  Text,
  VStack,
  InputLeftElement,
  InputGroup,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Badge,
  Tooltip,
  Tag,
  useToast,
  Spacer,
  Box,
  Spinner,
  SimpleGrid
} from '@chakra-ui/react'
import { FaSearch } from 'react-icons/fa'
import { ProjectSingle, RequestDetailsModal } from './components'
import { BiCheck } from 'react-icons/bi'
import { useProfile } from '../../data/database/users/profile'

const ProjectRequestScreen = () => {
  const detailsModalRef = useRef()
  const { isFetching, data, update } = useProfile()
  const [doneRead, setDoneRead] = useState([])

  useEffect(() => {}, [])

  async function showDetailsScreen (id) {
    detailsModalRef.current.setMetaId(id)
    detailsModalRef.current.open()

    const { projectRequests } = data

    const isRead =
      projectRequests?.find(x => x.metaId === id).isRead ||
      doneRead.includes(id)

    if (!isRead) {
      doneRead.push(id)
      let spread = [...projectRequests]
      const updatingIndex = spread.findIndex(x => x.metaId === id)
      spread[updatingIndex].isRead = true

      await update({ projectRequests: spread })
    }
  }

  return (
    <VStack align='flex-start' pt='3'>
      <Text fontSize='lg' fontWeight='normal'>
        Project Requests
      </Text>
      <Text fontSize='sm' fontWeight='normal'>
        List of all project requests.
      </Text>
      <RequestDetailsModal ref={detailsModalRef} />
      {isFetching && <Spinner size='md' color='blue.400' />}
      {!isFetching && (
        <Box w='full' display='flex' flexWrap='wrap'>
          {!data?.projectRequests && (
            <Text fontSize='md' fontWeight='normal' color='gray.500'>
              <i>
                No requests yet. Once someone uses the Flito Widget integrated
                on your webiste, you'll see all requests here.
              </i>
            </Text>
          )}
          {data?.projectRequests?.reverse()?.map(project => {
            const isRead = project.isRead || doneRead.includes(project.metaId)
            return (
              <ProjectSingle
                isRead={isRead}
                onClick={() => showDetailsScreen(project.metaId)}
                style={{
                  marginRight: '3',
                  marginBottom: '3',
                  maxW: '300px'
                }}
                {...project}
              />
            )
          })}
        </Box>
      )}
    </VStack>
  )
}

export default ProjectRequestScreen
