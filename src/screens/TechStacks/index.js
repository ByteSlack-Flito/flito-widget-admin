import {
  Button,
  Flex,
  HStack,
  SimpleGrid,
  Spinner,
  Text,
  Tooltip,
  useToast,
  VStack
} from '@chakra-ui/react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { AiOutlineAppstoreAdd, AiOutlineDesktop } from 'react-icons/ai'
import { BsCheck2 } from 'react-icons/bs'
import { HiOutlineCursorClick } from 'react-icons/hi'
import { ImMobile } from 'react-icons/im'
import { useSelector } from 'react-redux'
import {
  ScreenContainer,
  SiteStyles,
  useToastGenerator
} from '../../components/global'
import { useFirebaseInstance } from '../../data/database/users/auth'
import { updateProfile, useWidget } from '../../data/database/users/profile'
import { useMicroServices } from '../../data/database/users/services'
import { StringHelper } from '../../data/extensions/stringHelper'
import { AppTypeSingle, StackCreatable, StackModals } from './components'

const AppTypes = [
  {
    icon: <ImMobile size={14} />,
    value: 'mobile-app',
    title: 'Mobile App',
    description: 'Native & Hybrid Mobile Apps Development',
    platforms: ['Android', 'iOS', 'AndroidTV', 'tvOS', 'watchOS', 'wearOS']
  },
  {
    icon: <HiOutlineCursorClick size={14} />,
    value: 'web-app',
    title: 'Websites & Web App',
    description: 'Responsive Website and Web Apps development.',
    platforms: ['Static Websites', 'SPA', 'PWA']
  },
  {
    icon: <AiOutlineDesktop size={14} />,
    value: 'desktop-app',
    title: 'Desktop App',
    description: 'Classic Desktop Applications development.',
    platforms: ['Windows', 'Linux', 'macOS']
  }
]

