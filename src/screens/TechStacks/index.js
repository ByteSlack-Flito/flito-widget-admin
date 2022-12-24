import {
  Button,
  Flex,
  HStack,
  SimpleGrid,
  Spinner,
  Text,
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
import { AppTypeSingle, StackCreatable, StackModals } from './components'

const AppTypes = [
  {
    icon: <ImMobile size={14} />,
    value: 'mobile-app',
    title: 'Mobile Apps',
    description: 'Native & Hybrid Apps For Cross-Platform Devices',
    platforms: ['Android', 'iOS', 'AndroidTV', 'tvOS', 'watchOS', 'wearOS']
  },
  {
    icon: <HiOutlineCursorClick size={14} />,
    value: 'web-app',
    title: 'Websites & Web Apps',
    description: 'Responsive Website and Web Apps for modern browsers.',
    platforms: ['Static Websites', 'SPA', 'PWA']
  },
  {
    icon: <AiOutlineDesktop size={14} />,
    value: 'desktop-app',
    title: 'Desktop Apps',
    description: 'Classic Desktop Applications that run locally.',
    platforms: ['Windows', 'Linux', 'macOS']
  }
]

export const TechStackScreen = () => {
  const instance = useFirebaseInstance()
  const [selectedAppTypes, setSelectedAppTypes] = useState([])
  const [selectedServiceTypes, setSelectedServiceTypes] = useState([])
  const { userId } = useSelector(state => state.user)
  const { isFetching, isUpdating, data, update, get } = useWidget()
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

  const updateSelectedServiceTypes = (service, microService) => {
    setSelectedServiceTypes(prev => {
      let items = [...prev]

      const existing = items.find(x => x.uid === service.uid)
      if (existing) {
        const existingIdx = items.findIndex(x => x.uid === existing.uid)
        if (microService) {
          const exsServices = existing.microServices ? [...existing.microServices] : null
          const updatedServices = () => {
            if (exsServices) {
              const exsMicroIndex = exsServices?.findIndex(
                x => x.uid === microService.uid
              )
              if (exsMicroIndex > -1) {
                // console.log('Found micro at:', exsMicroIndex)
                const updatedExsService = {
                  ...exsServices[exsMicroIndex],
                  enabled: !exsServices[exsMicroIndex].enabled
                }
                exsServices[exsMicroIndex] = updatedExsService
                // console.log('Updated exs at:', exsServices[exsMicroIndex].enabled)
                return exsServices
              } else {
                return [...exsServices, microService]
              }
            } else {
              return [microService]
            }
          }
          let updated = {
            ...existing,
            microServices: updatedServices()
          }
          items[existingIdx] = updated
          // console.log('Retuning:', items)
        } else {
          items.splice(existingIdx, 1)
        }
      } else {
        const serviceOnly = {
          ...service,
          microServices: null
        }
        items = [...items, serviceOnly]
      }

      return items
    })
  }

  function isFormValid () {
    return (
      selectedAppTypes.length > 0 &&
      selectedAppTypes.every(x => x.platforms?.length > 0)
    )
  }

  useEffect(() => data && setSelectedAppTypes(data.appTypes), [data])

  async function performUpdate () {
    const result = await update({
      appTypes: selectedAppTypes
    })
    toast.show(result)
  }

  function showCreateServiceModal () {
    serviceModalRef?.current?.open()
  }

  return (
    <ScreenContainer description='Manage what applications you offer to develop for your clients.'>
      {/* <SimpleGrid spacing='40px' pr='5'> */}
      <VStack
        align='flex-start'
        // gridColumnStart={1}
        // gridColumnEnd={5}
        w='full'
        h='max-content'
        spacing='2'
      >
        <StackModals.AddServiceModal
          ref={serviceModalRef}
          onSuccessClose={get}
        />
        {isFetching && <Spinner size='md' color='blue.400' />}
        {!isFetching && (
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
              {data.serviceTypes?.map((service, index) => {
                const existing = selectedServiceTypes.find(
                  x => x.uid === service.uid
                )
                return (
                  <AppTypeSingle
                    isSelected={existing}
                    // selectedPlatforms={existing?.selectedPlatforms}
                    icon={<AiOutlineAppstoreAdd />}
                    key={index}
                    title={service?.name}
                    description={service?.description}
                    onSelectChange={() => updateSelectedServiceTypes(service)}
                  />
                )
              })}
              <StackCreatable.CreateService onClick={showCreateServiceModal} />
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
              const { microServices } = data.serviceTypes.find(
                x => x.uid === service.uid
              )
              return (
                <VStack align='flex-start' key={service.uid}>
                  <Text fontWeight='medium' fontSize='sm'>
                    Select micro-services for <b>{service.name}</b>
                  </Text>

                  <HStack align='flex-start' w='full'>
                    {microServices.map(micro => {
                      const isSelected = exsMicroServices?.find(
                        x => x.uid === micro.uid
                      )?.enabled
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
                            updateSelectedServiceTypes(service, micro)
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
      <Button
        disabled={!isFormValid()}
        size='sm'
        // colorScheme='blue'
        variant='solid'
        fontWeight='semibold'
        mt='7'
        isLoading={isUpdating}
        onClick={performUpdate}
        {...SiteStyles.ButtonStyles}
      >
        Update Stacks
      </Button>
    </ScreenContainer>
  )
}
