import NextLink from 'next/prefetch'
import styled from 'styled-components'
import {LW_BLUE} from '../colors'

const RawLink = ({children, className, ...props}) => (
  <NextLink {...props}><a className={className}>{children}</a></NextLink>
)

export const Link = styled(RawLink)`
  color: ${LW_BLUE};
`

export const H1 = styled.h1`
  font-size: 48px;
  line-height: 56px;
  font-weight: 300;
`

export const H2 = styled.h2`
  font-size: 36px;
  line-height: 42px;
  font-weight: 300;
`

export const H3 = styled.h3`
  font-size: 24px;
  line-height: 32px;
  font-weight: 400;
`

export const H4 = styled.h4`
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
`

export const P = styled.p`
  font-size: 16px;
  line-height: 24px;
`
