import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack
} from '@chakra-ui/react'
import { Player } from '@lottiefiles/react-lottie-player'
import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import WhiteWelcome from '../../../assets/anims/white-welcome.json'
import { ProfileActions } from '../../../data/actions/userActions'
import { useProfile } from '../../../data/database/users/profile'

export default ({ isOpen }) => {
  const user = useSelector(state => state.user)
  const { update } = useProfile(false)
  const dispatch = useDispatch()
  const [isUpdating, setIsUpdating] = useState('')

  async function performQuickSetup () {
    setIsUpdating('quick')
    const api = process.env.REACT_APP_API_URL
    const result = await axios.post(`${api}/static/generateSample`, {
      uid: user.userId
    })
    if (result.status == 200) {
      const updateResult = await update({
        onboard_complete: true
      })
      if (updateResult.success) {
        dispatch({
          type: ProfileActions.SET_PROFILE,
          data: {
            ...user.profile,
            onboard_complete: true
          }
        })
        setIsUpdating('')
      }
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      //   onClose={() => setIsOpen(false)}
      //   isOpen={isOpen}
      //   size={'4xl'}
      //   onCloseComplete={() => {
      //       setMicroServices([])
      //       setServiceDetails()
      //     }}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      size='full'
      motionPreset='scale'
      scrollBehavior='inside'
    >
      <ModalOverlay />
      <ModalContent
        color='white'
        bgGradient='radial(circle farthest-corner at 10px 250px, #543d63, #3b154d, #091927 300px)'
        h='full'
      >
        <ModalBody h='100%' position='relative'>
          <VStack h='full' w='full' justify='center' align='center'>
            <AnimatePresence>
              <motion.div
                key='show_welcome'
                initial={{
                  y: 0
                }}
                animate={{
                  y: -10,
                  opacity: 0,
                  transition: { delay: 4 }
                }}
              >
                <Box h='300px' w='400px' zIndex='0'>
                  <Player src={WhiteWelcome} autoplay speed={1.5} />
                </Box>
              </motion.div>
              <motion.div
                initial={{
                  opacity: 0,
                  y: 5
                }}
                animate={{ opacity: 1, y: 0, transition: { delay: 4.5 } }}
                style={{
                  zIndex: '1',
                  position: 'absolute'
                }}
              >
                <VStack justify='center' align='center' spacing='5'>
                  <Text fontSize='4xl'>Let's get started!</Text>
                  <HStack w='full' spacing='5'>
                    <Button
                      transition='all 300ms'
                      w='300px'
                      h='max-content'
                      align='flex-start'
                      spacing='0.5'
                      bg='teal.400'
                      color='teal.900'
                      borderRadius='md'
                      userSelect='none !important'
                      _hover={{
                        bg: 'teal.900',
                        color: 'white'
                      }}
                      cursor='pointer'
                      p='0'
                      onClick={performQuickSetup}
                      isLoading={isUpdating === 'quick'}
                    >
                      <VStack
                        w='full'
                        align='flex-start'
                        spacing='3.5'
                        textAlign='left'
                        p='4'
                        pl='6'
                        pr='6'
                      >
                        <Text fontSize='lg' fontWeight='medium'>
                          Quick Setup
                        </Text>
                        <Text
                          fontSize='sm'
                          fontWeight='medium'
                          whiteSpace='pre-line'
                          w='100%'
                          lineHeight='5'
                        >
                          We will set up all necessary steps for your
                          Digital/Development agency, in 15 seconds.
                        </Text>
                      </VStack>
                    </Button>
                    <Button
                      transition='all 300ms'
                      w='300px'
                      h='max-content'
                      align='flex-start'
                      spacing='0.5'
                      borderWidth='thin'
                      borderColor='teal.400'
                      bg='transparent'
                      color='white'
                      p='0'
                      borderRadius='md'
                      userSelect='none !important'
                      _hover={{
                        bg: 'white',
                        color: 'teal.400'
                      }}
                      cursor='pointer'
                    >
                      <VStack
                        w='full'
                        align='flex-start'
                        spacing='3.5'
                        textAlign='left'
                        p='4'
                        pl='6'
                        pr='6'
                      >
                        <Text fontSize='lg' fontWeight='medium'>
                          Fresh Start
                        </Text>
                        <Text
                          fontSize='sm'
                          fontWeight='medium'
                          whiteSpace='pre-line'
                          w='100%'
                          lineHeight='5'
                        >
                          Start fresh, set-up your services and features. You
                          can then just copy the code, and start using the
                          widget!
                        </Text>
                      </VStack>
                    </Button>
                  </HStack>
                </VStack>
              </motion.div>
            </AnimatePresence>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
