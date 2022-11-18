import { devTeam } from '../../data/constants'
import { VStack, Box, Text, Link, HStack, SimpleGrid } from '@chakra-ui/react'
import { groupBy } from '../../misc/featureHelper'
import { RoleBox } from './components'
import { SiteRoutes } from '../../misc/routes'
import { Link as ReactRouterLink } from 'react-router-dom'
import { BiCheckCircle } from 'react-icons/bi'

const HourlyPricing = ({ currency }) => {
  const rolesGroup = groupBy(devTeam, 'role')
  const AverageSalary = []
  for (const key in rolesGroup) {
    const Salary = rolesGroup[key].reduce((acc, cval) => {
      return acc + cval.salary.rate
    }, 0)
    AverageSalary.push({
      role: key,
      avgRate: Math.floor(Salary / rolesGroup[key].length),
      type: rolesGroup[key][0].salary.type,
      roleCount: rolesGroup[key].length
    })
  }

  return (
    <HStack
      w='100%'
      color='gray.600'
      // justifyContent='space-between'
      columnGap='3'
      rowGap='4'
      wrap='wrap'
      // minChildWidth='200px'
    >
      {AverageSalary.map(({ role, avgRate, roleCount }, index) => (
        <RoleBox currency={currency} role={role} rate={avgRate} index={index} roleCount={roleCount} />
      ))}
    </HStack>
  )
}

export default HourlyPricing
