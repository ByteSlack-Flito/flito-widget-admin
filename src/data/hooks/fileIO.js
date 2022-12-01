import { useState, useEffect } from 'react'

const customType = {
  'IMAGE': '.png,.jpeg,.jpg',
  'PDF': '.pdf',
  'DOC': '.docx,.doc',
  'ALL': '.png,.jpeg,.jpg,.pdf,.docx,.doc'
}

/**
 * A hook to open the file browser window to select files
 * @param {'true' | 'false'} allowMultiple
 * @param {'IMAGE' | 'PDF' | 'DOC' | 'ALL'} fileType
 * @returns The Selected file(s)
 */
export const useFilePicker = (allowMultiple = 'false', fileType = 'ALL') => {

  const [files, setFiles] = useState([])
  let input = document.createElement('input')
  input.type = 'file'

  if (allowMultiple) input.multiple = 'multiple'

  input.accept = customType[fileType] || 'All'

  input.onchange = _ => {
    // you can use this method to get file and perform respective operations
    // let files = Array.from(input.files)
    setFiles(input.files)
  }
  useEffect(() => { }, [])

  return {
    openPicker: () =>
      new Promise((resolve, reject) => {
        input.click()
        input.onchange = _ => {
          // you can use this method to get file and perform respective operations
          // let files = Array.from(input.files)
          resolve([...input.files])
        }
      }),
    files: files
  }
}