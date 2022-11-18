import { SimpleGrid, Spacer, VStack, Text, Link } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { ScreenContainer } from '../../components/global'
import { Link as ReactRouterLink } from 'react-router-dom'
import HourlyPricing from './hourlyPricing'
import Select from 'react-select'
import './index.css'
import { InfoBox } from './components'
import { SiteRoutes } from '../../misc/routes'

const pricing_options = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'fixed', label: 'Fixed' }
]

const PricingStrategyScreen = () => {
  const [currencies, setCurrencies] = useState([])
  const [selectedCurrency, setSelectedCurrency] = useState('')
  const [pricingType, setPricingType] = useState('')

  const pricing_descriptions = {
    hourly: (
      <>
        Based on your team set-up in{' '}
        <Link
          as={ReactRouterLink}
          to={SiteRoutes.Engine.TeamAndTech.Screens().MyTeam.path}
        >
          My Teams
        </Link>
        , we have calculated average hourly rates for each role to generate
        quotations.
      </>
    )
  }

  useEffect(() => {
    (async () => {
      const response = await fetch(
        `https://openexchangerates.org/api/currencies.json`
      )
      let data = await response.json() // Object : { USD: "United States Dollars" }
      const currency_formatted = Object.keys(data).map(key => {
        return {
          value: key,
          label: `${data[key]} (${key})`
        }
      })
      setCurrencies(currency_formatted)
    })()
  }, [])
  return (
    <ScreenContainer
      title='Pricing Strategy'
      description='Manage your pricing strategies for your quotations.'
    >
      <VStack
        rowGap={'1'}
        alignItems='flex-start'
        fontSize='sm'
        fontWeight='normal'
        w='100%'
      >
        <VStack alignItems='flex-start' spacing='1' width={'25vw'}>
          <Text fontSize='xs' fontWeight='medium'>
            Currency
          </Text>
          <Select
            options={currencies}
            className='react_select'
            placeholder='Select currency...'
            onChange={e => setSelectedCurrency(e.value)}
          />
        </VStack>
        <VStack alignItems='flex-start' spacing='1' width={'25vw'}>
          <Text fontSize='xs' fontWeight='medium'>
            How do you charge your client
          </Text>
          <Select
            options={pricing_options}
            className='react_select'
            onChange={e => setPricingType(e.value)}
            placeholder='Select strategy...'
          />
        </VStack>
      </VStack>

      <VStack rowGap={'1'} alignItems='flex-start' w='full'>
        <Spacer h='10' />
        {pricingType && (
          <InfoBox
            type='success'
            title={`${pricingType} pricing will now be used to generate quotations`}
            description={pricing_descriptions[pricingType]}
          />
        )}
        <Spacer h='10' />
        {pricingType === 'hourly' && (
          <HourlyPricing currency={selectedCurrency} />
        )}
      </VStack>
    </ScreenContainer>
  )
}

export default PricingStrategyScreen
