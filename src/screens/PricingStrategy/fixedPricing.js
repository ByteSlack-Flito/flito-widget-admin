import {
  Button,
  SimpleGrid,
  Spinner,
  Text,
  useStatStyles,
  VStack
} from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { groupBy } from '../../misc/featureHelper'
import { VariantAppView, InfoBox, AddVariantPriceModal } from './components'
import AppListing from '../../assets/jsons/appListing-v2.json'
import { useWidget } from '../../data/database/users/profile'
import axios from 'axios'

const FixedPricing = ({ none }) => {
  // const variantApps = groupBy(AppListing.options, 'type')
  const [variantApps, setVariantApps] = useState({
    isFetching: false,
    data: undefined
  })
  const variantModalRef = useRef()
  const { data, isFetching } = useWidget()

  const [variantPricing, setVariantPricing] = useState([])

  useEffect(() => {
    getAppListing()
  }, [])

  useEffect(() => {
    if (data) {
      setVariantPricing(data?.fixedAppPrices || [])
    }
  }, [data])

  async function getAppListing () {
    setVariantApps(prev => ({ ...prev, isFetching: true }))
    const api = process.env.REACT_APP_API_URL

    const appListing = await axios.get(`${api}/static/getAppList`)
    if (appListing.data) {
      const groupedResult = groupBy(appListing.data.options, 'type')
      setVariantApps({ isFetching: false, data: groupedResult })
    }
  }

  function openModal (variant) {
    const currentVariant = variantPricing?.find(x => x.name === variant)
    variantModalRef?.current?.setVariantData(
      currentVariant || { name: variant }
    )
    variantModalRef?.current?.open()
  }

  function handleVariantPricing (data) {
    const currentIndex = variantPricing?.findIndex(x => x.name === data.name)
    if (currentIndex > -1) {
      const spread = [...variantPricing]
      spread[currentIndex] = data
      setVariantPricing(spread)
    } else {
      setVariantPricing(prev => [...prev, data])
    }
  }

  const renderIncompleteSetup = () => {
    // console.log('Data:', data)
    const setupCompleted = data?.fixedAppPrices?.length >= 3
    return !setupCompleted ? (
      <InfoBox
        type='error'
        title='Set-up Required'
        description='Please provide details of at-least 3 application categories.'
      ></InfoBox>
    ) : (
      <></>
    )
  }

  const isAllFetching = (isFetching || variantApps.isFetching) && (!data || !variantApps.data)

  return (
    <VStack w='full' fontWeight='normal' align='flex-start' spacing='5' pb='10'>
      <AddVariantPriceModal
        ref={variantModalRef}
        onSuccessClose={handleVariantPricing}
      />
      {isAllFetching ? (
        <Spinner size='md' color='blue.400' />
      ) : (
        <>
          {renderIncompleteSetup()}
          <VStack w='full' spacing='1' align='flex-start'>
            <Text fontSize='lg' fontWeight='medium'>
              How much will you charge for similar apps?
            </Text>
            <Text fontSize='md' fontWeight='normal'>
              Please provide details for as many categories as possible. The more pricing info
              you provide, the more accurate <i>estimations</i> will be generated.
            </Text>
          </VStack>
          <SimpleGrid columns={4} gap='3' w='98%' minChildWidth='250px'>
            {Object.keys(variantApps?.data)?.map(variant => (
              <VariantAppView
                key={variant.name}
                pricing={variantPricing?.find(x => x.name === variant)}
                variant={variant}
                apps={variantApps?.data[variant]}
                onClick={() => openModal(variant)}
              />
            ))}
          </SimpleGrid>
        </>
      )}
    </VStack>
  )
}

export default FixedPricing
