import {
  ScreenContainer,
  SiteStyles,
  useToastGenerator
} from '../../../components/global'
import { motion } from 'framer-motion'
import Select from 'react-select'
import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Input,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack
} from '@chakra-ui/react'
import { ReactSelectStyles } from '../../PricingStrategy'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useServicesHook } from '../../../data/database/users/services'
import { uuidv4 } from '@firebase/util'
import stringSimilarity from 'string-similarity'
import { FiEdit2, FiPlus, FiPlusCircle } from 'react-icons/fi'
import { VscCopy } from 'react-icons/vsc'
import { StringHelper } from '../../../data/extensions/stringHelper'
import { useFeaturesHook } from '../../../data/database/users/features'
import { SiteRoutes } from '../../../misc/routes'

export default () => {
  const routeState = useLocation().state
  const serviceHook = useServicesHook()
  const [services, setServices] = useState()
  const [microServices, setMicroServices] = useState([])
  const [featureList, setFeatureLsit] = useState()
  const { addMultiple, isUpdating } = useFeaturesHook(0, true)
  const navigate = useNavigate()
  const toast = useToastGenerator()

  function getScreenContent () {
    return routeState?.existingData
      ? {
          title: 'Edit Feature/Option',
          description:
            'You can edit this feature, assign new Services and Micro-Services to it.'
        }
      : {
          title: 'Create New Feature/Option',
          description: 'Define a Service and create feature(s) for it.'
        }
  }

  const constructServices = serviceHook.data?.map(service => ({
    value: service.uid,
    label: service.name
  }))

  useEffect(() => {
    mergeMicroServices()
  }, [services])

  function mergeMicroServices () {
    if (services) {
      if (services?.length > 1) {
        const mergedMicros = []
        const filteredServices = serviceHook.data?.filter(x =>
          services.some(y => y.value === x.uid)
        )

        /// Now here, we are firstly selecting the first service and will loop through it's micro services.
        /// While looping through it's micro-services, we will check how many microServices from other services are similar
        /// to the given microService in the loop. This is how we merge the microServices

        filteredServices[0]?.microServices?.map((micro, microIndex) => {
          const micro_name = micro.name
          const step_question = micro.stepQuestion

          /// Now we loop through all other services
          filteredServices.map((otherService, index) => {
            if (index > 0 && otherService.microServices[microIndex]) {
              const other_micro_name =
                otherService.microServices[microIndex].name
              const other_micro_stepQuestion =
                otherService.microServices[microIndex].stepQuestion

              const nameMatch = stringSimilarity.compareTwoStrings(
                micro_name,
                other_micro_name
              )
              const stepQuestionMatch = stringSimilarity.compareTwoStrings(
                step_question,
                other_micro_stepQuestion
              )

              if (nameMatch >= 0.8 && stepQuestionMatch >= 0.8) {
                mergedMicros.push(micro)
              }
            }
          })
        })

        setMicroServices(
          mergedMicros.map(mergedMicro => ({
            label: mergedMicro.name,
            value: mergedMicro.uid
          }))
        )
      } else {
        const serviceRef = serviceHook.data?.find(
          x => x.uid === services[0]?.value
        )
        setMicroServices(
          serviceRef?.microServices.map(micro => ({
            label: micro.name,
            value: micro.uid
          }))
        )
      }
    }
  }

  function handleServiceChange (val) {
    if (!services && (!featureList || featureList?.length <= 0)) {
      setFeatureLsit([
        {
          uid: uuidv4()
        }
      ])
    }

    setServices(val)
  }

  function addFeature () {
    setFeatureLsit(prev => [
      ...prev,
      {
        uid: uuidv4()
      }
    ])
  }

  function updateFeature (index, key, val) {
    setFeatureLsit(prev => {
      const spread = [...prev]
      const spread_feature = { ...spread[index] }
      spread_feature[key] = val
      spread[index] = spread_feature

      return spread
    })
  }

  function handleFeature (index, shouldDelete) {
    if (!shouldDelete)
      setFeatureLsit(prev => [
        ...prev,
        {
          ...prev[index],
          uid: uuidv4()
        }
      ])
    else
      setFeatureLsit(prev => {
        const spread = [...prev]
        spread.splice(index, 1)
        return spread
      })
  }

  const isFormValid = featureList?.every(
    feature =>
      feature.name &&
      feature.microService &&
      !StringHelper.isPropsEmpty(feature, ['price'])
  )

  async function finaliseFeatures () {
    if (isFormValid) {
      const formatted = featureList.map(single => {
        console.log('Micro:', single.microService)
        const association = {
          services: services.map(x => x.value),
          microService: {
            microUID: single.microService.value,
            serviceID: services[0].value
          }
        }
        return {
          name: single.name,
          association
        }
      })

      //   console.log('Formatted is:', formatted)
      const result = await addMultiple(formatted)
      toast.show(result)

      if (result.success) {
        setTimeout(
          () => navigate(SiteRoutes.Engine.Setup.Screens().ServiceBuilder.path),
          1500
        )
      }
    }
  }

  return (
    <motion.div
      key='create-service-page'
      initial={{
        opacity: 0,
        x: 10
      }}
      animate={{
        opacity: 1,
        x: 0
      }}
    >
      <ScreenContainer {...getScreenContent()}>
        <VStack align='flex-start' w='400px'>
          <Text fontSize='sm' fontWeight='semibold'>
            Select Service(s)
          </Text>
          <Select
            isClearable
            isMulti
            options={constructServices}
            isLoading={!constructServices}
            className='react_select'
            placeholder='Select...'
            styles={{
              ...ReactSelectStyles,
              multiValue: base => ({
                ...base,
                background: '#143554'
              }),
              multiValueLabel: base => ({
                ...base,
                color: 'white',
                fontWeight: '600'
              }),
              multiValueRemove: base => ({
                ...base,
                background: '#143554'
              })
            }}
            onChange={handleServiceChange}
            value={services}
          />
        </VStack>
        <VStack pt='2' align='flex-start'>
          {featureList && featureList?.length > 0 && (
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
                <Thead
                  bg='#0f283d'
                  h='35px'
                  borderTopRadius='md'
                  zIndex='0 !important'
                >
                  <Tr>
                    <Th borderTopLeftRadius='md' borderBottomLeftRadius='md'>
                      Micro-Service
                    </Th>
                    <Th>Feature/Option</Th>
                    <Th>Price/Rate</Th>
                    <Th
                      borderTopRightRadius='md'
                      borderBottomRightRadius='md'
                    ></Th>
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
                      <Td maxW='150px'>
                        <Select
                          options={microServices}
                          className='react_select'
                          placeholder='Select...'
                          styles={ReactSelectStyles}
                          onChange={val =>
                            updateFeature(index, 'microService', val)
                          }
                          value={feature.microService}
                        />
                      </Td>
                      <Td maxW='200px'>
                        <Input
                          {...SiteStyles.InputStyles}
                          onChange={e =>
                            updateFeature(index, 'name', e.target.value)
                          }
                          value={feature.name || ''}
                          placeholder='Feature/Option Name'
                        />
                      </Td>
                      <Td maxW='200px'>
                        <Input
                          {...SiteStyles.InputStyles}
                          onChange={e =>
                            /^\d*\.?\d*$/.test(e.target.value) &&
                            updateFeature(index, 'price', e.target.value)
                          }
                          value={feature.price || ''}
                          placeholder='$0.00'
                        />
                      </Td>
                      <Td textAlign='right'>
                        <HStack align='flex-end' justify='flex-end'>
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
                              onClick={() => handleFeature(index)}
                            />
                          </Tooltip>
                          <IconButton
                            {...SiteStyles.DeleteButton}
                            onClick={() => handleFeature(index, true)}
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
          {featureList && (
            <HStack spacing='2' pt='2' justify='space-between' w='full'>
              <Button
                {...SiteStyles.ButtonStyles}
                size='sm'
                borderStyle='dashed'
                onClick={addFeature}
                leftIcon={<FiPlus />}
              >
                {!featureList || featureList.length <= 0
                  ? 'Add Feature'
                  : 'Add Another'}
              </Button>
              <Tooltip
                label={
                  !isFormValid &&
                  'One or more features have missing properties.'
                }
                hasArrow
                bg='white'
                color='#0f283d'
                p='2'
                pl='4'
                pr='4'
              >
                <Button
                  {...SiteStyles.ButtonStyles}
                  size='sm'
                  isDisabled={featureList.length <= 0}
                  bg='teal.600'
                  _hover={{
                    bg: 'teal.800'
                  }}
                  cursor={isFormValid ? 'pointer' : 'not-allowed'}
                  onClick={finaliseFeatures}
                  isLoading={isUpdating}
                >
                  Finalise & Save
                </Button>
              </Tooltip>
            </HStack>
          )}
        </VStack>
      </ScreenContainer>
    </motion.div>
  )
}