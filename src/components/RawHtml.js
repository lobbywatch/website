import React from 'react'
import {LW_BLUE} from '../theme'

const RawHtml = ({dangerouslySetInnerHTML}) => (
  <div className='RawHtml'>
    <div dangerouslySetInnerHTML={dangerouslySetInnerHTML} />
    <style jsx>{`
    .RawHtml :global(p) {
      color: #000;
      font-size: 16px;
      line-height: 24px;
    }
    .RawHtml :global(h1) {
      color: #000;
      font-size: 48px;
      line-height: 56px;
      font-weight: 300;
    }
    .RawHtml :global(h2) {
      color: #000;
      font-size: 36px;
      line-height: 42px;
      font-weight: 300;
    }
    .RawHtml :global(h3) {
      color: #000;
      font-size: 24px;
      line-height: 32px;
      font-weight: 400;
    }
    .RawHtml :global(h4) {
      color: #000;
      font-size: 16px;
      line-height: 24px;
      font-weight: 700;
    }
    .RawHtml :global(h5) {
      color: #000;
      font-size: 16px;
      line-height: 24px;
      font-weight: 700;
    }
    .RawHtml :global(h6) {
      color: #000;
      font-size: 16px;
      line-height: 24px;
      font-weight: 700;
    }
    .RawHtml :global(small) {
      font-size: 14px;
      line-height: 20px;
    }
    .RawHtml :global(a) {
      color: ${LW_BLUE};
    }
    .RawHtml :global(a:visited) {
      color: ${LW_BLUE};
    }
    `}</style>
  </div>
)

export default RawHtml
