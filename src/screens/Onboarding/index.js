import { Player } from '@lottiefiles/react-lottie-player'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import LoginScreen from './screens/login'
import SignUpScreen from './screens/signUp'
import Logo from '../../logo-trans.png'
import { useSelector } from 'react-redux'
import { getDatabase, get, child, ref } from 'firebase/database'
import {
  Box,
  Grid,
  GridItem,
  Image,
  Input,
  Spacer,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  Tabs,
  Button,
  InputGroup
} from '@chakra-ui/react'

export default ({ }) => {
  const [stepType, setStepType] = useState('signUp')
  const [projectMeta, setProjectMeta] = useState()
  const firebaseApp = useSelector(state => state.firebaseApp.instance)
  const params = useParams()
  useEffect(() => {
    if (params.projectId) {
      const database = getDatabase(firebaseApp)
      get(child(ref(database), `projectMeta/${params.projectId}`)).then(
        result => {
          if (result.exists()) {
            const data = result.val()
            setProjectMeta(data)
          }
        }
      )
    }
  }, [])

  return (
    // <div className='main onboarding_main'>
    //   <div className='container_main shadow_dark'>
    //     <div className='row'>
    //       <div className='col col-lg-6'>
    //         <Player className='anim_wrapper' src={LoginAnim} loop autoplay />
    //         <img
    //           src={Logo}
    //           className='site_logo_main site_logo'
    //           alt='site-logo'
    //         />
    //       </div>
    //       <Spacer />
    //       <div className='col col-lg-5 d-flex form_container'>
    //         {stepType === 'signIn' ? (
    //           <LoginScreen onSwitchRequest={() => setStepType('signUp')} />
    //         ) : (
    //           <SignUpScreen
    //             projectMetaData={projectMeta}
    //             onSwitchRequest={() => setStepType('signIn')}
    //           />
    //         )}
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <Grid
      templateColumns='repeat(8, 1fr)'
      templateRows='repeat(4, 1fr)'
      height='100%'
      // bgGradient='linear(to-tr, #261dfd, #cd7ffc, #fcd045)'
      bg='#2f6cff14'
    >
      <GridItem
        rowStart={2}
        rowEnd={4}
        colStart={4}
        colEnd={6}
        p='0'
        minH='400'
      >
        <Box
          h='100%'
          w='100%'
          boxShadow='lg'
          borderWidth='thin'
          borderColor='gray.100'
          borderRadius='md'
          bg='white'
          p='4'
          pt='2'
          justifyContent='center'
        >
          <Grid templateColumns='repeat(3, 1fr)'>
            <GridItem colStart={2} p='0'>
              <Image
                boxSize='60px'
                objectFit='contain'
                src={Logo}
                alt='Flito Logo'
                ml='4'
              />
            </GridItem>
          </Grid>

          <Spacer height='2' />
          <Tabs isFitted>
            <TabList mb='1em'>
              <Tab
                _selected={{
                  borderColor: '#6565fe',
                  color: '#6565fe',
                  fontWeight: 'semibold'
                }}
                color='#4a65ff34'
                transition='all 300ms'
              >
                Sign In
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel p='0'>
                <LoginScreen />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </GridItem>
    </Grid>
  )
}
