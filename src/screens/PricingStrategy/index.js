import { Select, SimpleGrid, Spacer, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ScreenContainer } from '../../components/global'
import HourlyPricing from './hourlyPricing'

const PricingStrategyScreen = () => {
  const [pricingType, setPricingType] = useState('');

  return (
    <ScreenContainer
      title='Pricing Strategy'
      description='Manage your pricing strategies for your quotations.'
    >
      <SimpleGrid
        spacing='40px'
        columns={{
          sm: 2,
          lg: 3
        }}
      >
        <VStack rowGap={'1'}>
          <Select
            placeholder='How do you charge for projects'
            onChange={e => {
              setPricingType(e.target.value)
            }}
          >
            <option value='hourly'>Hourly</option>
            <option value='fixed'>Fixed Price</option>
          </Select>

          <Spacer h='10' />
          {pricingType === 'hourly' && <HourlyPricing />}
          {/* {pricingType === 'fixed' && <FixedPricing />} */}
        </VStack>
      </SimpleGrid>
    </ScreenContainer>
  )
}

export default PricingStrategyScreen
