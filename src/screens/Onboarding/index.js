import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import LoginScreen from './screens/login'
import SignUpScreen from './screens/signUp'
import { useSelector } from 'react-redux'
import {
  Box,
  Text,
  SimpleGrid,
  VStack,
  Heading,
  HStack,
  Link,
  List,
  ListItem,
  ListIcon,
  Image as ChakraImage,
  Spinner
} from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { BsCheckSquareFill } from 'react-icons/bs'
import { Player } from '@lottiefiles/react-lottie-player'
import OnboardAnim from '../../assets/anims/onboard-anim.json'
import { SiteStyles } from '../../components/global'
import { StorageHelper } from '../../data/storage'

const DID_YOU_KNOW = [
  "With Flito's Cost Estimator widget, you can attract more traffic to your site.",
  'You can get more potential leads.',
  "Flito will launch with it's full-fledged Project Management system soon.",
  'You can manage your clients, projects, teams, invoices, billings and much more with Flito.'
]

export default ({}) => {
  const sidebarRef = useRef()

  const [formType, setFormType] = useState('signUp')

  useEffect(() => {
    // sidebarRef.current && loadSidebarImage()
    const hasToken = StorageHelper.GetItem('auth')
    hasToken && setFormType('signIn')
  }, [])

  function handleFormChange () {
    setFormType(prev => (prev === 'signIn' ? 'signUp' : 'signIn'))
  }

  const formHeaders = () => {
    const headerTypes = {
      signIn: {
        title: 'Sign in to Flito',
        subTitle: 'New to Flito?',
        link: 'Get Started'
      },
      signUp: {
        title: 'Sign up to Flito',
        subTitle: 'Already have an account?',
        link: 'Log In'
      }
    }
    return headerTypes[formType]
  }

  return (
    <SimpleGrid
      columns={2}
      w='full'
      h='full'
      bgGradient='radial(circle farthest-corner at 90% 90%, #543d63, #3b154d, #091927 300px)'
      color='white'
    >
      <VStack
        align='center'
        // justify='center'
        pt='20%'
        boxShadow=' 17px 10px 35px 0px rgba(0,0,0,0.10)'
        zIndex='99'
      >
        <VStack w='full' maxW='400px' align='flex-start'>
          <Heading display='flex'>{formHeaders().title}</Heading>
          <HStack fontWeight='medium'>
            <Text>{formHeaders().subTitle}</Text>
            <Link onClick={handleFormChange} {...SiteStyles.LinkStyles}>
              {formHeaders().link}
            </Link>
          </HStack>
          <Box h='5' />
          <AnimatePresence mode='wait'>
            <motion.div
              key={formType}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              style={{
                width: '100%'
              }}
            >
              {formType === 'signUp' ? <SignUpScreen /> : <LoginScreen />}
            </motion.div>
          </AnimatePresence>
        </VStack>
      </VStack>
      <VStack
        ref={sidebarRef}
        bgSize='cover'
        position='relative'
        justify='center'
        align='center'
      >
        <Player src={OnboardAnim} loop autoplay />
      </VStack>
    </SimpleGrid>
  )
}

export const InputStyles = {
  bg: '#0f283d',
  border: 'none'
}
