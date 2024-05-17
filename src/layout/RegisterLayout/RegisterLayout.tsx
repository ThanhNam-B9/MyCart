import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import Footer from 'src/components/Footer'
import RegisterHeader from 'src/components/RegisterHeader'

interface Props {
  children?: React.ReactNode
}
function RegisterLayoutInner({ children }: Props) {
  console.log('RegisterHeader')
  return (
    <div>
      <RegisterHeader /> {children} <Outlet /> <Footer />
    </div>
  )
}
const RegisterLayout = memo(RegisterLayoutInner)
export default RegisterLayout

// const RegisterLayout: React.FC<Props> = ({ children }) => {
//   return <div>{children}</div>
// }
// export default RegisterLayout
