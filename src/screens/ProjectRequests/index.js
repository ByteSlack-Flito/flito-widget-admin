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
  SimpleGrid,
  Flex
} from '@chakra-ui/react'
import { FaSearch } from 'react-icons/fa'
import { ProjectSingle, RequestDetailsModal } from './components'
import { BiCheck } from 'react-icons/bi'
import { useProfile } from '../../data/database/users/profile'
import { useProjectRequest } from '../../data/database/users/projectRequests'
import { ScreenContainer } from '../../components/global'

const ProjectRequestScreen = () => {
  const detailsModalRef = useRef()
  const { isFetching, data, update, _delete } = useProjectRequest()
  const [doneRead, setDoneRead] = useState([])

  async function showDetailsScreen (project) {
    detailsModalRef.current.open(project)
    if (!project.isRead) {
      await update(project.uid, {
        isRead: true
      })
    }
  }

  const request_sorted = data
    ?.sort((a, b) => a.createdAt - b.createdAt)
    .reverse()

  return (
    <ScreenContainer
      title='Project Requests'
      description={
        <>
          {' '}
          When someone receives a quotation by the widget, they become a
          potential lead for your business. All the quotation are gathered here,
          as <i>project requests</i> to give you full transparency of what the
          client expects.
        </>
      }
    >
      <RequestDetailsModal ref={detailsModalRef} />
      {isFetching && <Spinner size='md' color='blue.400' />}
      {!isFetching && (
        <Flex w='full' gap='3' flexWrap='wrap' pt='3'>
          {(!data || data.length <= 0) && (
            <Text fontSize='md' fontWeight='normal' color='gray.500'>
              <i>
                No requests yet. Once someone uses the Flito Widget integrated
                on your webiste, you'll see all requests here.
              </i>
            </Text>
          )}
          {request_sorted?.map(project => {
            const isRead = project.isRead || doneRead.includes(project.uid)
            return (
              <ProjectSingle
                {...project}
                onClick={() => showDetailsScreen(project)}
                onRequestDelete={() => _delete(project.uid)}
                style={{
                  marginRight: '3',
                  marginBottom: '3',
                  maxW: '300px'
                }}
              />
            )
          })}
        </Flex>
      )}
    </ScreenContainer>
  )
}

export default ProjectRequestScreen
