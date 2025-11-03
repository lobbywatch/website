import { NestConnectionType } from './nest'
import { HierarchyNode } from 'd3-hierarchy'
import { MappedConnection, Potency } from '../../domain'

export const START_Y = 70

export type LayoutDatumRoot = {
  type: 'Root'
  id: 'Root'
}

export type LayoutDatumConnection = {
  type: 'Connection'
  id: string
  parentId: string
  label?: string
  connection: MappedConnection
}

export type LayoutDatumGroup = {
  type: 'Group'
  id: string
  parentId: string
  potency: Potency
  count: number
  label: string
}

export type LayoutDatumGuest = {
  type: 'Guest'
  id: string
  parentId: string
  label: string
}

export type LayoutDatum =
  | LayoutDatumRoot
  | LayoutDatumConnection
  | LayoutDatumGroup
  | LayoutDatumGuest

export interface LayoutNode
  extends HierarchyNode<
    LayoutDatum & {
      measurements: {
        height: number
        width: number
      }
    }
  > {
  ref: HTMLElement | SVGElement | null
  setRef: (ref: HTMLElement | SVGElement | null) => void
  x: number
  y: number
  row: number
}

const layout = (
  hierarchy: LayoutNode,
  width: number,
  isOpen: (id: string) => boolean,
): number => {
  const MARGIN = 10
  const Y_SPACE = 10
  const Y_SPACE_BIG = 30

  let y = START_Y
  let x = 0
  let row = 0
  let lastType: null | NestConnectionType = null
  const nextRow = (rowHeight: number, bigSpace: boolean) => {
    x = 0
    y += rowHeight + (bigSpace ? Y_SPACE_BIG : Y_SPACE)
    row += 1
  }
  const visit = (node: LayoutNode, align = 0.5) => {
    if (!node.children) {
      return
    }
    let rowHeight = 0
    let rowChildren = new Array<LayoutNode>()
    let openChildren = new Array<LayoutNode>()
    const newRow = (newType: boolean) => {
      const xLeftOver = width - x
      const xPush = xLeftOver * align // center
      for (const rowChild of rowChildren) {
        rowChild.x += xPush
      }
      nextRow(rowHeight, newType || openChildren.length > 0)
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

      const newType = lastType != null && lastType !== child.data.type
      if (x + measurements.width > width || newType) {
        newRow(newType)
      }

      child.x = x
      child.y = y
      child.row = row
      rowHeight = Math.max(measurements.height, rowHeight)
      rowChildren.push(child)
      x += measurements.width + MARGIN
      if (isOpen(child.data.id)) {
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
