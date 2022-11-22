import {
  SimpleGrid,
  Spacer,
  VStack,
  Text,
  Link,
  HStack,
  Spinner,
  useToast,
  Input
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { ScreenContainer, useToastGenerator } from '../../components/global'
import HourlyPricing from './hourlyPricing'
import Select from 'react-select'
import Creatable from 'react-select/creatable'
import './index.css'
import { InfoBox } from './components'
import { SiteRoutes } from '../../misc/routes'
import { useSelector } from 'react-redux'
import { useProfile, useWidget } from '../../data/database/users/profile'
import { Link as ReactRouterLink } from 'react-router-dom'

const pricing_options = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'fixed', label: 'Fixed' }
]

const commossion_options = [
  { value: '5', label: '5%' },
  { value: '10', label: '10%' },
  { value: '15', label: '5%' },
  { value: '20', label: '5%' }
]

const LoadingOption = props => (
  <div {...props}>
    <VStack justify='center' align='center' p='3'>
      <Spinner size='md' color='blue.400' />
    </VStack>
  </div>
)
const Option_IsTyping = props => (
  <div {...props}>
    <VStack justify='center' align='center' p='2'>
      <Text fontSize='sm'>Start Typing</Text>
    </VStack>
  </div>
)

const PricingStrategyScreen = () => {
  const [currencies, setCurrencies] = useState()
  const [pricingData, setPricingData] = useState({
    currency: undefined,
    strategy: undefined,
    commissionRate: undefined
  })
  const { isFetching, isUpdating, data, update } = useWidget()
  const profileData = useProfile().data
  const toast = useToastGenerator()

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
    ),
    error: (
      <>
        {' '}
        Please go to{' '}
        <Link
          as={ReactRouterLink}
          to={SiteRoutes.Engine.TeamAndTech.Screens().MyTeam.path}
          pl='1'
          pr='1'
          color='blue.500'
        >
          My Team
        </Link>
        and add team-members first, for the widget to work.
      </>
    )
  }

  useEffect(() => {
    async function getCurrencies () {
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
    }
    getCurrencies()
  }, [])

  useEffect(() => {
    if (data && currencies) {
      const formattedData = {
        currency: currencies?.find(x => x.value === data.pricing.currency),
        strategy: pricing_options.find(x => x.value === data.pricing.strategy),
        commissionRate: {
          label: data.pricing.commissionRate,
          value: data.pricing.commissionRate
        }
      }

      setPricingData(formattedData)
    }
  }, [data, currencies])

  async function updatePricingStrategy (key, val) {
    const result = await update({
      pricing: {
        [key]: val
      }
    })
    if (result.success) {
      let updatedData = {
        value: '',
        label: ''
      }
      if (key === 'currency')
        updatedData = currencies.find(x => x.value === val)
      else updatedData = pricing_options.find(x => x.value === val)

      setPricingData(prev => ({ ...prev, [key]: updatedData }))
    }
    toast.show(result)
  }
  return (
    <ScreenContainer
      title='Pricing Strategy'
      description='Manage your pricing strategies for your quotations.'
    >
      {isFetching && <Spinner size='md' color='blue.400' />}
      {!isFetching && currencies && (
        <>
          <HStack
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
                onChange={e => updatePricingStrategy('currency', e.value)}
                components={{
                  NoOptionsMessage: LoadingOption
                }}
                value={pricingData.currency}
                isLoading={isUpdating}
              />
            </VStack>
            <VStack alignItems='flex-start' spacing='1' width={'15vw'} pl='4'>
              <Text fontSize='xs' fontWeight='medium'>
                How do you charge your clients?
              </Text>
              <Select
                options={pricing_options}
                className='react_select'
                onChange={e => updatePricingStrategy('strategy', e.value)}
                placeholder='Select strategy...'
                isLoading={isUpdating}
                value={pricingData.strategy}
              />
            </VStack>
            <VStack alignItems='flex-start' spacing='1' width={'15vw'}>
              <Text fontSize='xs' fontWeight='medium'>
                Commission rate in %
              </Text>
              <Creatable
                components={{
                  DropdownIndicator: null,
                  NoOptionsMessage: Option_IsTyping
                }}
                formatCreateLabel={input => `Set Rate To "${input}"`}
                className='react_select'
                onChange={e => updatePricingStrategy('commissionRate', e.value)}
                onInputChange={(val, action) => {
                  if (action.action === 'input-change') {
                    const formattedValue = val.replace(/\D/, '')
                    setPricingData(prev => ({
                      ...prev,
                      commissionRate: {
                        label: formattedValue,
                        value: formattedValue
                      }
                    }))
                  }
                }}
                onBlur={e => {
                  if (e.target.value?.length <= 0) {
                    console.log('Triggered...')
                    setPricingData(prev => ({
                      ...prev,
                      commissionRate: {
                        label: data.pricing.commissionRate,
                        value: data.pricing.commissionRate
                      }
                    }))
                  }
                }}
                placeholder='Ex. 40'
                isLoading={isUpdating}
                // value={pricingData.commissionRate}
                inputValue={pricingData.commissionRate?.label}
              />
            </VStack>
          </HStack>

          <VStack rowGap={'1'} alignItems='flex-start' w='full'>
            <Spacer h='10' />
            {pricingData.strategy && profileData.team?.length >= 0 && (
              <InfoBox
                type='success'
                title={`${pricingData.strategy?.value} pricing will now be used to generate quotations`}
                description={pricing_descriptions[pricingData.strategy?.value]}
              />
            )}
            {profileData?.team ? (
              pricingData.strategy?.value === 'hourly' && (
                <>
                  <Spacer h='10' />
                  <HourlyPricing
                    teamData={profileData.team}
                    currency={pricingData.currency?.value}
                  />
                </>
              )
            ) : (
              <InfoBox
                type='error'
                title={`Please complete other steps.`}
                description={pricing_descriptions.error}
              />
            )}
          </VStack>
        </>
      )}
    </ScreenContainer>
  )
}

export default PricingStrategyScreen
