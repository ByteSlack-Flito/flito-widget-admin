import { Select, SimpleGrid, Spacer, VStack, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ScreenContainer } from '../../components/global'
import HourlyPricing from './hourlyPricing'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
const PricingStrategyScreen = () => {
  const [pricingType, setPricingType] = useState('');
  const options = [
    'one', 'two', 'three'
  ];
  const defaultOption = options[0];
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
        {/* <VStack rowGap={'1'} alignItems='flex-start'>
          <Text fontSize='xs' fontWeight={'bold'}>Select Currency</Text>

          <Dropdown options={options} placeholder="Select Currency" />;
        </VStack > */}

        <VStack rowGap={'1'} alignItems='flex-start'>

          <Text fontSize='xs' fontWeight={'bold'}>Select pricing type</Text>
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
