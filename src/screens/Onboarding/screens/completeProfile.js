import { useState } from 'react'
import { StringHelper } from '../../../data/extensions/stringHelper'
import Logo from '../../../logo-trans.png'
// import UserAvatar from '../../../userAvatar.png'
import { AiOutlineArrowRight } from 'react-icons/ai'
import { useFilePicker } from '../../../data/hooks/fileIO.js'
import { useForm } from 'react-hook-form'
//icons
import { BsUpload } from 'react-icons/bs'
import {
  Box,
  Grid,
  GridItem,
  Image,
  Input,
  Spacer,
  Stack,
  HStack,
  Button,
  Text,
  VStack,
  IconButton
} from '@chakra-ui/react'
import { useEffect } from 'react'

const CompleteProfileScreen = () => {
  const [imgPath, setImgPath] = useState('')
  const { register, handleSubmit, setValue } = useForm()
  const filePicker = useFilePicker(true, 'IMAGE')

  useEffect(() => {
    setValue('imageLocation', imgPath)
  }, [imgPath, setValue])

  function uploadFile () {
    filePicker.openPicker().then(files => {
      setImgPath(URL.createObjectURL(files[0]))
    })
  }

  const handleSave = formValues => {
    console.log('comming to form value ', formValues)
  }
  return (
    <form onSubmit={handleSubmit(handleSave)} style={{ height: '100%' }}>
      <VStack justifyContent={'space-around'} h='100%'>
        <HStack
          justifyContent={'space-between'}
          alignItems={'flex-start'}
          w='100%'
        >
          <Box
            display='flex'
            //   background={`url(${imgPath ? imgPath : UserAvatar}) center/cover no-repeat`}
            height={100}
            width={100}
            borderRadius={'50%'}
            style={{ overflow: 'hidden' }}
            alignItems='flex-end'
          >
            <IconButton
              colorScheme='blue'
              aria-label='Search database'
              h='35%'
              w='100%'
              icon={<BsUpload size={16} mb='8' />}
              onClick={() => uploadFile()}
            />
          </Box>
        </HStack>
        {/* <Spacer h='8' /> */}
        <Stack direction='column' spacing='2'>
          <Input
            placeholder='Organization Name'
            fontSize='sm'
            {...register('organization')}
          />
          <Input placeholder='Your Role' fontSize='sm' {...register('role')} />
          <Spacer h='4' />
          <Button
            rightIcon={<AiOutlineArrowRight />}
            colorScheme='blue'
            variant='solid'
            type='submit'
          >
            Complete Profile
          </Button>
          <Spacer h='4' />
          <Text fontSize='x-small' lineHeight='shorter'>
            By clicking 'Complete Profile', you agree to our Terms of Services
            and our cookie-usage policies. Flito will utilise certain cookies to
            ensure better user-experience.
          </Text>
        </Stack>
      </VStack>
    </form>
  )
}

export default CompleteProfileScreen
