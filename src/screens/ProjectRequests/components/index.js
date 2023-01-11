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
  useDisclosure,
  Flex,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel
} from '@chakra-ui/react'
import { extractFeature, extractFeatures } from '../../../misc/featureHelper'
import { Constants } from '../../../data/constants'

import { BiCollapse, BiExpand, BiTrash, BiX } from 'react-icons/bi'
import { MdAttachMoney } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { SiteStyles, UserInfo } from '../../../components/global'
import { BsCheckCircleFill, BsClockHistory } from 'react-icons/bs'
import moment from 'moment'
import { useProfile, useWidget } from '../../../data/database/users/profile'
import {
  capitalizeFirst,
  trimString
} from '../../../data/extensions/stringHelper'
import { useProjectRequest } from '../../../data/database/users/projectRequests'
import { useServicesHook } from '../../../data/database/users/services'
import { useFeaturesHook } from '../../../data/database/users/features'

export const RequestDetailsModal = React.forwardRef(({ projectId }, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const [modalFullscreen, setModalFullscreen] = useState(false)
  const [projectData, setProjectData] = useState()
  const { data: services, isFetching: service_fetching } = useServicesHook()
  const { data: features, isFetching: feature_isFetching } = useFeaturesHook()

  function open (data) {
    setIsOpen(true)
    setProjectData(data)
    // setCurrentMetaId(metaId)
  }

  useImperativeHandle(ref, () => ({
    open
  }))

  function getServiceDetails (serviceUID) {
    const payload = projectData?.payload
    if (payload) {
      const all_features = payload.reduce((a, b) => a.concat(b.features), [])
      const unique_features = [...new Set(all_features)]

      const estimate = projectData.estimates.find(x => x.service === serviceUID)

      return {
        features: unique_features || [],
        estimate
      }
    }
  }

  const getDevTime = ({ period, periodType } = {}) =>
    `${period} ${capitalizeFirst(periodType)}`

  const getExpectations = data => {
    const { devCost, devTime } = data || {}
    if (devCost && devTime) return `$${devCost} for ${getDevTime(devTime)}`
    else {
      return 'OK with quotation'
    }
  }

  const isLoading =
    service_fetching || feature_isFetching || !services || !features

  function constructServices () {
    const { payload } = projectData || null
    if (payload && !isLoading) {
      const filteredPayload = payload.filter(x => x.uid !== 'total')

      return filteredPayload.map(item => ({
        name: services.find(x => x.uid === item.uid).name,
        features: features.filter(x => item.features.some(ft => ft === x.uid)),
        estimate: getExpectations(getServiceDetails(item.uid).estimate),
        expectations: getExpectations(getServiceDetails(item.uid).estimate.expectations)
      }))
    }
    return []
  }

  return (
    <Modal
      onClose={() => setIsOpen(false)}
      isOpen={isOpen}
      scrollBehavior='inside'
      size={modalFullscreen ? 'full' : '4xl'}
      motionPreset='slideInBottom'
    >
      <ModalOverlay />
      <ModalContent color='white' bg='#091927'>
        <ModalHeader
          // bg='#0f283d'
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          pos='relative'
        >
          <Text fontSize='md'>Project Details</Text>
          <Tooltip
            label={modalFullscreen ? 'Exit Fullscreen' : 'Go Fullscreen'}
          >
            <IconButton
              // pos='absolute'
              // right='5'
              // top='4'
              icon={modalFullscreen ? <BiCollapse /> : <BiExpand />}
              size='sm'
              mr='5'
              onClick={() => setModalFullscreen(prev => !prev)}
              {...SiteStyles.ButtonStyles}
              autoFocus={false}
              border='none'
            />
          </Tooltip>
        </ModalHeader>
        <ModalCloseButton mt='2' />
        <Divider borderColor='#21578a' />
        <ModalBody>
          {!projectData && <Spinner size='md' color='blue.400' />}
          {projectData && (
            <VStack w='full' pt='3' spacing='5'>
              <SimpleGrid columns='2' w='full'>
                <VStack justify='center' align='flex-start' spacing='0.5'>
                  <Text fontSize='xl'>{projectData.appName}</Text>
                  <Flex flexWrap='wrap' gap='1'>
                    <Text fontSize='sm'>by</Text>
                    <Text fontSize='sm'>{projectData.clientName}</Text>
                  </Flex>
                  <Text fontSize='sm' color='blue.400'>
                    {projectData.clientEmail}
                  </Text>
                </VStack>
                <VStack
                  bg='#173d61'
                  borderRadius='md'
                  justify='flex-start'
                  align='flex-start'
                  p='4'
                  // pl='3'
                  // pr='3'
                  spacing='4'
                >
                  <Box>
                    <Text fontSize='xl'>
                      {projectData.payload?.length} Services
                    </Text>
                    <Text fontSize='sm'>
                      {getServiceDetails('total').features.length} Features
                      Requested
                    </Text>
                  </Box>
                  <SimpleGrid columns='2' w='full'>
                    <Box>
                      <Text fontSize='xs' maxW='max-content'>
                        Widget Quoted (total),
                      </Text>
                      <Text fontSize='sm' pt='1'>
                        {getExpectations(getServiceDetails('total').estimate)}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize='xs' maxW='max-content'>
                        Client expects (total),
                      </Text>
                      <Text fontSize='sm' pt='1'>
                        {getExpectations(
                          getServiceDetails('total').estimate.expectations
                        )}
                      </Text>
                    </Box>
                  </SimpleGrid>
                </VStack>
              </SimpleGrid>
              {isLoading && <Spinner size='md' color='blue.400' mt='10' />}
              {!isLoading && (
                <Accordion allowMultiple w='full' defaultIndex={[0]}>
                  {constructServices()?.map(service => (
                    <ServiceSingle key={service.name} {...service} />
                  ))}
                </Accordion>
              )}
            </VStack>
          )}
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  )
})

