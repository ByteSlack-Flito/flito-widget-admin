import {
  Button,
  SimpleGrid,
  Text,
  useStatStyles,
  VStack
} from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { groupBy } from '../../misc/featureHelper'
import { VariantAppView, InfoBox, AddVariantPriceModal } from './components'
import AppListing from '../../assets/jsons/appListing-v2.json'
import { useWidget } from '../../data/database/users/profile'

const FixedPricing = ({ setupCompleted }) => {
  const variantApps = groupBy(AppListing.options, 'type')
  const variantModalRef = useRef()

  const [variantPricing, setVariantPricing] = useState([])

  function openModal (variant) {
    const currentVariant = variantPricing?.find(x => x.name === variant)
    variantModalRef?.current?.setVariantData(currentVariant || {name: variant})
    variantModalRef?.current?.open()
  }

  function handleVariantPricing (data) {
    const currentIndex = variantPricing.findIndex(
      x => x.name === data.name
    )
    if (currentIndex > -1) {
      const spread = [...variantPricing]
      spread[currentIndex] = data
      setVariantPricing(spread)
    } else {
      setVariantPricing(prev => [...prev, data])
    }
  }

  return (
    <VStack w='full' fontWeight='normal' align='flex-start' spacing='5' pb='10'>
      <AddVariantPriceModal
        ref={variantModalRef}
        onSuccessClose={handleVariantPricing}
      />
      {!setupCompleted && (
        <InfoBox
          type='error'
          title='Set-up Required'
          description='You need to complete the setup below to enable our AI to generate quotations based on Fixed Pricing'
        >
          {/* <Button
            size='xs'
            colorScheme='teal'
            onClick={() => modalRef?.current?.open()}
          >
            Start Setup
          </Button> */}
        </InfoBox>
      )}
      <Text fontSize='md' fontWeight='medium'>
        How much will you charge for similar apps?
      </Text>
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
    </VStack>
  )
}

export default FixedPricing
