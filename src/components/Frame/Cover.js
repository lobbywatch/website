import React from 'react'
import { css } from 'glamor'
import { LW_BLUE_LIGHT, LW_BLUE_DARK, WHITE } from '../../theme'
import Logo from '../../assets/Logo'
import { Center } from '.'
import { StyledLink } from '../Styled'
import Message from '../Message'
import SearchField from './SearchField'

const styles = {
  container: css({
    position: 'relative',
    padding: '60px 0 45px',
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
  list: css({
    listStyle: 'none',
    margin: 0,
    padding: 0,
    fontSize: 16,
    lineHeight: '24px',
  }),
  item: css({
    display: 'inline-block',
    '& a, & a:visited, & a:hover': {
      color: LW_BLUE_LIGHT,
    },
    '& a:hover': {
      color: WHITE,
    },
  }),
  menuList: css({
    marginTop: 30,
    textAlign: 'center',
  }),
  menuItem: css({
    margin: '0 15px',
  }),
  localeList: css({
    position: 'absolute',
    top: 26,
    right: 26,
  }),
  localeItem: css({
    marginLeft: 15,
  }),
}

const Cover = ({ locale, localeLinks, menuItems }) => {
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

        <div
          style={{
            margin: '30px auto',
            maxWidth: 600,
          }}
        >
          <SearchField />
        </div>

        <ol {...styles.list} {...styles.menuList}>
          {menuItems.map(({ label, href }, index) => (
            <li {...styles.item} {...styles.menuItem} key={index}>
              <StyledLink href={href}>{label}</StyledLink>
            </li>
          ))}
        </ol>
      </Center>
      <ul {...styles.list} {...styles.localeList}>
        {localeLinks.map(({ label, href }, index) => (
          <li {...styles.item} {...styles.localeItem} key={index}>
            <StyledLink href={href}>{label}</StyledLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Cover
