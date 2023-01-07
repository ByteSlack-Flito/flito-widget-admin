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
import { useEffect, useRef, useState } from 'react'
import { BiPlus } from 'react-icons/bi'
import { FiEdit2 } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { ScreenContainer, SiteStyles } from '../../../components/global'
import { useFeaturesHook } from '../../../data/database/users/features'
import { useServicesHook } from '../../../data/database/users/services'
import { trimString } from '../../../data/extensions/stringHelper'
import { SiteRoutes } from '../../../misc/routes'
import { InfoBox } from '../../PricingStrategy/components'
import { DeleteButton } from '../../ProjectRequests/components'
import { AppTypes } from '../../MyServices'
import { AddFeatureModal } from './components'

export const FeatureList = ({}) => {
  const featureModalRef = useRef()
  const { data, isFetching } = useFeaturesHook()
  const serviceHooks = useServicesHook()
  const [featureList, setFeatureLsit] = useState()
  const navigate = useNavigate()

  useEffect(() => {
    data && serviceHooks.data && constructFeatures()
  }, [data, serviceHooks.data])

  async function constructFeatures () {
    const features = data?.map(ft => {
      const associationInfo = () => {
        const services = serviceHooks.data?.filter(x =>
          ft.association.services.includes(x.uid?.toString())
        )
        const microService = serviceHooks.data
          ?.find(x => x.uid === ft.association.microService.serviceID)
          ?.microServices.find(
            x =>
              x.sampleID == ft.association.microService.microUID ||
              x.uid === ft.association.microService.microUID
          )

        return { services, microService }
      }
      
      return {
        ...ft,
        association: associationInfo()
      }
    })

    setFeatureLsit(features || [])
  }

  function gotoCreateFeature () {
    const constructServices = () => {
      return serviceHooks.data?.map(service => ({
        value: service.uid,
        label: service.name
      }))
    }
    navigate(SiteRoutes.Engine.Setup.Screens().CreateService.path, {
      state: {}
    })
  }

  const isLoading = (isFetching || serviceHooks.isFetching) && featureList

  return (
    <ScreenContainer description='Manage all the features you want to offer for different services.'>
      {isLoading && <Spinner size='md' color='blue.400' />}
      {!isLoading && (
        <VStack align='flex-start' w='full' h='100%' spacing='2'>
          <VStack maxH='100%' h='100%' w='100%' align='flex-start'>
            <Button
              leftIcon={<BiPlus />}
              size='sm'
              {...SiteStyles.ButtonStyles}
              borderStyle='dashed'
              onClick={gotoCreateFeature}
            >
              Create New
            </Button>
            <TableContainer
              className='table-container'
              w='100%'
              h='100%'
              borderRadius='md'
              borderWidth='thin'
              borderColor='teal.700'
              mt='3'
              pos='relative'
            >
              <Table className='custom-table' size='sm' h='full'>
                <Thead bg='#0f283d' h='35px' borderTopRadius='md'>
                  <Tr>
                    <Th borderTopLeftRadius='md'>Feature</Th>
                    <Th>Affected Services</Th>
                    <Th>Affected Variation</Th>
                    <Th borderTopRightRadius='md'></Th>
                  </Tr>
                </Thead>
                <Tbody fontWeight='normal' overflowY='scroll'>
                  {featureList?.map((feature, index) => (
                    <Tr
                      _hover={{
                        bg: '#0f283d70'
                      }}
                      key={feature.uid}
                    >
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
                      <Td maxW='200px'>
                        <Flex gap='2' flexWrap='wrap'>
                          {feature.association?.services?.map(
                            affected_service => (
                              <Tooltip
                                key={affected_service.uid}
                                label={affected_service.name}
                                placement='bottom'
                                hasArrow
                                bg='#1a405e'
                                fontSize='0.75rem'
                              >
                                <Text
                                  size='xs'
                                  variant='solid'
                                  bg='#1a405e'
                                  fontSize='0.70rem'
                                  p='0.5'
                                  pl='2'
                                  pr='2'
                                  borderRadius='full'
                                >
                                  {trimString(affected_service.name, 10, '.')}
                                </Text>
                              </Tooltip>
                            )
                          )}
                        </Flex>
                      </Td>
                      <Td maxW='200px'>
                        <Flex gap='2' flexWrap='wrap'>
                          <Text
                            size='xs'
                            variant='solid'
                            bg='green.800'
                            fontSize='0.70rem'
                            p='0.5'
                            pl='2'
                            pr='2'
                            borderRadius='full'
                          >
                            {feature.association?.microService?.name}
                          </Text>
                        </Flex>
                      </Td>
                      <Td textAlign='right'>
                        <IconButton
                          {...SiteStyles.DeleteButton}
                          _hover={{
                            bg: 'teal.600'
                          }}
                          _active={{
                            bg: 'teal.600'
                          }}
                          icon={<FiEdit2 />}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </VStack>
        </VStack>
      )}
    </ScreenContainer>
  )
}
