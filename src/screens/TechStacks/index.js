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
import { ScreenContainer, SiteStyles } from '../../components/global'
import { useFirebaseInstance } from '../../data/database/users/auth'
import { updateProfile, useWidget } from '../../data/database/users/profile'
import { useServicesHook } from '../../data/database/users/services'
import { StringHelper } from '../../data/extensions/stringHelper'
import { AppTypeSingle, StackCreatable, StackModals } from './components'

export const TechStackScreen = () => {
  const { isFetching, data, getAll } = useServicesHook()

  const serviceModalRef = useRef()

  function showCreateServiceModal (service) {
    serviceModalRef?.current?.open(service)
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
          <>
            <Flex gap='3' w='full' wrap='wrap' pr='3'>
              {data?.map((service, index) => {
                return (
                  <AppTypeSingle
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
          </>
        )}
      </VStack>
    </ScreenContainer>
  )
}
