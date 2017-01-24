import React, {PropTypes} from 'react'
import {Link} from './Styled'

const Menu = ({items, expanded}) => (
  <nav role='navigation' aria-expanded={expanded}>
    <ul>
      {items.map(({label, href, as}, i) => (
        <li key={i}>
          <Link href={href} as={as}>{label}</Link>
        </li>
      ))}
    </ul>
  </nav>
)

Menu.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    as: PropTypes.string,
    href: PropTypes.string.isRequired,
    label: PropTypes.node.isRequired,
    separator: PropTypes.bool
  })),
  expanded: PropTypes.bool
}

export default Menu
