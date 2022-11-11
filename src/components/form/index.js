import { faAngleDown, faClose } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import IconParser from '../../misc/iconParser'
import { getRandomInteger } from '../../misc/logics'
import { Card, Spacer, SubTitle, Title } from '../global'
import './index.css'

export const Button = ({
  label,
  onClick,
  icon,
  hasShadow,
  size,
  isExtraSmall,
  theme,
  animateIcon,
  animateScale,
  isRounded,
  isBusy,
  className,
  disabled,
  underlined,
  isFontAwesomeIcon = true,
  style = {}
}) => {
  return (
    <div
      className={`button_light ${(isBusy || theme === 'dark') &&
        'button_dark'} m-auto ${hasShadow &&
        'shadow'} button_size_${size} d-flex button_light_${isExtraSmall &&
        'extended'} ${animateIcon && 'icon_animated'} ${animateScale &&
        'scale_animated'} ${isRounded && 'button_rounded'} ${className}
        ${disabled && 'disabled'} ${underlined && 'button_underline'}`}
      style={{
        pointerEvents: isBusy || disabled ? 'none' : 'all',
        ...style
      }}
      onClick={() => onClick && onClick()}
    >
      {!isBusy ? (
        <div className='d-flex'>
          <span className={`${animateIcon && 'button_text text_icon_animated'}`}>
            {label}
          </span>
          {icon && isFontAwesomeIcon && (
            <FontAwesomeIcon
              className={animateIcon && 'icon_hidden'}
              icon={icon}
              fontSize={isExtraSmall ? 14 : 16}
              fill='#000'
              style={{
                marginLeft: '10px',
                alignSelf: 'center'
              }}
            />
          )}
          {icon && !isFontAwesomeIcon && <div
            style={{
              marginLeft: '5px',
              alignSelf: 'center'
            }}
            className={animateIcon && 'icon_hidden'}
          >
            {icon}
          </div>}
        </div>
      ) : (
        <div
          className='spinner-border text-light spinner_small'
          role='status'
        />
      )}
    </div>
  )
}

export const Input = ({
  name,
  fontAwesomeIcon,
  placeholder,
  className,
  onValueChange,
  isMultiLine,
  value,
  isPassword,
  isError
}) => {
  const [isFocused, setFocused] = useState(false)
  return (
    <div
      className={`input ${className} d-flex ${isFocused &&
        'input_focused'} ${isError && 'input_error'}`}
    >
      {fontAwesomeIcon && (
        <div className='col col-sm-1 m-auto'>
          <FontAwesomeIcon
            icon={fontAwesomeIcon}
            fontSize={14}
            className='m-auto'
          />
        </div>
      )}
      <div className='col'>
        {isMultiLine ? (
          <textarea
            type='text'
            className='input_regular multi-line'
            placeholder={placeholder}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={e => onValueChange(e.target.value)}
          />
        ) : (
          <input
            type={isPassword ? 'password' : 'text'}
            className='input_regular'
            placeholder={placeholder}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            value={value}
            onChange={e => onValueChange && onValueChange(e.target.value)}
          />
        )}
      </div>
    </div>
  )
}

