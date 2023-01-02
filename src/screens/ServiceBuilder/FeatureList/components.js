import {
  VStack,
  Button,
  Box,
  Modal,
  ModalBody,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Text,
  Input,
  ModalFooter,
  Tooltip,
  Spinner,
  Textarea
} from '@chakra-ui/react'
import { DeleteButton } from '../../ProjectRequests/components'
import React, { useEffect, useState, useImperativeHandle } from 'react'
import { BiPlus } from 'react-icons/bi'
import { SiteStyles, useToastGenerator } from '../../../components/global'
import Select from 'react-select'
import Creatable from 'react-select/creatable'
import { useForm } from 'react-hook-form'

import { ReactSelectStyles } from '../../PricingStrategy'
import { uuidv4 } from '@firebase/util'
import { useMicroServices } from '../../../data/database/users/services'
import { StringHelper } from '../../../data/extensions/stringHelper'
import { useWidget } from '../../../data/database/users/profile'
import { AppTypes } from '../../TechStacks'

export const AddFeatureModal = React.forwardRef(
  ({ onSuccessClose, categoryList }, ref) => {
    const [categories, setCategories] = useState(categoryList)
    const initialState = {
      name: '',
      description: '',
      categoryID: undefined,
      services: [],
      variants: []
    }
    const [formData, setFormData] = useState(initialState)
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isExistingData, setIsExistingData] = useState(false)
    const { data, isFetching } = useMicroServices()
    const widgetHook = useWidget()
    const toast = useToastGenerator()

    function getDevelopmentServices () {
      const services = []
      data?.map(service => {
        if (service.serviceType === 'development') {
          services.push({
            label: service.name,
            value: service.uid
          })
        }
      })
      widgetHook.data?.appTypes?.map(app => {
        const app_type_name = 'Test'
        services.push({
          label: app_type_name,
          value: app.appType
        })
      })
      return services
    }

    function getVariations () {
      const variants = []
      data?.map(service => {
        if (service.serviceType === 'development') {
          if (formData.services.some(x => x.value === service.uid)) {
            service.microServices?.map(micro => {
              variants.push({
                label: micro.name,
                value: micro.uid
              })
            })
          }
        }
      })

      widgetHook.data?.appTypes?.map(app => {
        if (formData.services.some(x => x.value === app.appType)) {
          app.platforms?.map(platform => {
            variants.push({
              label: platform,
              value: platform
            })
          })
        }
      })
      return variants
    }

    function open (param) {
      setIsOpen(true)
    }

    useImperativeHandle(ref, () => ({
      open
    }))

    function handleChange (key, value) {
      setFormData(prev => ({
        ...prev,
        [key]: value
      }))
    }

    const MultiValueContainer = props => (
      <div {...props}>
        <VStack justify='center' align='center' p='2'>
          <Text fontSize='xs'>
            The category doesn't exist.{' '}
            <b>
              <i>Creating New Category</i>
            </b>{' '}
            will be available soon.
          </Text>
        </VStack>
      </div>
    )

    const formValid = !StringHelper.isPropsEmpty(formData)

    return (
      <Modal
        onClose={() => setIsOpen(false)}
        isOpen={isOpen}
        size={'2xl'}
        motionPreset='slideInBottom'
        onCloseComplete={() => {
          setFormData(initialState)
        }}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        scrollBehavior='inside'
      >
        <ModalOverlay />
        <ModalContent color='white' bg='#091927' h='full'>
          <ModalHeader
            // bg='#143554'
            display='flex'
            justifyContent='space-between'
            alignItems='center'
          >
            <Text w='max-content' fontSize='lg'>
              Create New Feature
            </Text>
          </ModalHeader>
          <ModalCloseButton
            mt='1.5'
            _hover={{
              bg: '#143554'
            }}
          />
          <ModalBody h='100%' position='relative'>
            {(isLoading || isFetching) && (
              <Spinner
                size='md'
                color='blue.400'
                position='absolute'
                top='50%'
                left='50%'
              />
            )}
            {!isLoading && !isFetching && (
              <VStack
                w='full'
                h='full'
                justify='flex-start'
                align='start'
                pt='3'
              >
                <Input
                  {...SiteStyles.InputStyles}
                  placeholder='Feature Name. Ex. OTP Verification'
                  onChange={e => handleChange('name', e.target.value)}
                />
                <Input
                  {...SiteStyles.InputStyles}
                  placeholder={`Describe ${
                    formData.name || 'this feature'
                  } in a few words...`}
                  onChange={e => handleChange('description', e.target.value)}
                />
                <Box h='10px' />
                <Text fontSize='md' fontWeight='semibold'>
                  Feature Properties
                </Text>
                <Select
                  isClearable
                  name='categoryID'
                  options={categories}
                  className='react_select'
                  placeholder='Select Feature Category...'
                  styles={ReactSelectStyles}
                  onChange={val => handleChange('category', val)}
                  value={formData.categoryID}
                />
                <Text fontSize='sm' fontWeight='normal' pt='2'>
                  Services & variants that this feature applies to:
                </Text>
                <Select
                  isMulti
                  options={getDevelopmentServices()}
                  className='react_select'
                  placeholder='Select Affected Services...'
                  styles={{
                    ...ReactSelectStyles,
                    multiValue: base => ({
                      ...base,
                      background: '#143554'
                    }),
                    multiValueLabel: base => ({
                      ...base,
                      color: 'white',
                      fontWeight: '600'
                    }),
                    multiValueRemove: base => ({
                      ...base,
                      background: '#143554'
                    })
                  }}
                  onChange={val => handleChange('services', val)}
                  value={formData.services}
                />
                <Select
                  isMulti
                  options={getVariations()}
                  className='react_select'
                  placeholder='Select Affected Variants...'
                  styles={{
                    ...ReactSelectStyles,
                    multiValue: base => ({
                      ...base,
                      background: '#143554'
                    }),
                    multiValueLabel: base => ({
                      ...base,
                      color: 'white',
                      fontWeight: '600'
                    }),
                    multiValueRemove: base => ({
                      ...base,
                      background: '#143554'
                    })
                  }}
                  onChange={val => handleChange('variants', val)}
                  value={formData.variants}
                />
              </VStack>
            )}
          </ModalBody>

          {!isLoading && (
            <ModalFooter
              justifyContent={isExistingData ? 'space-between' : 'flex-end'}
            >
              {isExistingData && (
                <DeleteButton
                  // onConfirm={performDelete}
                  popoverTitle={'Delete service?'}
                  popoverBody='If confirmed, the service will be deleted. This action is irreversible.'
                  customButton={
                    <Button
                      size='sm'
                      // onClick={e => {
                      //   formValidity().isValid && performUpdate()
                      // }}
                      // cursor={formValidity().isValid ? 'pointer' : 'not-allowed'}
                      // isLoading={isUpdating}
                      {...SiteStyles.DeleteButton_Main}
                    >
                      Delete
                    </Button>
                  }
                ></DeleteButton>
              )}
              <Tooltip
                placement='top'
                hasArrow
                label={!formValid && 'One or more properties are not set'}
                bg='white'
                color='#0f283d'
                p='2'
                pl='4'
                pr='4'
              >
                <Button
                  size='sm'
                  //   onClick={e => {
                  //     formValid && performUpdate()
                  //   }}
                  cursor={formValid ? 'pointer' : 'not-allowed'}
                  // isLoading={isUpdating}
                  {...SiteStyles.ButtonStyles}
                >
                  {isExistingData ? 'Update Feature' : 'Create Feature'}
                </Button>
              </Tooltip>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>
    )
  }
)
