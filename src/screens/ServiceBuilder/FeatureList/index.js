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
  Spinner,
  Button,
  Tooltip,
  IconButton
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { BiPlus } from 'react-icons/bi'
import { FiEdit2 } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { ScreenContainer, SiteStyles } from '../../../components/global'
import { useFeaturesHook } from '../../../data/database/users/features'
import { useServicesHook } from '../../../data/database/users/services'
import { trimString } from '../../../data/extensions/stringHelper'
import { SiteRoutes } from '../../../misc/routes'

export const FeatureList = ({}) => {
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

    setFeatureLsit(
      features?.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate())
    )
  }

  function gotoCreateFeature (featureUID) {
    const currentFeature = data?.find(x => x.uid === featureUID)
    navigate(SiteRoutes.Engine.Setup.Screens().CreateService.path, {
      state: {
        data: currentFeature
      }
    })
  }

  const isLoading = isFetching || serviceHooks.isFetching

  return (
    <ScreenContainer description='Manage all the features you want to offer for different services.'>
      {isLoading && <Spinner size='md' color='blue.400' />}
      {!isLoading && (
        <VStack align='flex-start' w='full' h='100%' spacing='2'>
          <VStack w='100%' align='flex-start'>
            <Button
              leftIcon={<BiPlus />}
              size='sm'
              {...SiteStyles.ButtonStyles}
              borderStyle='dashed'
              onClick={() => gotoCreateFeature()}
            >
              Create New
            </Button>
            {(!featureList || featureList?.length <= 0) && (
              <Text fontSize='md' fontWeight='normal' color='gray.500'>
                <i>
                  Start creating features and they will show up here. You should
                  add at-least one feature, per service.
                </i>
              </Text>
            )}
            {featureList?.length > 0 && (
              <TableContainer
                className='table-container'
                w='100%'
                h='100%'
                borderRadius='md'
                borderWidth='thin'
                borderColor='teal.700'
                // mt='3'
                pos='relative'
              >
                <Table className='custom-table' size='sm' h='full'>
                  <Thead bg='#0f283d' h='35px' borderTopRadius='md'>
                    <Tr>
                      <Th borderTopLeftRadius='md'>Feature</Th>
                      <Th>Affected Services</Th>
                      <Th>Affected Variation</Th>
                      <Th>Price/Rate</Th>
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
                          <VStack
                            align='flex-start'
                            pt='2'
                            pb='2'
                            spacing='0.5'
                          >
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
                                    {feature.association?.services?.length < 2
                                      ? affected_service.name
                                      : trimString(
                                          affected_service.name,
                                          10,
                                          '.'
                                        )}
                                  </Text>
                                </Tooltip>
                              )
                            )}
                          </Flex>
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
                            {feature.association?.microService?.name}
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
                            {feature.price ? `$ ${feature.price}` : 'Unspecified'}
                          </Text>
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
                            onClick={() => gotoCreateFeature(feature.uid)}
                          />
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