export const DropDown = ({
  icon,
  className,
  onValueChange = (val = '', index = 0) => {},
  options,
  enableClear,
  isExtraSmall,
  theme,
  label,
  contentContainerProps,
  labelProps,
  containerProps,
  style
}) => {
  const [isFocused, setFocused] = useState(false)
  const [currentValue, setCurrentValue] = useState()
  function handleBlur (event) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setFocused(false)
    }
  }
  function handleValueChange (value, index) {
    setCurrentValue(value)
    setFocused(false)
    onValueChange(
      value?.title || value?.label || value?.description || value,
      index
    )
  }

  return (
    <div
      className={`dropdown ${isFocused && 'dropdown_focused'} ${className} ${
        containerProps?.className
      }`}
      tabIndex={1}
      onClick={() => setFocused(!isFocused)}
      onBlur={event => handleBlur(event)}
      // style={{
      //   padding: '0px'
      // }}
      style={style}
    >
      <div
        className={`input d-flex dropdown ${isExtraSmall &&
          'dropdown_compact'} dropdown_theme_${theme}`}
      >
        {icon && (
          <div
            className='col col-sm-1'
            style={{
              marginRight: '10px'
            }}
          >
            <FontAwesomeIcon icon={icon} fontSize={15} className='m-auto' />
          </div>
        )}
        <div
          className='col left-align'
          style={{
            display: 'fex'
          }}
          {...contentContainerProps}
        >
          {label && (
            <SubTitle
              content={label}
              className={'no_margin'}
              fontType='bold'
              {...labelProps}
            />
          )}
          <SubTitle
            className={'no_margin'}
            fontType='bold'
            content={
              currentValue?.title ||
              currentValue?.label ||
              currentValue?.description ||
              currentValue ||
              options[0]?.title ||
              options[0]
            }
          ></SubTitle>
        </div>
        {enableClear && (
          <div className='col col-sm-1' onClick={() => handleValueChange('')}>
            <FontAwesomeIcon icon={faClose} fontSize={15} className='m-auto' />
          </div>
        )}
        <div
          className={`col col-sm-1 dropdown_arrow ${
            isFocused ? 'dropdown_arrow_up' : ''
          }`}
          style={{
            display: 'flex'
          }}
        >
          <FontAwesomeIcon
            icon={faAngleDown}
            fontSize={15}
            className='m-auto'
          />
        </div>
      </div>
      <div className='container'>
        {options?.length > 0 && (
          <div
            className={`row dropdown_container ${isFocused &&
              'dropdown_container_visible'}`}
          >
            {options?.map((value, index) => {
              return (
                <button
                  value={
                    value.title || value.label || value.description || value
                  }
                  className={`input item ${isExtraSmall && 'item_small'}`}
                  onClick={() => handleValueChange(value, index)}
                  // key={index}
                  type='button'
                  id={index}
                  key={value.id || index}
                >
                  <SubTitle
                    className={`no_margin`}
                    content={
                      value.title || value.label || value.description || value
                    }
                  />
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export const SuggestionInput = ({
  icon,
  placeholder,
  className,
  onValueChange,
  options,
  enableClear
}) => {
  const [isFocused, setFocused] = useState(false)
  const [selectedValue, setSelectedValue] = useState(placeholder || options[0])
  function handleBlur (event) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setFocused(false)
    }
  }
  function handleValueChange (value) {
    setSelectedValue(value.title || value.label || value.description || value)
    setFocused(false)
    onValueChange(value.title || value.label || value.description || value)
  }
  return (
    <div
      className={`dropdown ${isFocused && 'dropdown_focused'} ${className}`}
      tabIndex={1}
      onFocus={() => setFocused(true)}
      onBlur={event => handleBlur(event)}
      style={{
        padding: '0px'
      }}
    >
      <div className={`input d-flex dropdown`}>
        {icon && (
          <div className='col col-sm-1'>
            <FontAwesomeIcon icon={icon} fontSize={15} className='m-auto' />
          </div>
        )}
        <div className='col left-align'>
          <strong>{selectedValue}</strong>
        </div>
        {enableClear && (
          <div className='col col-sm-1' onClick={() => handleValueChange('')}>
            <FontAwesomeIcon icon={faClose} fontSize={15} className='m-auto' />
          </div>
        )}
        <div className='col col-sm-1'>
          <FontAwesomeIcon
            icon={faAngleDown}
            fontSize={15}
            className='m-auto'
          />
        </div>
      </div>
      <div className='container'>
        <div
          className={`row dropdown_container ${isFocused &&
            'container_visible'}`}
        >
          {options?.map((value, index) => {
            return (
              <button
                value={value.title || value.label || value.description || value}
                className='input item'
                onClick={() => handleValueChange(value)}
                // key={index}
                type='button'
                id={getRandomInteger(9991, 878890)}
              >
                {value.title || value.label || value.description || value}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export const SimpleChoice = ({
  id,
  onSelect,
  className,
  disableSelect,
  selected,
  data,
  choiceProps
}) => {
  const [isSelected, setSelected] = useState(selected)
  function performSelection () {
    if (!disableSelect) {
      setSelected(!isSelected)
      onSelect(!isSelected)
    }
  }
  return (
    <>
      <div
        className={`choice_extra-small ${isSelected && 'choice_selected'} ${
          choiceProps?.className
        }`}
        onClick={() => performSelection()}
        style={{
          alignItems: data.icon ? 'center' : 'inherit',
          ...choiceProps?.style
        }}
      >
        <div className={`${data.icon ? 'd-flex' : ''}`}>
          {data.icon && (
            <div
              style={{
                marginRight: '5px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {data.icon instanceof Function ? data.icon() : data.icon}
            </div>
          )}
          <div>
            <SubTitle
              className={'font_xs'}
              fontType='bold'
              content={data.title || data.value || data.description || data}
              style={{
                marginBottom: 0
              }}
            />
            {data.description && (
              <SubTitle
                className={'font_xs'}
                content={data.description || data}
                style={{
                  marginBottom: 0,
                  display: 'block'
                }}
                fontType='bold'
              />
            )}
          </div>
        </div>
        {data.extraComponent}
      </div>
    </>
  )
}

/**
 * A simple component that works like a multi-checkbox container.
 * @param {object} props Component props
 * @param {[]} props.data The array of objects/data to render as option(s)
 * @param {Function} props.onChoiceChange Callback fired when user changes the selection(s).
 * @param {boolean} props.disableSelect If `false`, will prevent any selection & no callbacks will be fired.
 * @param {{ className: string, style: React.CSSProperties }} props.itemProps If passed a value, will set the component's child element(in this case `<SimpleChoice/>`)'s properties.
 * @param {[]} props.comparingData If passed an array of selected option IDs, this will make the list render with the choices as pre-selected.
 * @param {{ className: string, style: React.CSSProperties }} props.choiceProps If passed a value, will set the component's properties.
 * @param {[]} props.ignoreProps Will ignore rendering the passed property names. Only string values are accepted.
 */
export const SimpleChoiceList = ({
  data,
  title,
  onChoiceChange,
  disableSelect,
  itemProps,
  comparingData,
  choiceProps,
  ignoreProps
}) => {
  const [choiceIDs, setChoiceIDs] = useState([])

  function performOnChoiceChange (selected, choiceId) {
    let ids = [...choiceIDs]
    if (selected) {
      ids.push(choiceId)
    } else {
      ids = ids.filter(id => id != choiceId)
    }
    setChoiceIDs(ids)
    onChoiceChange && onChoiceChange(ids)
  }

  function isDataSame (parentData) {
    if (comparingData) {
      return comparingData?.some(
        x => x.id == parentData.id || x.id === parentData.id
      )
    }
    return false
  }

  function constructData () {
    if (data && ignoreProps) {
      const formattedList = []
      data.map(x => {
        let formatted = { ...x }
        Object.keys(x).map(dataProp => {
          if (ignoreProps.includes(dataProp)) {
            delete formatted[dataProp]
          }
        })
        formattedList.push(formatted)
      })
      return formattedList
    }
    return data
  }

  return (
    <div
      className='d-flex'
      style={{
        flexWrap: 'wrap'
      }}
    >
      {title && (
        <>
          <SubTitle
            content={title}
            className='no_margin'
            fontType='bold'
            style={{
              maxWidth: 'max-content'
            }}
          />
          <Spacer />
        </>
      )}
      {constructData().map(choice => {
        const isSelected = isDataSame(choice)
        return (
          <SimpleChoice
            choiceProps={choiceProps}
            data={choice}
            {...itemProps}
            onSelect={selected => performOnChoiceChange(selected, choice.id)}
            key={choice.id || getRandomInteger(20, 9899)}
            disableSelect={disableSelect}
            selected={isSelected}
          />
        )
      })}
    </div>
  )
}

export const SwitchButton = React.forwardRef(
  ({ onCheckChanged, label, onCheckRender }, ref) => {
    const [checked, setChecked] = useState(false)
    function handleCheck (value) {
      setChecked(!checked)
      onCheckChanged(value)
    }
    const randomId = getRandomInteger(50, 9889)
    return (
      <div
        style={{
          padding: '0'
        }}
      >
        <div className='form-check form-switch d-flex'>
          <input
            className='form-check-input'
            type='checkbox'
            role='switch'
            id={randomId}
            onChange={event => handleCheck(event.target.checked)}
          />
          <Spacer size='small' />

          <label
            className='form-check-label'
            htmlFor={randomId}
            style={{ userSelect: 'none' }}
          >
            {label}
          </label>
          <Spacer size='small' />
        </div>
        {checked && <div className='row'>{onCheckRender}</div>}
      </div>
    )
  }
)

export const ExtendedButton = ({
  title,
  description,
  id,
  itemSize,
  options,
  onSelect,
  isSelected,
  theme,
  cardProps,
  extraLabel,
  onClick = () => {},
  className,
  icon
}) => {
  const Button_Regular = () => {
    return (
      <div className={className} onClick={() => onClick()}>
        <Card {...cardProps} theme={`${isSelected && 'dark'} theme_${theme}`}>
          <div className='row cols-3'>
            <div className='col col-sm-2 d-flex'>
              <div className='icon_regular d-flex'>
                {!icon ? <IconParser itemId={id} /> : icon}
              </div>
            </div>
          </div>
          <Spacer size='medium' />
          <div className='row'>
            <Title
              size='small'
              content={title}
              fontType='bold'
              style={{ fontSize: '1rem' }}
            />
          </div>
          <div className='row'>
            <SubTitle content={description} />
          </div>
          {extraLabel && (
            <div className='col'>
              <SubTitle
                className='card_option_bg shadow_light no_margin'
                fontType='bold'
                content={extraLabel}
              />
            </div>
          )}
          {options && (
            <div className='row'>
              <SubTitle
                className='link'
                fontType='bold'
                content={
                  options
                    ? `${options.length - 1}+ Features Available`
                    : 'No extra options'
                }
              />
            </div>
          )}
        </Card>
        {/* <Spacer size='medium' /> */}
      </div>
    )
  }

  const Button_Compact = () => {
    return (
      <div className={className} onClick={onClick}>
        <Card
          {...cardProps}
          theme={`${isSelected ? 'dark' : theme} `}
          size='compact'
        >
          <div className='row cols-3'>
            <div className='col col-sm-2 d-flex'>
              <div className='icon_regular d-flex icon_small'>
                {!icon ? <IconParser itemId={id} /> : icon}
              </div>
            </div>
            <div className='col m-auto'>
              <Title
                size='small'
                content={title}
                fontType='bold'
                style={{ fontSize: '1rem' }}
                className='m-auto'
              />
            </div>
          </div>
          <div className='row cols-2'>
            <div className='col col-sm-2' />
            <div className='col'>
              <SubTitle content={description} />
            </div>
          </div>
          <div className='row cols-2'>
            <div className='col col-sm-2' />
            {extraLabel && (
              <div className='col'>
                <SubTitle
                  className='card_option_bg shadow_light'
                  fontType='bold'
                  content={extraLabel}
                />
              </div>
            )}
            {options && (
              <div className='col'>
                <SubTitle
                  fontType='bold'
                  className='card_option_bg shadow_light'
                  size='small'
                  content={
                    options
                      ? `View ${options.length - 1}+ Features`
                      : 'No extra options'
                  }
                />
              </div>
            )}
          </div>
        </Card>
        <Spacer size='medium' />
      </div>
    )
  }

  return <>{itemSize === 'compact' ? <Button_Compact /> : <Button_Regular />}</>
}
