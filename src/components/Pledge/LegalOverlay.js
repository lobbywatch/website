import {
  Overlay,
  OverlayBody,
  OverlayToolbar,
  Interaction,
  A,
} from '@project-r/styleguide'

const pages = [
  {
    href: '/agb',
    content: false, // in Publikator since April 2022
  },
  {
    href: '/datenschutz',
    content: false, // in Publikator since April 2022
  },
  {
    href: '/statuten',
    content: false, // loads from Publikator
  },
]

export const SUPPORTED_HREFS = pages.map((p) => p.href)

const LegalOverlay = ({ onClose, href, title }) => {
  const page = pages.find((p) => p.href === href)

  return (
    <Overlay mUpStyle={{ maxWidth: 720, minHeight: 0 }} onClose={onClose}>
      <OverlayToolbar title={title} onClose={onClose} />
      <OverlayBody>
          <Interaction.P>
            <A href={href} target='_blank'>
              Jetzt anzeigen
            </A>
          </Interaction.P>
      </OverlayBody>
    </Overlay>
  )
}

export default LegalOverlay
