import { faker } from '@faker-js/faker/locale/en'
import { extractFeatures } from '../misc/featureHelper'
import { getRandomInteger } from '../misc/logics'
import { Constants } from './constants'

function userModel () {
  const firstName = faker.name.firstName(1)
  const lastName = faker.name.lastName(1)
  return {
    id: faker.datatype.uuid(),
    firstName,
    lastName,
    userName: faker.internet.userName(firstName, lastName),
    photoUrl: 'https://i.pravatar.cc/300?v=' + getRandomInteger(20, 100000),
    fullName: `${firstName} ${lastName}`,
    email: faker.internet.email(firstName, lastName).toLowerCase(),
    lastLoggedIn: faker.date.past(),
    activeStatus: faker.helpers.arrayElement(Constants.ActivityStatus),
    description: faker.lorem.sentences(4)
  }
}

export default {
  generate: (count = 0, data) => {
    const single = () => {
      let fakeData = { ...data }
      Object.keys(data).map(prop => {
        const lower = prop.toLowerCase()
        if (lower.includes('name')) fakeData[prop] = faker.name.fullName()
        else if (lower.includes('id')) fakeData[prop] = faker.datatype.uuid()
        else if (lower.includes('count'))
          fakeData[prop] = faker.datatype.number({ min: 0, max: 10 })
        else if (Array.isArray(prop))
          fakeData[prop] = data[prop]
        else fakeData[prop] = faker.lorem.words(10)
      })
      return fakeData
    }
    return resultGenerator(single, count)
  },
  combine: (objects = [], count = 0) => {
    let returnableData = []
    objects.map(each => {
      returnableData.push(...resultGenerator(each, count))
    })
    return returnableData
  },
  user: (count = 0) => {
    const single = () => {
      return userModel()
    }
    return resultGenerator(single, count)
  },
  teamMember: (count = 0) => {
    const single = () => {
      return {
        ...userModel(),
        role: faker.helpers.arrayElement(Constants.TeamMemberTypes)
      }
    }
    return resultGenerator(single, count)
  },
  codeSnippet: (count = 0) => {
    const single = () => {
      return {
        id: faker.datatype.uuid(),
        title: faker.lorem.sentence(getRandomInteger(4, 8)),
        description: faker.lorem.sentences(8),
        setupSteps: resultGenerator(() => {
          return {
            title: `${faker.helpers.arrayElement([
              'Environment',
              'Assets',
              'Merging',
              'Finalize'
            ])} Setup`,
            content: faker.lorem.sentences(16)
          }
        }, getRandomInteger(2, 6)),
        files: resultGenerator(() => {
          return {
            title: faker.system.commonFileName(),
            downloadUrl: faker.internet.url()
          }
        }, getRandomInteger(2, 6)),
        tags: faker.helpers.arrayElements(
          [
            'JavaScript',
            'React',
            'React Native',
            'Redux',
            'Firebase',
            'Angular',
            'Java',
            'Node',
            'dotNet',
            'Python',
            'AI/ML'
          ],
          4
        ),
        parentCategory: faker.helpers.arrayElement(
          extractFeatures().parentFeatures
        ),
        childCategory: faker.helpers.arrayElement(
          extractFeatures().subFeatures
        ),
        platforms: faker.helpers.arrayElements(Constants.PlatformTypes, 2),
        techStack: faker.helpers.arrayElements(
          [
            'JavaScript',
            'React Native',
            'TypeScript',
            'C#',
            'Java',
            'SQL',
            'Python',
            'Ruby',
            'Swift'
          ],
          getRandomInteger(3, 5)
        ),
        owner: { ...userModel() },
        reviews: {
          avgRating: faker.helpers.arrayElement([4.5, 4, 5, 3.5]),
          totalReviewCount: getRandomInteger(10, 200)
        },
        exampleImages: resultGenerator(() => {
          return 'https://picsum.photos/200/300?' + getRandomInteger(20, 100000)
        }, getRandomInteger(2, 6))
      }
    }
    return resultGenerator(single, count)
  }
}

function resultGenerator (data, count) {
  return count <= 0 ? data() : new Array(count).fill(null).map(data)
}
