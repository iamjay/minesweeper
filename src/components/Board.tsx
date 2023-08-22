/*
 Copyright (C) 2023 Pathompong Puengrostham

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { useCallback } from 'react'

import { useBoardApi } from '../hooks'
import { Cell, Row } from '../models'

function CellNode({ cell }: { cell: Cell }) {
  const { dispatch } = useBoardApi()

  const onClick = useCallback((e: React.MouseEvent<Element>) => {
    e.preventDefault()
    if (e.button === 2)
      dispatch({ type: 'right_click', rowNum: cell.rowNum, colNum: cell.colNum })
    else
      dispatch({ type: 'click', rowNum: cell.rowNum, colNum: cell.colNum })
  }, [cell.colNum, cell.rowNum, dispatch])

  const onDoubleClick = useCallback((e: React.MouseEvent<Element>) => {
    e.preventDefault()
    dispatch({ type: 'double_click', rowNum: cell.rowNum, colNum: cell.colNum })
  }, [cell.colNum, cell.rowNum, dispatch])

  let text = ''
  const style: React.CSSProperties = {}
  if (cell.isOpen) {
    if (cell.isBomb) {
      text = '💣'
    } else if (cell.value > 0) {
      text = `${cell.value}`
      switch (cell.value) {
        case 1:
          style['color'] = '#0705b9'
          break
        case 2:
          style['color'] = '#0e5b0d'
          break
        case 3:
          style['color'] = '#f11b22'
          break
        default:
          style['color'] = '#000050'
      }
    }
  } else if (cell.isFlag) {
    text = '🚩'
  }

  return (
    <div className={`cell ${cell.isOpen ? 'open' : ''}`} style={style}
      onClick={onClick} onContextMenu={onClick} onDoubleClick={onDoubleClick}>
      {text}
    </div>
  )
}

function RowNode({ row }: { row: Row }) {
  return (
    <div className='row'>
      {
        row.cells.map((cell) => {
          return <CellNode key={`cell-${cell.rowNum}-${cell.colNum}`} cell={cell} />
        })
      }
    </div>
  )
}

export function Board() {
  const { board } = useBoardApi()

  const rows: React.ReactNode[] = []
  for (const row of board.rows) {
    rows.push(<RowNode key={`row-${row.rowNum}`} row={row} />)
  }

  return (
    <>
      {rows}
    </>
  )
}
