import { devTeam } from '../../data/constants'
import {
  VStack,
  Box,
  Text
} from '@chakra-ui/react'
import { groupBy } from '../../misc/featureHelper'

const HourlyPricing = () => {
  const rolesGroup = groupBy(devTeam, 'role')
  const AverageSalary = []
  for (const key in rolesGroup) {
    const Salary = (rolesGroup[key]).reduce((acc, cval) => {
      return acc + cval.salary.rate

    }, 0)
    AverageSalary.push({
      role: key,
      avgRate: Salary / rolesGroup[key].length,
      type: rolesGroup[key][0].salary.type
    }
    )
  }

  return (
    <Box
      w='100%'
      h='100%'
      color='gray.600'
      justifyContent='space-between'
    >


      <VStack alignItems={'flex-start'}>
        <Text>Hourly Pricing will now be used to create estimated quotations.Based on your team set-up in My Teams,
          we have calculated the below average rates:</Text>
        {
          AverageSalary.map((item, index) => (
            <Text key={index}>Avg. Rate For {item.role}:  ${item.avgRate}</Text>
          ))
        }

      </VStack>
    </Box >
  )
}

export default HourlyPricing