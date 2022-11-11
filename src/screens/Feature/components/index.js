import React from 'react'
import { FcCancel, FcCheckmark } from 'react-icons/fc'
import './index.css'

export const AssignButton = ({ assigned = false, onClick = () => {} }) => {
  return (
    <div className='assign_btn_container' onClick={onClick}>
      <div className='assign_btn tool_tip'>
        {assigned ? <FcCheckmark size={20} /> : <FcCancel size={20} />}
        <span className="tooltiptext">Click to {assigned ? 'Un-Assign' : 'Assign'}</span>
      </div>
    </div>
  )
}
