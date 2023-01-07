import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Text,
  ModalFooter,
  Input,
  Button
} from '@chakra-ui/react'
import { Timestamp } from 'firebase/firestore'
import React, { useImperativeHandle, useState } from 'react'
import { SiteStyles, useToastGenerator } from '../../../components/global'
import { useBundlesHook } from '../../../data/database/users/bundles'
import { StringHelper } from '../../../data/extensions/stringHelper'

export const DuplicateBundleModal = React.forwardRef(
  ({ onSuccessClose, performAdd, isUpdating }, ref) => {
    const [isOpen, setIsOpen] = useState()
    const [data, setData] = useState()
    const [serviceName, setServiceName] = useState('')
    // const { isUpdating, add } = useBundlesHook(0, true)
    const toast = useToastGenerator()

    function open (existingData) {
      setIsOpen(true)
      setData(existingData)
    }

    useImperativeHandle(ref, () => ({
      open
    }))

    async function performDuplicate () {
      if (isFormValid) {
        const result = await performAdd({
          ...data,
          name: serviceName
        })

        if (result.success) {
          setIsOpen(false)
          onSuccessClose && onSuccessClose()
        } else {
          toast.show(result)
        }
      }
    }

    const isFormValid = !StringHelper.isEmpty(serviceName)
    return (
      <Modal
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
        size='md'
        motionPreset='slideInBottom'
        onCloseComplete={() => {
          setServiceName('')
        }}
        scrollBehavior='inside'
      >
        <ModalOverlay />
        <ModalContent
          color='white'
          bg='#091927'
          h='max-content'
          alignSelf='center'
          justifySelf='center'
        >
          <ModalHeader>
            <Text w='max-content' fontSize='lg'>
              Duplicate bundle
            </Text>
          </ModalHeader>
          <ModalCloseButton
            mt='1.5'
            _hover={{
              bg: '#143554'
            }}
          />
          <ModalBody position='relative'>
            <Input
              {...SiteStyles.InputStyles}
              placeholder='New bundle name'
              onChange={e => setServiceName(e.target.value)}
            />
          </ModalBody>

          <ModalFooter justifyContent={'flex-end'}>
            <Button
              {...SiteStyles.ButtonStyles}
              size='sm'
              disabled={!isFormValid}
              onClick={performDuplicate}
              isLoading={isUpdating}
            >
              Create Duplicate
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  }
)
