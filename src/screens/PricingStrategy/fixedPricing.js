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

const FixedPricing = ({ none }) => {
  const variantApps = groupBy(AppListing.options, 'type')
  const variantModalRef = useRef()
  const { data, isFetching } = useWidget()

  const [variantPricing, setVariantPricing] = useState([])

  function openModal (variant) {
    const currentVariant = variantPricing?.find(x => x.name === variant)
    variantModalRef?.current?.setVariantData(
      currentVariant || { name: variant }
    )
    variantModalRef?.current?.open()
  }

  function handleVariantPricing (data) {
    const currentIndex = variantPricing.findIndex(x => x.name === data.name)
    if (currentIndex > -1) {
      const spread = [...variantPricing]
      spread[currentIndex] = data
      setVariantPricing(spread)
    } else {
      setVariantPricing(prev => [...prev, data])
    }
  }

  useEffect(() => {
    if (data) {
      setVariantPricing(data?.fixedAppPrices)
    }
  }, [data])

  const renderIncompleteSetup = () => {
    const setupCompleted = data?.length >= Object.keys(variantApps).length
    return !setupCompleted ? (
      <InfoBox
        type='error'
        title='Set-up Required'
        description='You need to complete the setup below to enable our AI to generate quotations based on Fixed Pricing'
      ></InfoBox>
    ) : (
      <></>
    )
  }

  return (
    <VStack w='full' fontWeight='normal' align='flex-start' spacing='5' pb='10'>
      <AddVariantPriceModal
        ref={variantModalRef}
        onSuccessClose={handleVariantPricing}
      />
      {isFetching && !data && <Spinner size='md' color='blue.400' />}
      {!isFetching && data && (
        <>
          {renderIncompleteSetup()}
          <VStack w='full' spacing='1' align='flex-start'>
            <Text fontSize='md' fontWeight='medium'>
              How much will you charge for similar apps?
            </Text>
            <Text fontSize='xs' fontWeight='semibold' color='red.400'>
              Please provide details for all categories. The more pricing info you provide, the better our AI will work.
            </Text>
          </VStack>
          <SimpleGrid columns={4} gap='3' w='98%' minChildWidth='250px'>
            {Object.keys(variantApps).map(variant => (
              <VariantAppView
                pricing={variantPricing.find(x => x.name === variant)}
                variant={variant}
                apps={variantApps[variant]}
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
