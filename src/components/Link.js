import NextLink from 'next/prefetch'
import styled from 'styled-components'
import {LW_BLUE} from '../colors'

const Link = ({children, className, ...props}) => (
  <NextLink {...props}><a className={className}>{children}</a></NextLink>
)

export default styled(Link)`
  color: ${LW_BLUE};
`
