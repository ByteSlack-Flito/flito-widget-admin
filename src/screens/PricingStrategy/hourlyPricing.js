
import { useNavigate } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import { useForm } from 'react-hook-form'
import {
  VStack,
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  HStack,
  Spacer
} from '@chakra-ui/react'
import { useState } from 'react'
const HourlyPricing = () => {

  const roles = ['Front-End', 'Back-End', 'DevOps/Cloud Developers', 'UI Designer']
  const {
    register,
    handleSubmit,
  } = useForm({ mode: 'onChange' })

  const formResult = {}
  const onSubmit = data => {

    roles.forEach((role, index) => {
      const countId = `count${index}`
      const rateId = `rate${index}`
      formResult[role] = {

        devCount: data[countId],
        avgRate: data[rateId]
      }
    })
    console.log(formResult)

  }

  const children = roles.map((role, index) => (
    <HStack gap='6' key={index}>
      <FormControl w='80%'>
        <FormLabel fontSize='xs' fontWeight='bold'>No. Of {role} In Your Team</FormLabel>
        <Input
          transition='all 300ms'
          fontSize='sm'
          size='md'
          bg='gray.100'
          border='none'
          _focus={{
            borderWidth: 'none',
            bg: 'white'
          }}
          placeholder='No. Of Front-End Developers'
          {...register(`count${index}`, { required: true })}
        />
      </FormControl >
      <FormControl w='30%'>
        <FormLabel fontSize='xs' fontWeight={'bold'}>Avg. Hourly Rate</FormLabel>
        <Input
          transition='all 300ms'
          fontSize='sm'
          size='md'
          bg='gray.100'
          border='none'
          _focus={{
            borderWidth: 'none',
            bg: 'white'
          }}
          placeholder='Hourly Rate'
          {...register(`rate${index}`, { required: true })}
        />
      </FormControl>

    </HStack>
  )) || '';


  return (
    <Box
      w='100%'
      h='100%'
      color='gray.600'
      justifyContent='space-between'
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
      >
        <VStack gap='6'>
          {children}
        </VStack>
        <Spacer h='6' />
        <Button
          type='submit'
          size='sm'
          colorScheme='purple'
          variant='solid'
          fontWeight='semibold'
          rightIcon={<FiArrowRight />}
        // disabled={!isDirty || !isValid}
        // onClick={handleSubmit}
        >
          Update Pricing Model
        </Button>


        {/* <VStack spacing='3' justify='space-between' align='flex-start'>

          {errors && console.log(errors)}
        </VStack> */}
      </form>
    </Box >
  )
}

export default HourlyPricing