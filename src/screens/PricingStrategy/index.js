import { Select, SimpleGrid, Spacer, VStack, Text } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { ScreenContainer } from '../../components/global'
import HourlyPricing from './hourlyPricing'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
const PricingStrategyScreen = () => {

  const [currencies, setCurrencies] = useState([])
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [pricingType, setPricingType] = useState('');

  useEffect(() => {
    (async () => {
      const response = await fetch(`https://openexchangerates.org/api/currencies.json`);
      let data = await response.json()
      setCurrencies(Object.keys(data))
    })();
  }, []);
  console.log(selectedCurrency)
  return (
    <ScreenContainer
      title='Pricing Strategy'
      description='Manage your pricing strategies for your quotations.'
    >
      <SimpleGrid
        spacing='40px'
        columns={{
          sm: 1,
          lg: 1
        }}
      >
        <VStack rowGap={'1'} alignItems='flex-start' width={'25vw'}>
          <Text fontSize='xs' fontWeight={'bold'}>Select Currency</Text>

          <Dropdown
            options={currencies}
            onChange={(selected) => setSelectedCurrency(selected)}
            placeholder="Select Currency" width={100} />;
        </VStack >

        <VStack rowGap={'1'} alignItems='flex-start' width={'25vw'}>

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
