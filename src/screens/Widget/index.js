import { Box, Button, Code, useStatStyles } from '@chakra-ui/react'
import { useCallback, useState } from 'react'
import ReactDOMServer from 'react-dom/server'
import { BiCheck } from 'react-icons/bi'
import { ScreenContainer } from '../../components/global'
import { Constants } from '../../data/constants'

const WidgetScreen = () => {
  const [copied, setCopied] = useState(false)
  const copyCode = useCallback(() => {
    !copied &&
      navigator.clipboard.writeText(Constants.WidgetCode).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      })
  }, [])
  return (
    <ScreenContainer
      title='Your Flito Widget'
      description="Grab your Flito Widget's code to integrate into your website or web applications."
    >
      <Box maxW='95%' overflowX='scroll' borderRadius='md' pos='relative'>
        <Button
          size='xs'
          position='absolute'
          top='3'
          left='3'
          leftIcon={copied && <BiCheck color='green' />}
          colorScheme={copied ? 'gray' : 'teal'}
          onClick={copyCode}
        >
          {copied ? 'COPIED TO CLIPBOARD' : 'COPY'}
        </Button>
        <Code
          p='3'
          pt='12'
          colorScheme='teal'
          // fontWeight='medium'
          whiteSpace='pre'
          display='block'
          children={Constants.WidgetCode}
        />
      </Box>
    </ScreenContainer>
  )
}

export default WidgetScreen
