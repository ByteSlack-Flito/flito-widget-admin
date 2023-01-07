import {
  TableContainer,
  VStack,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Flex,
  Text,
  Badge,
  Spinner,
  Button,
  HStack,
  Tooltip,
  IconButton
} from '@chakra-ui/react'
import axios from 'axios'
import { Timestamp } from 'firebase/firestore'
import { useEffect, useRef, useState } from 'react'
import { BiPlus } from 'react-icons/bi'
import { FiEdit2 } from 'react-icons/fi'
import { VscCopy } from 'react-icons/vsc'
import { useNavigate } from 'react-router-dom'
import { ScreenContainer, SiteStyles } from '../../../components/global'
import { useBundlesHook } from '../../../data/database/users/bundles'
import { useServicesHook } from '../../../data/database/users/services'
import { trimString } from '../../../data/extensions/stringHelper'
import { SiteRoutes } from '../../../misc/routes'
import { InfoBox } from '../../PricingStrategy/components'
import { DeleteButton } from '../../ProjectRequests/components'
import { AppTypes } from '../../MyServices'
import { DuplicateBundleModal } from './components'

export const BundleList = ({}) => {
  const { data, isFetching, getAll, add, isUpdating } = useBundlesHook()
  const serviceHooks = useServicesHook()
  const [bundleList, setBundleList] = useState()
  const navigate = useNavigate()
  const duplicateModalRef = useRef()

  useEffect(() => {
    data && serviceHooks.data && constructBundles()
  }, [data, serviceHooks.data])

  async function constructBundles () {
    const bundles = data?.map(bundle => {
      const service = serviceHooks.data?.find(x => x.uid === bundle.service)

      return {
        ...bundle,
        service
      }
    })

    setBundleList(
      bundles?.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate())
    )
  }

  function gotoCreateBundle (bundleUID) {
    const currentBundle = data?.find(x => x.uid === bundleUID)
    navigate(SiteRoutes.Engine.Setup.Screens().CreateBundle.path, {
      state: {
        data: currentBundle
      }
    })
  }

  function openDuplicate (bundleUID) {
    const bundle = data.find(x => x.uid === bundleUID)
    duplicateModalRef.current?.open(bundle)
  }

  const isLoading = isFetching || serviceHooks.isFetching

  return (
    <ScreenContainer
      description='Manage all your service bundles.'
      preventChildScroll={false}
    >
      {isLoading && <Spinner size='md' color='blue.400' />}
      {!isLoading && (
        <VStack
          align='flex-start'
          w='full'
          h='100%'
          spacing='2'
          overflow='scroll'
        >
          <DuplicateBundleModal
            ref={duplicateModalRef}
            onSuccessClose={() => getAll()}
            performAdd={add}
            isUpdating={isUpdating}
          />
          <VStack w='100%' align='flex-start'>
            <Button
              leftIcon={<BiPlus />}
              size='sm'
              {...SiteStyles.ButtonStyles}
              borderStyle='dashed'
              onClick={() => gotoCreateBundle()}
            >
              Create Bundle
            </Button>
            {(!bundleList || bundleList?.length <= 0) && (
              <Text fontSize='md' fontWeight='normal' color='gray.500'>
                <i>
                  Start creating service bundles and they will show up here.
                </i>
              </Text>
            )}
            {bundleList?.length > 0 && (
              <TableContainer
                className='table-container'
                w='100%'
                maxH='100%'
                borderRadius='md'
                borderWidth='thin'
                borderColor='teal.700'
                mt='3'
                pos='relative'
              >
                <Table className='custom-table' size='sm' h='full'>
                  <Thead bg='#0f283d' h='35px' borderTopRadius='md'>
                    <Tr>
                      <Th borderTopLeftRadius='md'>Bundle</Th>
                      <Th>Affected Services</Th>
                      <Th>Pricing</Th>
                      <Th borderTopRightRadius='md'></Th>
                    </Tr>
                  </Thead>
                  <Tbody fontWeight='normal' overflowY='scroll'>
                    {bundleList?.map((bundle, index) => (
                      <Tr
                        _hover={{
                          bg: '#0f283d70'
                        }}
                        key={bundle.uid}
                      >
                        <Td>
                          <VStack
                            align='flex-start'
                            pt='2'
                            pb='2'
                            spacing='0.5'
                          >
                            <Text fontSize='sm'>{bundle.name}</Text>
                            <Text
                              fontSize='xs'
                              maxW='90%'
                              whiteSpace='initial'
                              lineHeight='5'
                              color='whiteAlpha.600'
                            >
                              {bundle.features?.length} Features
                            </Text>
                          </VStack>
                        </Td>
                        <Td maxW='200px'>
                          <Text
                            size='xs'
                            variant='solid'
                            bg='#1a405e'
                            fontSize='0.70rem'
                            p='0.5'
                            pl='2'
                            pr='2'
                            borderRadius='full'
                            w='max-content'
                          >
                            {bundle.service.name}
                          </Text>
                        </Td>
                        <Td maxW='200px'>
                          <Text
                            size='xs'
                            variant='solid'
                            bg='green.800'
                            fontSize='0.70rem'
                            p='0.5'
                            pl='2'
                            pr='2'
                            borderRadius='full'
                            w='max-content'
                          >
                            $ {bundle.unitPrice}
                          </Text>
                        </Td>
                        <Td textAlign='right'>
                          <HStack justify='flex-end'>
                            <Tooltip
                              placement='bottom'
                              label='Duplicate'
                              hasArrow
                              bg='#1a405e'
                              fontSize='0.75rem'
                            >
                              <IconButton
                                {...SiteStyles.DeleteButton}
                                _hover={{
                                  bg: 'teal.600'
                                }}
                                _active={{
                                  bg: 'teal.600'
                                }}
                                icon={<VscCopy />}
                                onClick={() => openDuplicate(bundle.uid)}
                              />
                            </Tooltip>
                            <IconButton
                              {...SiteStyles.DeleteButton}
                              _hover={{
                                bg: 'teal.600'
                              }}
                              _active={{
                                bg: 'teal.600'
                              }}
                              icon={<FiEdit2 />}
                              onClick={() => gotoCreateBundle(bundle.uid)}
                            />
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </VStack>
        </VStack>
      )}
    </ScreenContainer>
  )
}
