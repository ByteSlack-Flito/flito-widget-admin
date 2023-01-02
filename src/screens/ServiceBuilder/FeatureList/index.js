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
  HStack
} from '@chakra-ui/react'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { BiPlus } from 'react-icons/bi'
import { ScreenContainer, SiteStyles } from '../../../components/global'
import { InfoBox } from '../../PricingStrategy/components'
import { AppTypes } from '../../TechStacks'
import { AddFeatureModal } from './components'

export const FeatureList = ({}) => {
  const [featureList, setFeatureList] = useState()
  const [isLoading, setIsLoading] = useState(true)

  const featureModalRef = useRef()

  useEffect(() => {
    getFeatureList()
  }, [])

  async function getFeatureList () {
    setIsLoading(true)
    const api = process.env.REACT_APP_API_URL

    const featureList = await axios.get(`${api}/static/getFeatureList`)
    setFeatureList(featureList.data)
    setIsLoading(false)
  }

  const getDefaultVariations = () => {
    const variations = []
    // AppTypes.map(type =>
    //   type.platforms.map(platform => variations.push(platform))
    // )

    return variations
  }

  function openAddFeature () {
    featureModalRef.current?.open()
  }

  function getCategoryList () {
    const categories = []
    featureList?.map(feature => {
      if (!categories.find(x => x.value === feature.parent.id)) {
        categories.push({
          label: feature.parent.title,
          value: feature.parent.id
        })
      }
    })
    return categories
  }

  return (
    <ScreenContainer
      title='Feature List'
      description='Manage all the features you want to offer for different services.'
    >
      {isLoading && <Spinner size='md' color='blue.400' />}
      {!isLoading && (
        <VStack align='flex-start' w='full' h='100%' spacing='2'>
          <AddFeatureModal
            ref={featureModalRef}
            categoryList={getCategoryList()}
          />
          {featureList?.length <= 0 ? (
            <InfoBox
              type='error'
              title="Couldn't fetch features"
              description={
                <>
                  Sorry, but something went wrong on our end. We will be fixing
                  this shortly.
                </>
              }
            />
          ) : (
            <VStack maxH='100%' h='100%' w='100%' align='flex-start'>
              <HStack>
                <Button
                  leftIcon={<BiPlus />}
                  size='sm'
                  {...SiteStyles.ButtonStyles}
                  borderStyle='dashed'
                  onClick={() => openAddFeature()}
                >
                  Create Feature
                </Button>
                <Button
                  leftIcon={<BiPlus />}
                  size='sm'
                  {...SiteStyles.ButtonStyles}
                  borderStyle='dashed'
                  onClick={() => openAddFeature()}
                >
                  Create Feature Category
                </Button>
              </HStack>
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
                      <Th borderTopLeftRadius='md'>Feature Name</Th>
                      <Th>Affected Services</Th>
                      <Th>Affected Variations</Th>
                      <Th borderTopRightRadius='md'></Th>
                    </Tr>
                  </Thead>
                  <Tbody fontWeight='normal' overflowY='scroll'>
                    {featureList?.map((feature, index) => (
                      <Tr
                        _hover={{
                          bg: '#0f283d70'
                        }}
                        key={feature.id}
                      >
                        <Td>
                          <VStack align='flex-start' pt='2' pb='2'>
                            <Text
                              color='blue.400'
                              fontSize='xs'
                              fontWeight='semibold'
                            >
                              {feature.parent?.title}
                            </Text>
                            <Text fontSize='sm'>{feature.title}</Text>
                            <Text
                              fontSize='sm'
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
                            {/* {AppTypes.map(appType => (
                              <Text
                                size='xs'
                                key={appType.value}
                                variant='solid'
                                bg='#1a405e'
                                fontSize='0.70rem'
                                p='0.5'
                                pl='2'
                                pr='2'
                                borderRadius='full'
                              >
                                {appType.title}
                              </Text>
                            ))} */}
                          </Flex>
                        </Td>
                        <Td maxW='200px'>
                          <Flex gap='2' flexWrap='wrap'>
                            {getDefaultVariations().map(
                              (variation, index) =>
                                index <= 3 && (
                                  <Text
                                    size='xs'
                                    key={variation}
                                    variant='solid'
                                    bg='#1a405e'
                                    fontSize='0.70rem'
                                    p='0.5'
                                    pl='2'
                                    pr='2'
                                    borderRadius='full'
                                  >
                                    {variation}
                                  </Text>
                                )
                            )}
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
                              +{getDefaultVariations().length - 4} Others
                            </Text>
                          </Flex>
                        </Td>
                        <Td textAlign='right'></Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </VStack>
          )}
        </VStack>
      )}
    </ScreenContainer>
  )
}
