import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import IconParser from '../../misc/iconParser'
import './index.css'
import {
  Avatar,
  Box,
  Button,
  Text,
  Tooltip
} from '@chakra-ui/react'
import { AiOutlineHome } from 'react-icons/ai'
import { SiteRoutes } from '../../misc/routes'

export const MenuItem = ({
  id,
  label,
  path,
  projectId,
  selected,
  isBeta,
  icon,
  variant = 'regular'
}) => {
  const location = useLocation()
  const navigate = useNavigate()

  function performNavigation() {
    navigate(projectId ? path.replace(':projectId', projectId) : path, {
      replace: true
    })
  }

  function performSideNavigation() {
    if (projectId)
      navigate(
        SiteRoutes.Project.Dashboard.path.replace(':projectId', projectId)
      )
    else navigate(SiteRoutes.Engine.Dashboard.path)
  }

  const Reguler = () => {
    const isSelected = location.pathname === path

    return (
      <Button
        variant={isSelected ? 'solid' : 'ghost'}
        colorScheme='gray'
        transition='all 300ms'
        onClick={() => performNavigation(path)}
        leftIcon={icon || <IconParser size={16} itemId={id} />}
        w='100%'
        justifyContent='flex-start'
        size='sm'
        fontSize='0.75rem'
        bg={isSelected ? '#3181FF20' : ''}
        _hover={{
          bg: isSelected ? '#3181FF10' : '#3181FF20'
        }}
        borderRadius='5px'
        color={isSelected ? '#3181FF' : 'gray.500'}
      >
        {label}
      </Button>
    )
  }

  const Sidebar = () => {
    function isSelected() {
      if (label && projectId)
        return location.pathname.includes(`/project/${projectId}`)
      else {
        /// Determines if HOME is selected
        return (
          location.pathname.includes('/engine/') &&
          !location.pathname.includes('/project/')
        )
      }
    }

    return (
      <Tooltip label={label || 'Home'} hasArrow placement='right'>
        <Box
          transition='all 300ms'
          onClick={() => performSideNavigation(path)}
          w='100%'
          bg={isSelected() ? '#3181FF20' : ''}
          borderWidth={'thin'}
          borderColor={isSelected() ? '#3181FF' : 'transparent'}
          color={isSelected() ? '#3181FF' : '#000'}
          shadow={isSelected() ? 'sm' : 'none'}
          borderRadius='md'
          _hover={{
            bg: '#3181FF20'
          }}
          cursor='pointer'
          p='2'
          pt='3'
          pb='3'
          justifyContent='center'
          alignItems='center'
          textAlign='center'
          display='flex'
        >
          {label && projectId ? (
            <Avatar size='xs' borderRadius='sm' name={label} />
          ) : (
            <AiOutlineHome
              size={18}
              style={{
                display: 'flex'
              }}
            />
          )}
        </Box>
      </Tooltip>
    )
  }

  return variant === 'regular' ? <Reguler /> : <Sidebar />
}

export const Menu = ({ data, onItemClick = ({ item = '' }) => { } }) => {
  const location = useLocation()
  function getProjectBasedURL(path) {
    const idFromURL = location.pathname
      .split('/project/')
      .pop()
      .split('/')[0]
    if (idFromURL) return path.replace(':projectId', idFromURL)
    return path
  }

  const Menu_Sidebar = () => {
    return (
      <div>
        <MenuItem variant='sidebar' />
      </div>
    )
  }
  const Menu_Parent = () => (
    <div style={{ position: 'relative' }}>
      {data?.map(menuItem => {
        if (!menuItem.screens && !menuItem.ignoreRendering) {
          return (
            <MenuItem
              key={menuItem.path}
              {...menuItem}
              path={getProjectBasedURL(menuItem.path)}
            />
          )
        } else {
          return (
            <div key={menuItem.id}>
              {!menuItem.ignoreRendering && (
                <Text
                  mt='2'
                  mb='1'
                  pl='2.5'
                  fontSize='x-small'
                  align='left'
                  fontWeight='semibold'
                  color='gray.500'
                >
                  {menuItem.label}
                </Text>
              )}
              {menuItem.screens &&
                menuItem.screens.map(subMenu => {
                  return (
                    !subMenu.ignoreRendering && (
                      <MenuItem
                        key={subMenu.path}
                        {...subMenu}
                        path={getProjectBasedURL(subMenu.path)}
                      />
                    )
                  )
                })}
            </div>
          )
        }
      })}
    </div>
  )

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        width: '100%'
      }}
    >
      <Box w='20%'>
        <Menu_Sidebar />
      </Box>
      <Box
        w='80%'
        pl='1'
        ml='1'
        borderLeftWidth='thin'
        borderLeftColor='gray.200'
      >
        <Menu_Parent />
      </Box>
    </div>
  )
}
