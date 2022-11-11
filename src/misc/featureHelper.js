import FeatureList from '../assets/jsons/masterStep.json'

export function extractFeatures () {
  const parentFeatures = FeatureList[2].options
  let subFeatures = []

  parentFeatures.map(parent => {
    parent.options?.map(sub => {
      const subFeature = { ...sub }
      subFeature.parent = { ...parent }
      delete subFeature.parent.options
      subFeatures.push(subFeature)
    })
  })
  return {
    parentFeatures,
    subFeatures
  }
}

export function extractFeature (featureId = []) {
  const features = extractFeatures().subFeatures
  if (Array.isArray(featureId)) {
    return features.filter(x => featureId.some(id => id == x.id))
  } else {
    return features.find(x => x.id == featureId)
  }
}

export function extractFeaturesAsIs () {
  return FeatureList[2].options
}

export function getSuggestedTeam (features) {
  // features.map(x => {
  //   !Array.isArray(x.estDevTime) && console.log('ID is:', x.id)
  // })
  // return;
  const estimationData = []
  features.map(feature => {
    feature.estDevTime.map(est => estimationData.push(est))
  })

  const roleGroup = groupBy(estimationData, 'role')

  // console.log('Role Group:', roleGroup)

  const roleHours = []
  Object.keys(roleGroup).map(key => {
    const hours = roleGroup[key]?.reduce((a, b) => {
      return a + b.hours
    }, 0)

    roleHours.push({
      type: key,
      totalHours: hours
    })
  })
  // console.log('Hours per role:', roleHours)
  const maxDevTime = Math.max(...roleHours.map(single => single.totalHours))

  const developers = []
  roleHours.map(single => {
    const devCount =
      single.totalHours >= 40 ? Math.ceil(single.totalHours / 40) : 1
    developers.push({
      role: single.type,
      devCount,
      hours: single.totalHours
    })
  })

  // console.log('Developers required:', developers)
  const finalResult = {
    devTime: maxDevTime,
    team: developers
  }

  return finalResult;
}

function groupBy (arr, key) {
  const initialValue = {}
  return arr.reduce((acc, cval) => {
    const myAttribute = cval[key]
    acc[myAttribute] = [...(acc[myAttribute] || []), cval]
    return acc
  }, initialValue)
}
