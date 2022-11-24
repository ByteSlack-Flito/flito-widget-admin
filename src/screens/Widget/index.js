import {
  Box,
  Button,
  Code,
  Link,
  Text,
  useStatStyles,
  VStack
} from '@chakra-ui/react'
import { useCallback, useState } from 'react'
import ReactDOMServer from 'react-dom/server'
import { BiCheck, BiLinkExternal } from 'react-icons/bi'
import { useSelector } from 'react-redux'
import { ScreenContainer } from '../../components/global'
import { Constants } from '../../data/constants'

const HelpLinks = [
  {
    label: 'What is an iFrame and how to use it',
    link: 'https://www.hostinger.com/tutorials/what-is-iframe/'
  },
  {
    label: 'Use iFrames in WordPress',
    link: 'https://www.nexcess.net/blog/how-to-embed-iframe-code-in-wordpress/'
  },
  {
    label: 'Use iFrames in a React App',
    link: 'https://blog.logrocket.com/best-practices-react-iframes/'
  },
  {
    label: 'Use iFrames in an ASP.Net Web App',
    link: 'https://dotnettutorials.net/lesson/iframes-in-html/'
  }
]

const WidgetScreen = () => {
  const [copied, setCopied] = useState(false)
  const userState = useSelector(state => state.user)
  const copyCode = useCallback(() => {
    !copied &&
      navigator.clipboard
        .writeText(
          Constants.WidgetCode.replace('{widgetCode}', userState.userId)
        )
        .then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        })
  }, [])
  return (
    <ScreenContainer
      title='Your Flito Widget'
      description="Grab your Flito Widget's code to integrate into your website or web applications."
    >
      <VStack spacing='3' align='flex-start' w='95%'>
        <Box w='full' overflowX='scroll' borderRadius='md' pos='relative'>
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
            children={Constants.WidgetCode.replace(
              '{widgetCode}',
              userState.userId
            )}
          />
        </Box>
        <Text fontSize='sm' fontWeight='normal'>
          Paste the above code on any desired section of your website, where you
          want to show the <b>Flito Cost Estimator Widget.</b> Make sure to
          place the widget in a section that covers the full-screen width. The
          widget is responsive, however, it requires a{' '}
          <b>minimum width of 400px</b> and <b>minumum height of 500px</b>.
        </Text>
        <VStack
          spacing='1'
          fontSize='sm'
          fontWeight='normal'
          align='flex-start'
        >
          <Text fontSize='md' fontWeight='medium'>
            Helpful Links
          </Text>
          {HelpLinks.map(({ label, link }) => (
            <Link
              key={link}
              color='teal.600'
              href={link}
              isExternal
              display='flex'
              alignItems='center'
            >
              {label} <BiLinkExternal style={{ marginLeft: '5px' }} />
            </Link>
          ))}
        </VStack>
      </VStack>
    </ScreenContainer>
  )
}

export default WidgetScreen