const ServiceSingle = ({ name, features, estimate, expectations }) => (
  <AccordionItem
    bg='#0f283d'
    border='none'
    // borderColor='blue.400'
    borderRadius='md'
    mb='2'
  >
    <h2>
      <AccordionButton _hover={{
        bg: '#09192750'
      }}>
        <Flex textAlign='left' w='full'>
          <Text>
            {name} - {features?.length} Features
          </Text>
        </Flex>
        <AccordionIcon />
      </AccordionButton>
    </h2>
    <AccordionPanel pb={4}>
      <VStack spacing='4' align='flex-start'>
        <HStack spacing='10' align='flex-start'>
          <Box>
            <Text fontSize='xs' maxW='max-content'>
              Widget Quoted,
            </Text>
            <Text fontSize='sm' fontWeight='semibold'>
              {estimate}
            </Text>
          </Box>
          <Box>
            <Text fontSize='xs' maxW='max-content'>
              Client expects,
            </Text>
            <Text fontSize='sm' fontWeight='semibold'>
              {expectations}
            </Text>
          </Box>
        </HStack>
        {features && features?.length > 0 && (
          <Box borderWidth='thin' borderColor='teal.700' borderRadius='md' w='full'>
            <TableContainer
              className='table-container'
              w='100%'
              maxH='100%'
              pos='relative'
            >
              <Table className='custom-table' size='sm' h='full'>
                <Thead bg='#091927' h='35px' borderTopRadius='md'>
                  <Tr>
                    <Th borderTopLeftRadius='md'></Th>
                    <Th>Features</Th>
                    <Th
                      borderTopRightRadius='md'
                      borderBottomRightRadius='md'
                    ></Th>
                  </Tr>
                </Thead>
                <Tbody fontWeight='normal' overflowY='scroll'>
                  {features?.map((feature, index) => (
                    <Tr
                      _hover={{
                        bg: '#09192750'
                      }}
                      key={feature.uid}
                    >
                      <Td w='50px' color='teal.500' fontSize='lg'>
                        <BsCheckCircleFill />
                      </Td>
                      <Td>
                        <VStack align='flex-start' pt='2' pb='2' spacing='0.5'>
                          <Text fontSize='sm'>{feature.name}</Text>
                          <Text
                            fontSize='xs'
                            maxW='90%'
                            whiteSpace='initial'
                            lineHeight='5'
                            color='whiteAlpha.600'
                          >
                            {feature.description}
                          </Text>
                        </VStack>
                      </Td>
                      <Td></Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </VStack>
    </AccordionPanel>
  </AccordionItem>
)

export const DeleteButton = ({
  onConfirm,
  customButton,
  popoverTitle,
  popoverBody,
  buttonProps,
  popoverProps
}) => {
  const [isBusy, setBusy] = useState(false)

  function performConfirm () {
    setBusy(true)
    onConfirm && onConfirm()
  }
  return (
    <Popover
      placement='right'
      closeOnEsc
      closeOnBlur
      closeDelay={2000}
      onClose={() => setBusy(false)}
      {...popoverProps}
    >
      {({ onClose }) => (
        <>
          <PopoverTrigger>
            {customButton || (
              <IconButton
                pos='absolute'
                right='0'
                onClick={e => e.stopPropagation()}
                {...SiteStyles.DeleteButton}
                {...buttonProps}
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
            textAlign='left'
          >
            <PopoverHeader pt={4} fontWeight='bold' border='0' fontSize='sm'>
              {popoverTitle || 'Delete Request?'}
            </PopoverHeader>
            <PopoverCloseButton mt='2' />
            <PopoverArrow bg='blue.800' boxShadow='none !important' />
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
  payload,
  createdAt,
  estimates,
  onClick,
  isRead,
  onRequestDelete
}) => {
  
  function getLowestCost(){
    const lowest = estimates?.sort((a, b) => a.devCost - b.devCost)[0]
    return {
      devCost: `$${lowest.devCost}`,
      expectedDevCost: lowest.expectations?.devCost ? `starts at $${lowest.expectations?.devCost}` : ': Same as quotation'
    }
  }

  return (
    <VStack
      minH='max-content'
      h='auto'
      w='300px'
      justify='flex-start'
      align='flex-start'
      textAlign='left'
      role='group'
      pos='relative'
      onClick={onClick}
      spacing='4'
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
              <Badge bg='purple.600' color='white' fontSize='0.70rem'>
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
            {moment.utc(createdAt.toDate()).format('lll')}
          </Text>
        </VStack>

        <DeleteButton onConfirm={onRequestDelete} />
      </HStack>
      <Text color='purple.400'>{payload?.length} Services Requested</Text>
      <VStack fontSize='0.80rem' fontWeight='normal' spacing='0.5' align='left'>
        <Text>Quotation starts at {getLowestCost().devCost}</Text>
        <Text>Client's expectation {getLowestCost().expectedDevCost}</Text>
      </VStack>
    </VStack>
  )
}
