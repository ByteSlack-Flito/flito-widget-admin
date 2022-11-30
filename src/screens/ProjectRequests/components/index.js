import React, { useState, useEffect, useImperativeHandle } from 'react'
import { getNumberKMBT } from '../../../misc/logics'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  HStack,
  VStack,
  Text,
  Tooltip,
  IconButton,
  Button,
  ModalCloseButton,
  ButtonGroup,
  Badge,
  Table,
  Th,
  Tr,
  Td,
  Thead,
  TableContainer,
  Tbody,
  Divider,
  Spinner
} from '@chakra-ui/react'
import { extractFeature, extractFeatures } from '../../../misc/featureHelper'
import { Constants } from '../../../data/constants'

import { BiCollapse, BiExpand, BiX } from 'react-icons/bi'
import { MdAttachMoney } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { UserInfo } from '../../../components/global'
import { BsClockHistory } from 'react-icons/bs'
import moment from 'moment'
import { useProjectMeta } from '../../../data/database/projectMeta'
import { useProfile, useWidget } from '../../../data/database/users/profile'

export const RequestDetailsModal = React.forwardRef(({ projectId }, ref) => {
  const [featureList, setFeatureList] = useState()
  const [isOpen, setIsOpen] = useState(false)
  const [modalFullscreen, setModalFullscreen] = useState(false)
  const [buildPhases, setBuildPhases] = useState(['Version 1'])
  const [metaId, setMetaId] = useState()
  const { isFetching, get, data } = useProjectMeta()
  const widgetHook = useWidget()

  useEffect(() => {
    isOpen && metaId && get(metaId)
  }, [metaId])

  useEffect(() => {
    console.log(data)
  }, [data])

  function open () {
    setIsOpen(true)
    // setCurrentMetaId(metaId)
  }

  useImperativeHandle(ref, () => ({
    open,
    setMetaId
  }))

  return (
    <Modal
      onClose={() => setIsOpen(false)}
      isOpen={isOpen}
      scrollBehavior='inside'
      size={modalFullscreen ? 'full' : '6xl'}
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
          {data && (
            <HStack spacing='3'>
              <Text w='max-content' fontSize='medium'>
                {data.appName}
              </Text>
              <UserInfo name={data.clientName} email={data.clientEmail} />
            </HStack>
          )}
          <Tooltip
            label={modalFullscreen ? 'Exit Fullscreen' : 'Go Fullscreen'}
          >
            <IconButton
              icon={modalFullscreen ? <BiCollapse /> : <BiExpand />}
              variant='solid'
              colorScheme='gray'
              size='sm'
              mr='5'
              onClick={() => setModalFullscreen(prev => !prev)}
            />
          </Tooltip>
        </ModalHeader>
        <ModalCloseButton mt='2' />
        <ModalBody>
          {(isFetching || !data) && <Spinner size='md' color='blue.400' />}
          {!isFetching && data && (
            <VStack spacing='3' align='flex-start'>
              <Text mt='2'>{data.appDesc}</Text>
              <HStack flexWrap='wrap'>
                <Text fontSize='smaller' fontWeight='medium'>
                  Requested Platforms:
                </Text>
                {data.appTypes.map(type => {
                  return type.platforms?.map((platform, index) => (
                    <Text
                      key={index}
                      textTransform='capitalize'
                      fontSize='xs'
                      bg='teal'
                      borderRadius='md'
                      pl='2'
                      pr='2'
                      pb='0.5'
                      pt='0.5'
                      color='white'
                    >
                      <b>{platform}</b>
                    </Text>
                  ))
                })}
              </HStack>
              <HStack flexWrap='wrap' w='100%'>
                <Text fontSize='smaller' fontWeight='medium'>
                  Development Phases:
                </Text>
                {buildPhases.map((phase, index) => {
                  return (
                    <ButtonGroup size='xs' isAttached variant='outline'>
                      <Button>{phase}</Button>
                    </ButtonGroup>
                  )
                })}
              </HStack>
              <TableContainer
                w='100%'
                overflowY='scroll !important'
                maxH='500px'
                borderWidth='1px'
                borderColor='blue.100'
                borderRadius='md'
              >
                <Table size='sm'>
                  <Thead bg='gray.100'>
                    <Tr>
                      <Th>Requested Features</Th>
                    </Tr>
                  </Thead>
                  <Tbody fontWeight='normal'>
                    {extractFeature(data.features)?.map((feature, index) => {
                      return (
                        <Tr
                          key={index}
                          _hover={{
                            bg: 'gray.50'
                          }}
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
                                {feature.parent.title}
                              </Text>
                              <Text fontSize='smaller' fontWeight='medium'>
                                {feature.title}
                              </Text>
                            </VStack>
                          </Td>
                        </Tr>
                      )
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            </VStack>
          )}
        </ModalBody>
        <Divider />
        <ModalFooter>
          {!isFetching && data && (
            <VStack w='full' justify='flex-start' align='flex-start'>
              <HStack w='100%' pt='5'>
                <Text fontSize='sm' fontWeight='medium' minW='max-content'>
                  Proposal Details
                </Text>
                <Divider colorScheme='blue' />
              </HStack>
              <HStack>
                <Text fontSize='xs' display='flex' fontWeight='medium'>
                  Widget Quoted:
                  <Tooltip label='AI Quoted development cost' hasArrow>
                    <Badge borderRadius='md' ml='2' colorScheme='blue'>
                      {data.devCost} {widgetHook.data?.pricing?.currency}
                    </Badge>
                  </Tooltip>
                  <Tooltip label='AI Quoted development timeline' hasArrow>
                    <Badge borderRadius='md' ml='2' colorScheme='purple'>
                      {data.devTime} Weeks
                    </Badge>
                  </Tooltip>
                </Text>
                {data.expectation && (
                  <Text fontSize='xs' display='flex' fontWeight='medium'>
                    Client's Expectation:
                    {data.expectation.budget && (
                      <Tooltip
                        label="Client's development cost expectation"
                        hasArrow
                      >
                        <Badge borderRadius='md' ml='2' colorScheme='blue'>
                          {data.expectation.budget}{' '}
                          {widgetHook.data?.pricing?.currency}
                        </Badge>
                      </Tooltip>
                    )}
                    {data.expectation.timeline && (
                      <Tooltip
                        label="Client's development timeline expectation"
                        hasArrow
                      >
                        <Badge borderRadius='md' ml='2' colorScheme='purple'>
                          {data.expectation.timeline}
                        </Badge>
                      </Tooltip>
                    )}
                  </Text>
                )}
              </HStack>
            </VStack>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
})

/**
 *
 * @param {object} props The component props
 * @param {import('@chakra-ui/react').StackProps} props.style Styles for the component
 * @returns
 */
export const ProjectSingle = ({
  style,
  appName,
  appDesc,
  devCost,
  devTime,
  createdOn,
  onClick
}) => {
  const navigate = useNavigate()
  const formattedCost = () => {
    const kmbt = getNumberKMBT(Number(devCost))
    return kmbt <= 0 ? devCost : kmbt
  }

  // const projectPath = SiteRoutes.Project.Dashboard.path.replace(
  //   ':projectId',
  //   '990192'
  // )
  return (
    <VStack
      minH='max-content'
      w='300px'
      p='3'
      bg='white'
      justify='flex-start'
      align='flex-start'
      textAlign='left'
      shadow='sm'
      borderWidth='1px'
      borderColor='gray.200'
      transition='all 200ms'
      cursor='pointer'
      borderRadius='md'
      spacing='3'
      _hover={{
        shadow: 'md',
        borderColor: 'blue.200'
      }}
      onClick={onClick}
      role='group'
      {...style}
    >
      <HStack>
        <VStack
          h='30px'
          w='30px'
          borderRadius='md'
          fontSize='sm'
          bg='gray.200'
          // borderWidth='thin'
          // borderColor='blue.300'
          align='center'
          justify='center'
          color='gray.600'
        >
          <Text>{appName.substring(0, 1)}</Text>
        </VStack>
        {/* <Avatar size='xs' name={appName} borderRadius='md' bg=''/> */}
        <VStack
          spacing='0'
          textAlign='left'
          align='flex-start'
          justify='flex-start'
        >
          <Text
            fontSize='smaller'
            transition='all 300ms'
            _groupHover={{
              color: 'blue.500'
            }}
          >
            {appName}
          </Text>
          <Text
            display='flex'
            fontSize='x-small'
            alignItems='center'
            mt='2'
            spac
          >
            {moment.utc(createdOn).format('lll')}
          </Text>
        </VStack>
      </HStack>
      <Text fontSize='xs' fontWeight='normal' mt='2' noOfLines={3} h='40px'>
        {appDesc}
      </Text>
      <HStack>
        <Text fontSize='x-small'>Widget Quoted:</Text>
        <HStack
          bg='gray.200'
          pb='0.5'
          pt='0.5'
          pl='1'
          pr='1'
          spacing='1.5'
          borderRadius='3px'
        >
          <HStack spacing='1'>
            <MdAttachMoney size={12} />
            <Text fontSize='xs'>{formattedCost()}</Text>
          </HStack>
          <Divider w='10px' borderColor='gray.500' orientation='horizontal' />
          <HStack spacing='1'>
            <BsClockHistory size={12} />
            <Text fontSize='xs'>{devTime} Weeks</Text>
          </HStack>
        </HStack>
      </HStack>
    </VStack>
  )
}
