import { Button, Input, Spinner, Tooltip, VStack } from '@chakra-ui/react'
import { arrayUnion } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import {
  ScreenContainer,
  SiteStyles,
  useToastGenerator
} from '../../components/global'
import { useProfile } from '../../data/database/users/profile'

const CalendlyScreen = () => {
  const { isFetching, isUpdating, data, update } = useProfile()
  const [calendlyLink, setCalendlyLink] = useState('')

  useEffect(() => {
    if (data) {
      setCalendlyLink(
        data.integrations?.find(
          x => String(x.provider).toLowerCase() === 'calendly'
        ).hostedLink
      )
    }
  }, [data])

  const toast = useToastGenerator()

  async function performUpdate () {
    const data = {
      hostedLink: calendlyLink,
      provider: 'Calendly'
    }
    const result = await update({ integrations: arrayUnion(data) })

    if (result.success) {
      toast.show(result)
    }
  }

  const isFormValid =
    calendlyLink?.length > 0 &&
    calendlyLink?.includes('calendly.com/') &&
    calendlyLink?.split('.com/')[1]?.length > 4

  const invalidProps = !isFormValid && {
    opacity: '0.7',
    cursor: 'not-allowed'
  }

  return (
    <ScreenContainer description='Manage your Calendly meetings with client, within the Estimator.'>
      {/* <SimpleGrid spacing='40px' pr='5'> */}
      <VStack
        align='flex-start'
        // gridColumnStart={1}
        // gridColumnEnd={5}
        w='full'
        h='max-content'
        spacing='5'
      >
        {isFetching && <Spinner size='md' color='blue.400' />}
        {!isFetching && (
          <>
            <Input
              size='sm'
              placeholder='https://calendly.com/your_scheduling_page'
              maxW='400px'
              onChange={e => setCalendlyLink(e.target.value)}
              value={calendlyLink}
              {...SiteStyles.InputStyles}
            />
            <Tooltip
              label={
                !isFormValid && (
                  <>
                    Please provide valid Calendly link. <br />
                    Ex: https://calendly.com/your_scheduling_page
                  </>
                )
              }
              placement='bottom-start'
              hasArrow
              bg='white'
              color='#0f283d'
              p='2'
              pl='4'
              pr='4'
              fontSize='xs'
            >
              <Button
                // disabled={!isFormValid}
                transition='all 300ms'
                size='sm'
                // colorScheme='blue'
                variant='solid'
                fontWeight='semibold'
                mt='7'
                isLoading={isUpdating}
                onClick={performUpdate}
                _hover={{
                  opacity: 1
                }}
                {...SiteStyles.ButtonStyles}
                {...invalidProps}
              >
                Update Calendly Link
              </Button>
            </Tooltip>
          </>
        )}
      </VStack>
    </ScreenContainer>
  )
}

export default CalendlyScreen
