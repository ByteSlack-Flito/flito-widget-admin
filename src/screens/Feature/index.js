import React, { useState, useEffect } from 'react'
import { filterData } from '../../misc/logics'
import { extractFeatures } from '../../misc/featureHelper'
import { Constants } from '../../data/constants'
import { useDispatch, useSelector } from 'react-redux'
import { ProjectActions } from '../../data/actions/userActions'
import { useNavigate } from 'react-router-dom'
import { SiteRoutes } from '../../misc/routes'
import './index.css'
import {
  Button,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Text,
  VStack,
  Spacer,
  InputLeftElement,
  InputGroup,
  IconButton,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody
} from '@chakra-ui/react'
import { FaPlus, FaSearch } from 'react-icons/fa'
import { GiHamburgerMenu } from 'react-icons/gi'
import { MdEdit } from 'react-icons/md'

const FeatureScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [featureList, setFeatureList] = useState()
  const [initFeatureList, setInitFeatureList] = useState()
  const [parentFeatureList, setParentFeatureList] = useState([])
  const currentProject = useSelector(state => state.user.profile.projects[0])
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)

  useEffect(() => {
    const features = extractFeatures()
    setParentFeatureList(features.parentFeatures)
    setFeatureList(features.subFeatures)
    setInitFeatureList(features.subFeatures)
  }, [])

  function performFilter (val) {
    console.log('Called with:', val)
    const filteredFeatures = filterData(featureList, val)
    setFeatureList(
      filteredFeatures.length > 0 ? filteredFeatures : initFeatureList
    )
  }

  function performParentFilter (categoryIds = []) {
    let filteredFeatures =
      categoryIds?.length > 0
        ? initFeatureList.filter(x => categoryIds.includes(x.parent.id))
        : initFeatureList
    setFeatureList(filteredFeatures)
  }

  function performPhaseFilter (phase) {
    let filteredFeatures = phase
      ? initFeatureList.filter(x => isFeatureInPhase(x.id, phase))
      : initFeatureList
    setFeatureList(filteredFeatures)
  }

  const isFeatureInPhase = (featureId, phase) => {
    return currentProject.buildPhases[phase.toLowerCase()].features?.some(
      id => id == featureId
    )
  }

  function updateFeature (featureId, phase, rowIndex) {
    const data = {
      action: isFeatureInPhase(featureId, phase) ? 'remove' : 'add',
      assignPhase: phase,
      featureId
    }

    dispatch({
      type: ProjectActions.PERFORM_FEATURE_CHANGE,
      data
    })
  }

  function navigateToMarketplace (featureId) {
    navigate(SiteRoutes.Engine.Resources.Screens().Marketplace.path, {
      state: { featureId }
    })
  }
  function clear () {}

  function getDevelopmentTime (devTimeArray) {
    const maxDevTime = Math.max(...devTimeArray.map(single => single.hours))
    return maxDevTime
  }

  return (
    <VStack align='flex-start' pt='3'>
      <Text fontSize='lg' fontWeight='normal'>
        Features
      </Text>
      <Text fontSize='sm' fontWeight='normal'>
        List of 100+ indusrty standard features, pre-included in Flito. Plus,
        all features you added. You have full control over each and every
        feature.
      </Text>
      <HStack spacing='2' w='100%' justify='left'>
        {/* <Input
          placeholder='Search features...'
          left={<FaSearch />}
          onChange={val => performFilter(val)}
          minW='100px'
        /> */}
        <InputGroup w='auto'>
          <InputLeftElement
            maxH='100%'
            pointerEvents='none'
            children={<FaSearch size='14' />}
          />
          <Input
            size='sm'
            placeholder='Search Features'
            fontSize='sm'
            maxW='250px'
            onChange={event => performFilter(event.target.value)}
          />
        </InputGroup>
        <Menu closeOnSelect={false}>
          <MenuButton
            as={IconButton}
            icon={<GiHamburgerMenu />}
            colorScheme='gray'
            size='sm'
            title='Quick Filter'
          />
          <MenuList
            minWidth='240px'
            maxH='300px'
            textAlign='left'
            overflow='scroll'
            zIndex='100'
          >
            {/* <MenuOptionGroup fontSize='smaller' title='Quick Filter' /> */}
            <HStack w='100%' pl='3' pr='2' justify='space-between'>
              <Text fontSize='smaller'>Quick Filter</Text>
              <Button
                colorScheme='gray'
                variant='solid'
                size='xs'
                onClick={clear}
              >
                Clear
              </Button>
            </HStack>
            <MenuDivider />
            <MenuOptionGroup
              onChange={performParentFilter}
              fontSize='x-small'
              title='Category'
              type='checkbox'
            >
              {parentFeatureList.map((feature, index) => {
                return (
                  <MenuItemOption key={index} value={feature.id}>
                    <Text fontSize='smaller'>{feature.title}</Text>
                  </MenuItemOption>
                )
              })}
            </MenuOptionGroup>
          </MenuList>
        </Menu>
        <Button
          size='sm'
          variant='solid'
          colorScheme='gray'
          rightIcon={<FaPlus size={12} />}
        >
          <Text fontSize='smaller'> Add Feature</Text>
        </Button>
      </HStack>
      {/* <PopupAlert
        title='Delete Feature?'
        description={
          'Are you sure you want to delete this feature? This action cannot be reversed'
        }
        isOpen={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
      /> */}
      <TableContainer w='100%' overflowY='scroll !important' maxH='500px'>
        <Table size='sm'>
          <Thead bg='gray.100'>
            <Tr>
              <Th>Feature - ({featureList?.length} Results)</Th>
              <Th>Available On</Th>
              <Th isNumeric>Est. Development Time(hrs)</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody fontWeight='normal'>
            {featureList?.map((feature, index) => (
              <Tr
                key={index}
                _hover={{
                  bg: 'gray.100'
                }}
              >
                <Td>
                  <VStack
                    align='flex-start'
                    flexWrap='wrap'
                    spacing='0'
                    justify='flex-start'
                    whiteSpace='pre-line'
                    overflowWrap='break-word'
                  >
                    <Text
                      color='blue.500'
                      fontWeight='semibold'
                      fontSize='smaller'
                    >
                      {feature.parent.title}
                    </Text>
                    <Text fontSize='smaller' fontWeight='medium'>
                      {feature.title}
                    </Text>
                    <Text fontSize='smaller'>{feature.description}</Text>
                  </VStack>
                </Td>
                <Td>
                  <Text whiteSpace='pre-line' overflowWrap='break-word'>
                    {Constants.PlatformTypes.map((platform, index) => {
                      return (
                        <Badge
                          key={index}
                          variant='outline'
                          colorScheme='purple'
                          mr='2'
                        >
                          {platform.title}
                        </Badge>
                      )
                    })}
                  </Text>
                </Td>
                <Td>
                  <Text
                    fontSize='medium'
                    fontWeight='medium'
                    align='right'
                    pr='3'
                  >
                    {getDevelopmentTime(feature.estDevTime)}
                  </Text>
                </Td>
                <Td>
                  <HStack>
                    <Button
                      colorScheme='gray'
                      bg='gray.300'
                      variant='solid'
                      size='xs'
                      leftIcon={<MdEdit />}
                    >
                      Edit
                    </Button>
                    <Popover isLazy>
                      <PopoverTrigger>
                        <Button
                          onClick={() => setShowDeleteAlert(true)}
                          colorScheme='red'
                          bg='red.300'
                          variant='solid'
                          size='xs'
                        >
                          Delete
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>Remove Feature?</PopoverHeader>
                        <PopoverBody
                          whiteSpace='pre-line'
                          overflowWrap='break-word'
                        >
                          <Text fontSize='smaller'>
                            Are you sure you want to remove this feature? This
                            basically means that you don't offer developing this
                            feature anymore.
                          </Text>
                          <HStack mt='2'>
                            <Button variant='solid' colorScheme='red' size='xs'>
                              Yes, Delete
                            </Button>
                          </HStack>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      {/* <div
        className='container row'
        style={{
          paddingLeft: 0
        }}
      >
        <div className='col col-sm-3'></div>
        <div
          className='col col-sm-3'
          style={{
            paddingLeft: 0
          }}
        >
          <DropDown
            options={parentFeatureList}
            isExtraSmall
            onValueChange={performParentFilter}
          />
        </div>
        <div
          className='col col-sm-2'
          style={{
            paddingLeft: 0
          }}
        >
          <DropDown
            options={Constants.BuildPhases.map((phase, index) => {
              return {
                id: phase,
                title: phase
              }
            })}
            isExtraSmall
            onValueChange={performPhaseFilter}
          />
        </div>
      </div> */}
      <Spacer size='medium' />
      {/* <div className='table_container shadow_light'>
        <table>
          <thead className='shadow_light'>
            <tr>
              <th className='font_link'>{featureList?.length} Feature</th>
              <th>Description</th>
              <th style={{ textAlign: 'center' }}>In MVP</th>
              <th style={{ textAlign: 'center' }}>In V1</th>
              <th>Code Marketplace</th>
            </tr>
          </thead>
          <tbody>
            {featureList?.map((feature, index) => {
              return (
                <tr className={`table_row`} key={index}>
                  <td>
                    <div>
                      <SubTitle
                        className='font_link font_xs no_margin'
                        fontType='bold'
                        content={feature.parent.title}
                        link='#'
                      />
                      <SubTitle
                        className='margin_xs'
                        fontType='bold'
                        content={feature.title}
                      />
                      <SubTitle
                        className='margin_xs font_xs'
                        content='Available on:'
                      />
                      <div className='container row'>
                        {Constants.PlatformTypes.map((platform, index) => {
                          return (
                            <SubTitle
                              className='card_option_bg card_option_bg_small shadow_light margin_right'
                              fontType='bold'
                              content={platform.title}
                              key={index}
                            />
                          )
                        })}
                      </div>
                    </div>
                  </td>
                  <td
                    style={{
                      maxWidth: '220px'
                    }}
                  >
                    <SubTitle
                      content={feature.description}
                      className='margin_xs'
                    />
                    <div className='d-flex'>
                      <SubTitle
                        content='Est. development time:'
                        fontType='bold'
                        size='small'
                        className={'no_margin'}
                      />
                      <Spacer size='xs' />
                      <SubTitle
                        content={`${getDevelopmentTime(
                          feature.estDevTime
                        )} hour(s)`}
                        fontType='bold'
                        className='font_link no_margin'
                      />
                    </div>
                  </td>
                  <td>
                    <AssignButton
                      assigned={isFeatureInPhase(
                        feature.id,
                        Constants.BuildPhase.MVP
                      )}
                      onClick={() =>
                        updateFeature(
                          feature.id,
                          Constants.BuildPhase.MVP,
                          index
                        )
                      }
                    />
                  </td>
                  <td>
                    <AssignButton
                      assigned={isFeatureInPhase(
                        feature.id,
                        Constants.BuildPhase.V1
                      )}
                      onClick={() =>
                        updateFeature(feature.id, Constants.BuildPhase.V1)
                      }
                    />
                  </td>
                  <td>
                    <div
                      style={{
                        maxWidth: '220px'
                      }}
                    >
                      <SubTitle
                        content={`${getRandomInteger(2, 20) -
                          1}+ Snippets Available`}
                        fontType='bold'
                        className='font_xs margin_xs'
                        style={{
                          maxWidth: 'max-content'
                        }}
                        // onLinkClick={}
                      />
                      <Button
                        label='Browse Marketplace'
                        theme='dark'
                        animateScale
                        hasShadow
                        isExtraSmall
                        canBeBusy
                        className='small_button'
                        onClick={() => navigateToMarketplace(feature.id)}
                      />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div> */}
    </VStack>
  )
}

export default FeatureScreen
