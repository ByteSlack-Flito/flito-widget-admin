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
import {
  ScreenContainer,
  SiteStyles,
  useToastGenerator
} from '../../components/global'
import HourlyPricing from './hourlyPricing'
import Select from 'react-select'
import Creatable from 'react-select/creatable'
import './index.css'
import { InfoBox } from './components'
import { SiteRoutes } from '../../misc/routes'
import { useSelector } from 'react-redux'
import { useProfile, useWidget } from '../../data/database/users/profile'
import { Link as ReactRouterLink } from 'react-router-dom'
import FixedPricing from './fixedPricing'

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
const Option_IsTyping = ({ innerProps }) => (
  <div {...innerProps}>
    <VStack justify='center' align='center' p='2'>
      <Text fontSize='xs'>
        Once the Widget calculates the development cost, it will add your
        commission rate to the final quotation, before showing to clients.
      </Text>
    </VStack>
  </div>
)

export const ReactSelectStyles = {
  control: (baseStyles, state) => ({
    ...baseStyles,
    background: '#0f283d',
    borderColor: '#38B2AC'
  }),
  input: (baseStyles, state) => ({
    ...baseStyles,
    color: 'white !important'
  }),
  placeholder: baseStyles => ({
    ...baseStyles,
    color: 'white !important'
  }),
  singleValue: baseStyles => ({
    ...baseStyles,
    color: 'white !important',
    backgroundColor: '#0f283d'
  }),
  menuList: baseStyles => ({
    ...baseStyles,
    background: '#143554'
  }),
  option: (baseStyles, state) => ({
    ...baseStyles,
    ':hover': {
      backgroundColor: '#0f283d'
    },
    backgroundColor: '#143554'
  })
}

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
          to={SiteRoutes.Engine.Setup.Screens().MyTeam.path}
          {...SiteStyles.LinkStyles}
        >
          My Teams
        </Link>
        , we will calculate average hourly rates for each role to generate
        quotations.
      </>
    ),
    fixed: (
      <>
        Based on the data you provide below, we will generate quotations. Please
        cover as many App Categories as possible.
      </>
    ),
    error: (
      <>
        {' '}
        Please go to{' '}
        <Link
          as={ReactRouterLink}
          to={SiteRoutes.Engine.Setup.Screens().MyTeam.path}
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
    if (data && data.pricing && currencies) {
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
                styles={ReactSelectStyles}
              />
            </VStack>
            <VStack alignItems='flex-start' spacing='1' width={'20vw'} pl='4'>
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
                styles={ReactSelectStyles}
              />
            </VStack>
            <VStack alignItems='flex-start' spacing='1' width={'15vw'} pl='4'>
              <Text fontSize='xs' fontWeight='medium'>
                Profit Margin in %
              </Text>
              <Creatable
                components={{
                  DropdownIndicator: null,
                  NoOptionsMessage: Option_IsTyping
                }}
                styles={ReactSelectStyles}
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
                        label: data?.pricing?.commissionRate,
                        value: data?.pricing?.commissionRate
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
              <>
                {/* <Spacer h='10' /> */}
                {pricingData.strategy?.value === 'fixed' && (
                  <FixedPricing
                    teamData={profileData.team}
                    currency={pricingData.currency?.value}
                  />
                )}
              </>
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
