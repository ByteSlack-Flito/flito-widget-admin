import {
  Box,
  Button,
  Code,
  Link,
  Spinner,
  Text,
  useStatStyles,
  VStack
} from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'
import ReactDOMServer from 'react-dom/server'
import { Link as ReactRouterLink } from 'react-router-dom'
import { BiCheck, BiLinkExternal } from 'react-icons/bi'
import { useSelector } from 'react-redux'
import { ScreenContainer, SiteStyles } from '../../components/global'
import { Constants } from '../../data/constants'
import { useProfile, useWidget } from '../../data/database/users/profile'
import { SiteRoutes } from '../../misc/routes'
import { InfoBox } from '../PricingStrategy/components'
import axios from 'axios'

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
  const [isFetching, setIsFetching] = useState(true)
  const [isValid, setIsValid] = useState(true)
  const [copied, setCopied] = useState(false)
  const user = useSelector(state => state?.user)

  const copyCode = useCallback(() => {
    !copied &&
      navigator.clipboard
        .writeText(Constants.WidgetCode.replace('{widgetCode}', user?.userId))
        .then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        })
  }, [])

  const validation_erros = (
    <>
      {' '}
      Please go to{' '}
      <Link
        as={ReactRouterLink}
        to={SiteRoutes.Engine.Setup.Screens().MyServices.path}
        pl='1'
        pr='1'
        color='blue.500'
      >
        My Services
      </Link>
      and{' '}
      <Link
        as={ReactRouterLink}
        to={SiteRoutes.Engine.Setup.Screens().ServiceBuilder.path}
        pl='1'
        pr='1'
        color='blue.500'
      >
        Service Bundles
      </Link>{' '}
      to complete the setup.
    </>
  )

  useEffect(() => {
    checkDataValidity()
  }, [])

  async function checkDataValidity () {
    const api = process.env.REACT_APP_API_URL
    try {
      const result = await axios.get(
        `${api}/static/getDataValidity?uid=${user?.userId}`
      )
      setIsValid(result.status == 200)
    } catch (ex) {
      setIsValid(false)
    }
    setIsFetching(false)
  }

  return (
    <ScreenContainer
      title='Your Flito Widget'
      description="Grab your Flito Widget's code to integrate into your website or web applications."
    >
      {isFetching ? (
        <Spinner size='md' color='blue.400' />
      ) : (
        <>
          {!isValid ? (
            <VStack spacing='3' align='flex-start' w='full'>
              <InfoBox
                type='error'
                title={`Please complete other steps.`}
                description={validation_erros}
              />
            </VStack>
          ) : (
            <VStack spacing='3' align='flex-start' w='95%'>
              <Box w='full' overflowX='scroll' borderRadius='md' pos='relative'>
                <Button
                  size='xs'
                  position='absolute'
                  top='3'
                  left='3'
                  leftIcon={copied && <BiCheck color='white' />}
                  // colorScheme={copied ? 'gray' : 'teal'}
                  onClick={copyCode}
                  {...SiteStyles.ButtonStyles}
                >
                  {copied ? 'COPIED TO CLIPBOARD' : 'COPY'}
                </Button>
                <Code
                  p='3'
                  pt='12'
                  color='white'
                  // fontWeight='medium'
                  whiteSpace='pre'
                  display='block'
                  children={Constants.WidgetCode.replace(
                    '{widgetCode}',
                    user?.userId
                  )}
                  bg='#0f283d'
                />
              </Box>
              <Text fontSize='md' fontWeight='normal'>
                Paste the above code on any desired section of your website,
                where you want to show the <b>Flito Cost Estimator Widget.</b>{' '}
                Make sure to place the widget in a section that covers the
                full-screen width. The widget is responsive, however, it
                requires a <b>minimum width of 400px</b> and{' '}
                <b>minumum height of 500px</b>.
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
          )}
        </>
      )}
    </ScreenContainer>
  )
}

export default WidgetScreen
