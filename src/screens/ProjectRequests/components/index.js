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
  Spinner,
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  PopoverFooter,
  useDisclosure
} from '@chakra-ui/react'
import { extractFeature, extractFeatures } from '../../../misc/featureHelper'
import { Constants } from '../../../data/constants'

import { BiCollapse, BiExpand, BiTrash, BiX } from 'react-icons/bi'
import { MdAttachMoney } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { SiteStyles, UserInfo } from '../../../components/global'
import { BsClockHistory } from 'react-icons/bs'
import moment from 'moment'
import { useProjectMeta } from '../../../data/database/projectMeta'
import { useProfile, useWidget } from '../../../data/database/users/profile'
import { trimString } from '../../../data/extensions/stringHelper'

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
      <ModalContent color='white' bg='#143554'>
        <ModalHeader
          bg='#0f283d'
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
              size='sm'
              mr='5'
              onClick={() => setModalFullscreen(prev => !prev)}
              {...SiteStyles.ButtonStyles}
              border='none'
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
                      borderRadius='md'
                      pl='2'
                      pr='2'
                      pb='0.5'
                      pt='0.5'
                      {...SiteStyles.BadgeStyle}
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
                <Text
                  textTransform='capitalize'
                  fontSize='xs'
                  borderRadius='md'
                  pl='2'
                  pr='2'
                  pb='0.5'
                  pt='0.5'
                  {...SiteStyles.BadgeStyle}
                >
                  <b>{buildPhases[0]}</b>
                </Text>
              </HStack>
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
                      <Th>Requested Features</Th>
                    </Tr>
                  </Thead>
                  <Tbody fontWeight='normal'>
                    {extractFeature(data.features)?.map((feature, index) => {
                      return (
                        <Tr
                          key={index}
                          transition='all 200ms'
                          _hover={{
                            bg: '#0f283d50'
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
        <ModalFooter>
          {!isFetching && data && (
            <VStack
              w='full'
              justify='flex-start'
              align='flex-start'
              bg='#0f283d'
              p='5'
              borderRadius='md'
            >
              <HStack w='100%'>
                <Text fontSize='sm' fontWeight='medium' minW='max-content'>
                  Proposal Details
                </Text>
              </HStack>
              <HStack>
                <Text fontSize='sm' display='flex' fontWeight='medium'>
                  Widget Quoted:
                  <Tooltip label='AI Quoted development cost' hasArrow>
                    <Badge
                      fontSize='sm'
                      borderRadius='sm'
                      ml='2'
                      colorScheme='blue'
                    >
                      {data.devCost} {widgetHook.data?.pricing?.currency}
                    </Badge>
                  </Tooltip>
                  <Tooltip label='AI Quoted development timeline' hasArrow>
                    <Badge
                      fontSize='sm'
                      borderRadius='sm'
                      ml='2'
                      colorScheme='purple'
                    >
                      {data.devTime} Weeks
                    </Badge>
                  </Tooltip>
                </Text>
                {data.expectation && (
                  <Text fontSize='sm' display='flex' fontWeight='medium'>
                    Client's Expectation:
                    {data.expectation.budget && (
                      <Tooltip
                        label="Client's development cost expectation"
                        hasArrow
                      >
                        <Badge
                          fontSize='sm'
                          borderRadius='sm'
                          ml='2'
                          colorScheme='blue'
                        >
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
                        <Badge
                          fontSize='sm'
                          borderRadius='sm'
                          ml='2'
                          colorScheme='purple'
                        >
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

export const DeleteButton = ({
  onConfirm,
  customButton,
  popoverTitle,
  popoverBody
}) => {
  const [isBusy, setBusy] = useState(false)

  function performConfirm () {
    setBusy(true)
    onConfirm && onConfirm()
  }
  return (
    <Popover placement='right' closeOnEsc closeOnBlur closeDelay={2000} onClose={() => setBusy(false)}>
      {({ onClose }) => (
        <>
          <PopoverTrigger>
            {customButton || (
              <IconButton
                pos='absolute'
                right='0'
                onClick={e => e.stopPropagation()}
                {...SiteStyles.DeleteButton}
              />
            )}
          </PopoverTrigger>
          <PopoverContent
            color='white'
            bg='blue.800'
            borderColor='blue.800'
            cursor='default'
            onClick={e => {
              e.stopPropagation()
            }}
          >
            <PopoverHeader pt={4} fontWeight='bold' border='0' fontSize='sm'>
              {popoverTitle || 'Delete Request?'}
            </PopoverHeader>
            <PopoverCloseButton mt='2' />
            <PopoverArrow bg='blue.800' boxShadow='none !important'/>
            {popoverBody && (
              <PopoverBody fontSize='sm' fontWeight='normal'>
                {popoverBody}
              </PopoverBody>
            )}
            <PopoverFooter
              border='0'
              display='flex'
              alignItems='center'
              justifyContent='space-between'
              pb={4}
            >
              <ButtonGroup size='xs'>
                <Button
                  colorScheme='red'
                  onClick={performConfirm}
                  loadingText='Deleting'
                  isLoading={isBusy}
                >
                  Confirm
                </Button>
                <Button colorScheme='green' onClick={onClose}>
                  No, Keep It
                </Button>
              </ButtonGroup>
            </PopoverFooter>
          </PopoverContent>
        </>
      )}
    </Popover>
  )
}

/**
 *
 * @param {object} props The component props
 * @param {import('@chakra-ui/react').StackProps} props.style Styles for the component
 * @param {boolean} props.isRead
 * @param {() => {}} props.onRequestDelete
 * @param {() => {}} props.onClick
 * @returns
 */
export const ProjectSingle = ({
  style,
  appName,
  appDesc,
  devCost,
  devTime,
  createdOn,
  onClick,
  isRead,
  onRequestDelete
}) => {
  const navigate = useNavigate()
  const formattedCost = () => {
    const kmbt = getNumberKMBT(Number(devCost))
    return kmbt <= 0 ? devCost : kmbt
  }

  return (
    <VStack
      minH='max-content'
      w='300px'
      justify='flex-start'
      align='flex-start'
      textAlign='left'
      role='group'
      pos='relative'
      onClick={onClick}
      {...style}
      {...SiteStyles.ClickableContainer}
    >
      <HStack w='full' pos='relative'>
        <VStack
          h='30px'
          w='30px'
          borderRadius='md'
          fontSize='sm'
          bg='gray.200'
          align='center'
          justify='center'
          color='gray.600'
        >
          <Text>{appName.substring(0, 1)}</Text>
        </VStack>
        <VStack
          spacing='0'
          textAlign='left'
          align='flex-start'
          justify='flex-start'
        >
          <HStack>
            <Text fontSize='smaller' transition='all 300ms'>
              {trimString(appName, 14)}
            </Text>
            {!isRead && (
              <Badge bg='#543d63' color='white'>
                NEW
              </Badge>
            )}
          </HStack>
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

        <DeleteButton onConfirm={onRequestDelete} />
      </HStack>
      <Text fontSize='xs' fontWeight='normal' mt='2' noOfLines={3} h='40px'>
        {appDesc}
      </Text>
      <HStack>
        <Text fontSize='xs'>Widget Quoted:</Text>
        <HStack
          bg='#543d63'
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
