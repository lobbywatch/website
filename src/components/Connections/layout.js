export const START_Y = 70

const layout = ({ hierarchy, width, open }) => {
  const MARGIN = 10
  const Y_SPACE = 10
  const Y_SPACE_BIG = 30

  let y = START_Y
  let x = 0
  let row = 0
  let lastType
  const nextRow = (rowHeight, bigSpace) => {
    x = 0
    y += rowHeight + (bigSpace ? Y_SPACE_BIG : Y_SPACE)
    row += 1
  }
  const visit = (node, align = 0.5) => {
    if (!node.children) {
      return
    }
    let rowHeight = 0
    let rowChildren = []
    let openChildren = []
    const newRow = (newType) => {
      const xLeftOver = width - x
      const xPush = xLeftOver * align // center
      for (const rowChild of rowChildren) {
        rowChild.x += xPush
      }
      nextRow(rowHeight, newType || openChildren.length)
      rowHeight = 0
      rowChildren = []
      if (openChildren.length > 0) {
        lastType = null
        for (const c of openChildren) {
          let align = 0.5
          const cx = c.x + c.data.measurements.width / 2
          if (cx > width * 0.7) {
            align = 1
          } else if (cx < width * 0.3) {
            align = 0
          }
          visit(c, align)
        }
        openChildren = []
      }
    }
    for (const child of node.children) {
      const measurements = child.data.measurements

      const newType = lastType && lastType !== child.data.type
      if (x + measurements.width > width || newType) {
        newRow(newType)
      }

      child.x = x
      child.y = y
      child.row = row
      rowHeight = Math.max(measurements.height, rowHeight)
      rowChildren.push(child)
      x += measurements.width + MARGIN
      if (open.has(child.data.id)) {
        openChildren.push(child)
      }
      lastType = child.data.type
    }
    newRow(true)
  }
  visit(hierarchy)
  hierarchy.y = 0
  hierarchy.x = width / 2

  return Math.max(y, 160)
}

export default layout
