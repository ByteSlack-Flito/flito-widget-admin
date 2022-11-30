import { Button, Text, VStack } from '@chakra-ui/react'
import React, { useRef } from 'react'
import { groupBy } from '../../misc/featureHelper'
import { FixedPricingSetupModal, InfoBox } from './components'

const FixedPricing = ({ setupCompleted }) => {
  const modalRef = useRef()

  return (
    <VStack w='full' fontWeight='normal' align='flex-start'>
      <FixedPricingSetupModal ref={modalRef} />
      {!setupCompleted && (
        <InfoBox
          type='error'
          title='Set-up Required'
          description='You need to complete the setup first for our AI to generate quotations based on Fixed Pricing'
        >
          <Button
            size='xs'
            colorScheme='teal'
            onClick={() => modalRef?.current?.open()}
          >
            Start Setup
          </Button>
        </InfoBox>
      )}
    </VStack>
  )
}

export default FixedPricing
