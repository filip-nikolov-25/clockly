import React from 'react'

interface Props {
    children?: React.ReactNode
}
const Wrapper = ({ children }: Props) => {
  return (
    <div className='w-10/12 mx-auto'>{children}</div>
  )
}

export default Wrapper