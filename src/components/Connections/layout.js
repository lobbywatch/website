export default ({
  hierarchy,
  nodes, links,
  width, open
}) => {
  const MARGIN = 10

  let y = 48
  let x = 0
  let row = 0
  const nextRow = (rowHeight) => {
    x = 0
    y += rowHeight + MARGIN
    row += 1
  }
  const visit = (node) => {
    const isOpen = open[node.data.id]
    if (isOpen) {
      let lastType
      let rowHeight = 0
      let rowChildren = []
      let openChildren = []
      const newRow = () => {
        const xLeftOver = width - x
        const xPush = xLeftOver / 2 // center
        rowChildren.forEach(rowChild => {
          rowChild.x += xPush
        })
        nextRow(rowHeight)
        rowHeight = 0
        rowChildren = []
        if (openChildren.length) {
          openChildren.forEach(visit)
          openChildren = []
        }
      }
      node.children.forEach(child => {
        const measurements = child.data.measurements

        if (
          (x + measurements.width > width) ||
          (lastType && lastType !== child.data.type)
        ) {
          newRow()
        }

        child.x = x
        child.y = y
        child.row = row
        rowHeight = Math.max(measurements.height, rowHeight)
        rowChildren.push(child)
        x += measurements.width + MARGIN
        if (open[child.data.id]) {
          openChildren.push(child)
        }
        lastType = child.data.type
      })
      newRow()
    }
  }
  visit(hierarchy)
  hierarchy.y = 0
  hierarchy.x = width / 2

  const height = y + 20

  return height
}
