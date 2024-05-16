import React, { memo } from 'react'
import { Outlet } from 'react-router-dom'
import Footer from 'src/components/Footer'
import Header from 'src/components/Hearder'
interface Props {
  children?: React.ReactNode
}
function MainLayoutInner({ children }: Props) {
  console.log('MainLayout')

  return (
    <div>
      <Header /> {children} <Outlet />
      <Footer />
    </div>
  )
}
const MainLayout = memo(MainLayoutInner)
export default MainLayout