export const TechStackScreen = () => {
  const instance = useFirebaseInstance()
  const [selectedAppTypes, setSelectedAppTypes] = useState([])
  const [selectedServiceTypes, setSelectedServiceTypes] = useState([])
  const { userId } = useSelector(state => state.user)
  const { isFetching, isUpdating, data, update, get } = useWidget()
  const microServiceHook = useMicroServices()
  const toast = useToastGenerator()

  const serviceModalRef = useRef()

  const updateSelectedAppTypes = (appType, platform) => {
    setSelectedAppTypes(prev => {
      let items = [...prev]

      const existing = items.find(x => x.appType === appType)
      if (existing) {
        const existingIdx = items.findIndex(x => x.appType === existing.appType)
        if (platform) {
          const exsPlatform = existing.platforms
          const updatedPlatforms = () => {
            if (exsPlatform) {
              if (exsPlatform?.some(x => x === platform)) {
                return exsPlatform?.filter(x => x !== platform)
              } else {
                return [...exsPlatform, platform]
              }
            } else {
              return [platform]
            }
          }
          let updated = {
            ...existing,
            platforms: updatedPlatforms()
          }
          items[existingIdx] = updated
        } else {
          items.splice(existingIdx, 1)
        }
      } else {
        items = [
          ...items,
          {
            appType
          }
        ]
      }

      return items
    })
  }

  function updateService (service) {
    setSelectedServiceTypes(prev => {
      const spread = [...prev]
      const existing_index = spread.findIndex(x => x.uid === service.uid)

      /// If service is not selected, we add it aka make it selected. Or if it is already added,
      /// we remove it aka de-select it.
      if (existing_index <= -1) {
        spread.push({
          ...service,
          microServices: []
        })
      } else {
        spread.splice(existing_index, 1)
      }

      return spread
    })
  }

  const updateMicroService = (serviceUID, microUID) => {
    setSelectedServiceTypes(prev => {
      const spread = [...prev]
      const existing_service_index = spread.findIndex(x => x.uid === serviceUID)
      const existing_service = { ...spread[existing_service_index] }

      const existing_microServices = [...existing_service.microServices]

      if (existing_microServices.includes(microUID)) {
        existing_service.microServices = [
          ...existing_microServices.filter(x => x !== microUID)
        ]
      } else {
        existing_service.microServices = [...existing_microServices, microUID]
      }

      spread[existing_service_index] = existing_service

      return spread
    })
  }

  function isFormValid () {
    const isAppTypesValid =
      selectedAppTypes.length > 0 &&
      selectedAppTypes.every(x => x.platforms?.length > 0)

    const isServicesValid = selectedServiceTypes?.every(
      x => x.microServices?.length > 0
    )

    return isAppTypesValid && isServicesValid
  }

  useEffect(() => data && setSelectedAppTypes(data.appTypes), [data])

  async function performUpdate () {
    const result = await update({
      appTypes: selectedAppTypes
    })
    toast.show(result)
  }

  function showCreateServiceModal (service) {
    serviceModalRef?.current?.open(service)
  }

  return (
    <ScreenContainer description='Manage what services you offer to your clients.'>
      <VStack align='flex-start' w='full' h='max-content' spacing='2'>
        <StackModals.AddServiceModal
          ref={serviceModalRef}
          onSuccessClose={() => {
            microServiceHook.getAll()
          }}
        />
        {(isFetching || microServiceHook.isFetching) && (
          <Spinner size='md' color='blue.400' />
        )}
        {!isFetching && !microServiceHook.isFetching && (
          <>
            <Flex gap='3' w='full' wrap='wrap'>
              {AppTypes.map(type => {
                const existing = selectedAppTypes.find(
                  x => x.appType === type.value
                )
                return (
                  <AppTypeSingle
                    isSelected={existing}
                    key={type.value}
                    {...type}
                    onSelectChange={updateSelectedAppTypes}
                  />
                )
              })}
              {microServiceHook.data?.map((service, index) => {
                const existing = selectedServiceTypes.find(
                  x => x.uid === service.uid
                )
                return (
                  <AppTypeSingle
                    isEditable={true}
                    isSelected={existing}
                    icon={<AiOutlineAppstoreAdd />}
                    key={index}
                    title={service?.name}
                    description={service?.description}
                    onSelectChange={() => updateService(service)}
                    onEdit={() => showCreateServiceModal(service)}
                  />
                )
              })}
              <StackCreatable.CreateService onClick={() => showCreateServiceModal()} />
            </Flex>

            {selectedAppTypes?.map(({ appType }) => {
              const { platforms } = AppTypes.find(x => x.value === appType)

              return (
                <VStack align='flex-start' key={appType}>
                  <Text fontWeight='medium' fontSize='sm'>
                    Select platforms for{' '}
                    <b>{AppTypes.find(x => x.value === appType).title}</b>
                  </Text>

                  <HStack align='flex-start' w='full'>
                    {platforms.map(platform => {
                      const isSelected = selectedAppTypes
                        .find(x => x.appType === appType)
                        ?.platforms?.some(x => x === platform)
                      return (
                        <Button
                          key={platform}
                          size='sm'
                          color='white'
                          borderWidth='thin'
                          borderColor={'#543d63'}
                          bg={!isSelected ? 'transparent' : '#543d63'}
                          leftIcon={isSelected && <BsCheck2 />}
                          _hover={{
                            bg: '#0f283d'
                          }}
                          _active={{
                            bg: '#0f283d'
                          }}
                          onClick={() =>
                            updateSelectedAppTypes(appType, platform)
                          }
                          borderRadius='full'
                        >
                          {platform}
                        </Button>
                      )
                    })}
                  </HStack>
                </VStack>
              )
            })}

            {selectedServiceTypes?.map((service, index) => {
              const exsMicroServices = service.microServices
              const { microServices } = microServiceHook.data.find(
                x => x.uid === service.uid
              )
              return (
                <VStack align='flex-start' key={`${service.uid}${index}`}>
                  <Text fontWeight='medium' fontSize='sm'>
                    Select micro-services for <b>{service.name}</b>
                  </Text>

                  <HStack align='flex-start' w='full'>
                    {microServices.map(micro => {
                      const isSelected = exsMicroServices.includes(micro.uid)
                      // console.log('Micro selected:', isSelected, selectedServiceTypes[0].microServices)
                      return (
                        <Button
                          key={micro.uid}
                          size='sm'
                          color='white'
                          borderWidth='thin'
                          borderColor={'#543d63'}
                          bg={!isSelected ? 'transparent' : '#543d63'}
                          leftIcon={isSelected && <BsCheck2 />}
                          _hover={{
                            bg: '#0f283d'
                          }}
                          _active={{
                            bg: '#0f283d'
                          }}
                          onClick={() =>
                            updateMicroService(service.uid, micro.uid)
                          }
                          borderRadius='full'
                        >
                          {micro.name}
                        </Button>
                      )
                    })}
                  </HStack>
                </VStack>
              )
            })}
          </>
        )}
      </VStack>
      {/* </SimpleGrid> */}
      <Tooltip
        placement='right'
        label={
          !isFormValid() &&
          `Please select at-least one micro-service for all services you have selected`
        }
        hasArrow
        bg='white'
        color='black'
        pt='1.5'
        pb='1.5'
        p='3'
      >
        <Button
          cursor={isFormValid() ? 'pointer' : 'not-allowed'}
          size='sm'
          // colorScheme='blue'
          variant='solid'
          fontWeight='semibold'
          mt='7'
          isLoading={isUpdating}
          onClick={() => {
            isFormValid() && performUpdate()
          }}
          {...SiteStyles.ButtonStyles}
        >
          Update Services
        </Button>
      </Tooltip>
    </ScreenContainer>
  )
}
