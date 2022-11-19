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
import flitoIcon from '../../assets/static/flito-bird.png'

const DID_YOU_KNOW = [
  "With Flito's Cost Estimator widget, you can attract more traffic to your site.",
  'You can get more potential leads.',
  "Flito will launch with it's full-fledged Project Management system soon.",
  'You can manage your clients, projects, teams, invoices, billings and much more with Flito.'
]

export default ({}) => {
  const sidebarRef = useRef()

  const [formType, setFormType] = useState('signUp')
  const [sidebarLoaded, setSidebarLoaded] = useState(false)

  function loadSidebarImage () {
    var src =
      'https://firebasestorage.googleapis.com/v0/b/makemyapp-7aca9.appspot.com/o/flito-static%2Fflito-onboard-sidebar.jpg?alt=media&token=f57bf7d2-4998-4c99-814b-97c0438d444f'
    var image = new Image()
    image.addEventListener('load', function () {
      sidebarRef.current.style.backgroundImage = 'url(' + src + ')'
      setSidebarLoaded(true)
    })
    image.src = src
  }

  useEffect(() => {
    sidebarRef.current && loadSidebarImage()
  }, [sidebarRef.current])

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
    <SimpleGrid columns={2} w='full' h='full'>
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
            <Link color='blue' fontWeight='semibold' onClick={handleFormChange}>
              {formHeaders().link}
            </Link>
          </HStack>
          <Box h='5' />
          <AnimatePresence mode='wait'>
            {formType === 'signUp' && <SignUpScreen />}
            {formType === 'signIn' && <LoginScreen />}
          </AnimatePresence>
        </VStack>
      </VStack>
      <VStack ref={sidebarRef} bgSize='cover' position='relative'>
        <AnimatePresence key='loader' mode='wait'>
          {!sidebarLoaded && <motion.div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%'
            }}
            exit={{ opacity: 0, y: -30, transition: { delay: 1.2 } }}
          >
            <Spinner size='lg' />
          </motion.div>}
        </AnimatePresence>
        <AnimatePresence key='sidebar' mode='wait'>
          {sidebarLoaded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 1 } }}
              style={{
                width: '100%',
                height: '100%'
              }}
            >
              <VStack
                w='full'
                h='full'
                transition='all 300ms'
                bgGradient='linear(to-b, transparent, blackAlpha.800)'
                color='white'
                align='flex-start'
                justify='flex-end'
                p='10'
              >
                {sidebarLoaded && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: 1.5 } }}
                  >
                    <VStack align='flex-start'>
                      <Heading>Did you know ?</Heading>
                      <List spacing={2} textAlign='left'>
                        {DID_YOU_KNOW.map(item => (
                          <ListItem>
                            <ListIcon as={BsCheckSquareFill} />
                            {item}
                          </ListItem>
                        ))}
                      </List>
                    </VStack>
                  </motion.div>
                )}
              </VStack>
            </motion.div>
          )}
        </AnimatePresence>
      </VStack>
    </SimpleGrid>
  )
}
