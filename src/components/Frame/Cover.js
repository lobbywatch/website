import React from 'react'
import { css } from 'glamor'
import { LW_BLUE_LIGHT, LW_BLUE_DARK, WHITE } from '../../theme'
import Logo from '../../assets/Logo'
import { Center } from '.'
import { StyledLink } from '../Styled'
import Message from '../Message'

const styles = {
  container: css({
    position: 'relative',
    padding: '80px 0',
    backgroundColor: LW_BLUE_DARK,
    color: LW_BLUE_LIGHT,
  }),
  logo: css({
    margin: '0 0 5px',
    fontSize: 36,
    lineHeight: '50px',
    textDecoration: 'none',
  }),
  logoText: css({
    verticalAlign: 'top',
    display: 'inline-block',
    marginTop: -1,
    marginLeft: 20,
  }),
  claim: css({
    fontSize: 20,
    margin: 0,
  }),
  localeList: css({
    position: 'absolute',
    top: 26,
    right: 26,
    fontSize: 16,
    listStyle: 'none',
    margin: 0,
    paddingLeft: 0,
    lineHeight: '24px',
  }),
  localeListItem: css({
    float: 'left',
    marginLeft: 15,
    '& a, & a:visited, & a:hover': {
      color: LW_BLUE_LIGHT,
    },
    '& a:hover': {
      color: WHITE,
    },
  }),
}

const Cover = ({ locale, localeLinks }) => {
  return (
    <div {...styles.container}>
      <Center style={{ paddingTop: 0, paddingBottom: 0, textAlign: 'center' }}>
        <p {...styles.logo}>
          <Logo size={48} />
          <span {...styles.logoText}>Lobbywatch</span>
        </p>
        <p {...styles.claim}>
          <Message locale={locale} id='claim' />
        </p>
      </Center>
      <ul {...styles.localeList}>
        {localeLinks.map(({ label, href }, index) => (
          <li {...styles.localeListItem} key={index}>
            <StyledLink href={href}>{label}</StyledLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Cover
