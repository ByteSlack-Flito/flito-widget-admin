import { TabProps } from '../Theme'
import { CustomTabs } from '../Theme/components'
import { FeatureList } from './FeatureList'

export const ServiceBuilderScreen = () => {
  return (
    <CustomTabs
      tabs={['Feature List']}
      tabProps={TabProps}
      tabContainerProps={{
        borderBottomColor: '#d885ff30'
      }}
    >
      <ServiceBuilderScreens.FeatureList />
    </CustomTabs>
  )
}

const ServiceBuilderScreens = {
  FeatureList
}
