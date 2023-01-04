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
  Checkbox,
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
  Textarea,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack
} from '@chakra-ui/react'
import { ReactSelectStyles } from '../../PricingStrategy'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useServicesHook } from '../../../data/database/users/services'
import { uuidv4 } from '@firebase/util'
import stringSimilarity from 'string-similarity'
import { FiEdit2, FiPlus, FiPlusCircle } from 'react-icons/fi'
import { VscCopy } from 'react-icons/vsc'
import { StringHelper } from '../../../data/extensions/stringHelper'
import { useFeaturesHook } from '../../../data/database/users/features'
import { SiteRoutes } from '../../../misc/routes'
import { useBundlesHook } from '../../../data/database/users/bundles'
import { BsCheckCircleFill } from 'react-icons/bs'

export default () => {
  const routeState = useLocation().state
  const { add, isUpdating, update } = useBundlesHook(0, true)
  const serviceHook = useServicesHook()
  const featuresHook = useFeaturesHook()
  const [featureList, setFeatureLsit] = useState()
  const [formData, setFormData] = useState({
    name: '',
    service: '',
    unitPrice: '',
    features: []
  })
  const navigate = useNavigate()
  const toast = useToastGenerator()

  useEffect(() => {
    routeState?.data && setFormData(routeState.data)
  }, [routeState])

  function getScreenContent () {
    return routeState?.data
      ? {
          title: 'Edit Bundle',
          description:
            'You can edit this bundle, assign new Service and Features to it.'
        }
      : {
          title: 'Create New Service Bundle',
          description: 'Define a Service and create feature(s) for it.'
        }
  }

  const constructServices = serviceHook.data?.map(service => ({
    value: service.uid,
    label: service.name
  }))

  useEffect(() => {
    !StringHelper.isEmpty(formData.service) &&
      featuresHook.data &&
      getServiceFeatures()
  }, [formData.service, featuresHook.data])

  async function getServiceFeatures () {
    const features = featuresHook.data?.filter(ft =>
      ft.association.services.includes(formData.service)
    )
    setFeatureLsit(
      features?.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate())
    )
  }

  function handleFormData (key, val) {
    setFormData(prev => ({ ...prev, [key]: val }))
  }

  function handleFeature (featureUID) {
    setFormData(prev => {
      const spread = JSON.parse(JSON.stringify(prev))
      let features = [...spread.features]
      if (features.includes(featureUID)) {
        features = features.filter(x => x !== featureUID)
      } else {
        features = [...features, featureUID]
      }
      spread.features = [...features]

      return spread
    })
  }

  async function performAdd () {
    if (isFormValid) {
      const spread = { ...formData }
      delete spread.uid
      delete spread.createdAt
      const result = routeState?.data
        ? await update(formData.uid, spread)
        : await add(formData)
      toast.show(result)

      result.success &&
        setTimeout(
          () => navigate(SiteRoutes.Engine.Setup.Screens().ServiceBuilder.path),
          1000
        )
    }
  }

  const numbreRegex = /^\d*\.?\d*$/
  const isFormValid = !StringHelper.isPropsEmpty(formData)

  return (
    <motion.div
      key='create-bundle-page'
      initial={{
        opacity: 0,
        x: 10
      }}
      animate={{
        opacity: 1,
        x: 0
      }}
      style={{
        height: '100%'
      }}
    >
      <ScreenContainer {...getScreenContent()} preventChildScroll allowGoBack>
        <Grid
          gridTemplateRows='1fr auto'
          gridTemplateColumns='0.8fr 1fr'
          h='100%'
          gap='5'
        >
          <GridItem pl='2'>
            <VStack align='flex-start' spacing='3'>
              <Input
                {...SiteStyles.InputStyles}
                placeholder='Bundle Name'
                value={formData.name}
                onChange={e => handleFormData('name', e.target.value)}
              />
              <Select
                options={constructServices}
                isLoading={!constructServices}
                defaultValue={constructServices && constructServices[0]}
                className='react_select'
                placeholder='Select Affected Service...'
                styles={{
                  ...ReactSelectStyles
                }}
                onChange={val => handleFormData('service', val.value)}
                value={constructServices?.find(
                  x => x.value === formData.service
                )}
              />
              <Input
                {...SiteStyles.InputStyles}
                placeholder='Bundle Price'
                value={formData.unitPrice}
                onChange={e =>
                  numbreRegex.test(e.target.value) &&
                  handleFormData('unitPrice', e.target.value)
                }
              />
            </VStack>
          </GridItem>
          <GridItem
            overflow='scroll'
            borderRadius='md'
            borderWidth='thin'
            borderColor='teal.700'
          >
            <VStack align='flex-start' h='100%'>
              {(!featureList || featureList.length <= 0) && (
                <VStack
                  fontWeight='thin'
                  color='gray.500'
                  w='full'
                  h='full'
                  justify='center'
                  align='center'
                >
                  <Text fontSize='xl'>Select a Service first</Text>
                  <Text fontSize='md'>Then select relevant features</Text>
                </VStack>
              )}
              {featureList && featureList?.length > 0 && (
                <TableContainer
                  className='table-container'
                  w='100%'
                  maxH='100%'
                  pos='relative'
                >
                  <Table className='custom-table' size='sm' h='full'>
                    <Thead bg='#0f283d' h='35px' borderTopRadius='md'>
                      <Tr>
                        <Th borderTopLeftRadius='md'></Th>
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
                          cursor='pointer'
                          onClick={() => handleFeature(feature.uid)}
                          userSelect='none'
                        >
                          <Td w='50px' color='teal.500' fontSize='lg'>
                            {formData.features.includes(feature.uid) && (
                              <BsCheckCircleFill />
                            )}
                          </Td>
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
                          <Td>
                            <Text size='xs'>{feature.unitPrice || 'N/A'}</Text>
                          </Td>
                          <Td></Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              )}
            </VStack>
          </GridItem>
          <GridItem gridColumn='2' p='2'>
            <HStack w='full' justify='flex-end'>
              <Button
                disabled={!isFormValid}
                {...SiteStyles.ButtonStyles}
                onClick={performAdd}
                isLoading={isUpdating}
              >
                {routeState?.data ? 'Update' : 'Create'} Bundle
              </Button>
            </HStack>
          </GridItem>
        </Grid>
      </ScreenContainer>
    </motion.div>
  )
}
