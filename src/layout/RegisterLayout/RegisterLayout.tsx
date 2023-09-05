import Footer from 'src/components/Footer'
import RegisterHeader from 'src/components/RegisterHeader'

interface Props {
  children?: React.ReactNode
}
export default function RegisterLayout({ children }: Props) {
  return (
    <div>
      <RegisterHeader /> {children} <Footer />
    </div>
  )
}
// const RegisterLayout: React.FC<Props> = ({ children }) => {
//   return <div>{children}</div>
// }
// export default RegisterLayout
