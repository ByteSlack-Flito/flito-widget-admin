import React, { useState } from 'react'
import IconParser from '../../misc/iconParser'
import { SubTitle } from '../global'
const TeamOverview = ({
  style,
  className,
  roleTitle,
  roleCount,
  description,
  iconId
}) => {
  const [showDescription, setShowDescription] = useState(false)
  const desc = `${roleCount} ${roleTitle} Engineer(s) suggested`
  return (
    <div
      className={`team_overview shadow_light font_theme_dark ${className}`}
      style={style}
      onMouseOver={() => setShowDescription(true)}
      onMouseLeave={() => setShowDescription(false)}
    >
      <div className='d-flex'>
        <IconParser itemId={iconId} />
        <SubTitle
          fontType={'bold'}
          content={`${roleCount} ${roleTitle} Engineer(s)`}
          className={'font_no_margin'}
          style={{ marginLeft: '5px' }}
        />
      </div>
      <SubTitle
        className={`font_no_margin`}
        content={showDescription ? desc : desc}
      />
    </div>
  )
}

export default TeamOverview
