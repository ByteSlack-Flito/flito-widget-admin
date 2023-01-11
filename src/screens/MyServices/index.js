import { Box, Flex, Spinner, VStack } from '@chakra-ui/react'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { AiOutlineAppstoreAdd } from 'react-icons/ai'
import { ScreenContainer } from '../../components/global'
import { useServicesHook } from '../../data/database/users/services'
import { ServiceSingle, StackCreatable, StackModals } from './components'
import Select from 'react-select'
import { ReactSelectStyles } from '../PricingStrategy'
import { useWidget } from '../../data/database/users/profile'
import { async } from '@firebase/util'
import { useSelector } from 'react-redux'

export const MyServicesScreen = () => {
  const { isFetching, data, getAll } = useServicesHook()
  const [currencies, setCurencies] = useState()
  const profile = useSelector(state => state.user?.profile)
  const widgetHook = useWidget()

  const serviceModalRef = useRef()

  function showCreateServiceModal (service) {
    serviceModalRef?.current?.open(service)
  }

  useEffect(() => {
    getCurrencies()
  }, [])

  async function getCurrencies () {
    axios
      .get('https://openexchangerates.org/api/currencies.json')
      .then(response => {
        if (response.data) {
          const formatted = []
          Object.keys(response.data).map(key =>
            formatted.push({
              label: `${response.data[key]} (${key})`,
              value: key
            })
          )
          setCurencies(formatted)
        }
      })
  }

  async function updatePricing (val) {
    await widgetHook.update({
      pricing: {
        currency: val
      }
    })
  }

  return (
    <ScreenContainer
      title='My Services'
      description='Mange the services you offer.'
    >
      <VStack align='flex-start' w='full' h='max-content' spacing='2'>
        <StackModals.AddServiceModal
          ref={serviceModalRef}
          onSuccessClose={() => {
            getAll()
          }}
        />
        {isFetching && <Spinner size='md' color='blue.400' />}
        {!isFetching && (
          <VStack w='full' h='full' align='flex-start' spacing='4'>
            <Box w='400px'>
              <Select
                options={currencies}
                isLoading={widgetHook.isFetching || widgetHook.isUpdating}
                // defaultValue={currencies}
                className='react_select'
                placeholder='Select Currency For Your Services...'
                styles={ReactSelectStyles}
                onChange={val => updatePricing(val.value)}
                value={currencies?.find(
                  x => x.value === widgetHook.data?.pricing?.currency
                )}
              />
            </Box>
            <Flex gap='3' w='full' wrap='wrap' pr='3'>
              {data?.map((service, index) => {
                return (
                  <ServiceSingle
                    // isEditable={true}
                    icon={<AiOutlineAppstoreAdd />}
                    key={index}
                    title={service?.name}
                    description={service?.description}
                    onClick={() => showCreateServiceModal(service)}
                  />
                )
              })}
              <StackCreatable.CreateService
                onClick={() => showCreateServiceModal()}
              />
            </Flex>
          </VStack>
        )}
      </VStack>
    </ScreenContainer>
  )
}
