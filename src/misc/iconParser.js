import React from 'react'
import { BsCodeSlash, BsQuestion } from 'react-icons/bs'
import {
  AiFillAndroid,
  AiOutlineDesktop,
  AiOutlineCloudServer
} from 'react-icons/ai'
import { SiIos } from 'react-icons/si'
import { CgWebsite } from 'react-icons/cg'
import {
  MdSpaceDashboard,
  MdOutlineFeaturedPlayList,
  MdFeaturedPlayList
} from 'react-icons/md'
import { TbListDetails } from 'react-icons/tb'
import {
  FcBusinessman,
  FcConferenceCall,
  FcMoneyTransfer,
  FcNews,
  FcTimeline,
  FcTodoList
} from 'react-icons/fc'
import { RiTeamLine } from 'react-icons/ri'
import { BiCodeAlt } from 'react-icons/bi'
import { FaHandshake, FaReact } from 'react-icons/fa'
import { VscDebugAlt } from 'react-icons/vsc'
import { FiGitBranch, FiShoppingCart } from 'react-icons/fi'
import { IoIosGlobe } from 'react-icons/io'
import { HiOutlineDesktopComputer, HiOutlineDeviceMobile } from 'react-icons/hi'

const IconParser = ({ itemId, size }) => {
  let icon = <BsQuestion fontSize={size || 20} />
  // console.log(itemId)
  switch (itemId) {
    //#region Route/Menu Icons
    case 121:
      icon = <MdSpaceDashboard fontSize={size || 20} />
      break
    case 1221:
      icon = <MdOutlineFeaturedPlayList fontSize={size || 20} />
      break
    case 1222:
      icon = <MdFeaturedPlayList fontSize={size || 20} />
      break
    case 1231:
      icon = <TbListDetails fontSize={size || 20} />
      break
    case 1232:
      icon = <AiOutlineCloudServer fontSize={size || 20} />
      break
    case 1233:
      icon = <BiCodeAlt fontSize={size || 20} />
      break
    case 1241:
      icon = <RiTeamLine fontSize={size || 20} />
      break
    case 1242:
      icon = <FiShoppingCart fontSize={size || 20} />
      break
    case 1251:
      icon = <FaHandshake fontSize={size || 20} />
      break
    //#endregion

    //#region Platform Icons
    case 12101:
      icon = <IoIosGlobe fontSize={size || 20} />
      break
    case 12102:
      icon = <HiOutlineDeviceMobile fontSize={size || 20} />
      break
    case 12103:
      icon = <HiOutlineDesktopComputer fontSize={size || 20} />
      break
    //#endregion

    case 2121:
      icon = <FcBusinessman fontSize={size || 20} />
      break
    case 1210:
      icon = <CgWebsite fontSize={size || 20} />
      break
    case 1211:
      icon = <SiIos fontSize={size || 20} />
      break
    case 1212:
      icon = <AiOutlineDesktop fontSize={size || 20} />
      break
    case 1511:
      icon = <AiFillAndroid fontSize={size || 20} />
      break
    case 188:
      icon = <FcTimeline fontSize={size || 20} />
      break
    case 189:
      icon = <FcMoneyTransfer fontSize={size || 20} />
      break
    case 190:
      icon = <FcConferenceCall fontSize={size || 20} />
      break
    case 1090:
      icon = <FcTodoList fontSize={size || 20} />
      break
    case 1092:
      icon = <FcNews fontSize={size || 20} />
      break
    case 9921:
      icon = <FaReact fontSize={size || 20} />
      break
    case 9922:
      icon = <BsCodeSlash fontSize={size || 20} />
      break
    case 9923:
      icon = <FiGitBranch fontSize={size || 20} />
      break
    case 9924:
      icon = <VscDebugAlt fontSize={size || 20} />
      break
    default:
      break
  }
  return icon
}
export default IconParser
