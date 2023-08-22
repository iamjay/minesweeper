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

import { Draft } from 'immer';

import { Board, BoardLevel, Cell, CellValue, Row } from '../models';

const boardConfigs = [
  { row: 9, col: 9, bombs: 10 },
  { row: 16, col: 16, bombs: 40 },
  { row: 16, col: 30, bombs: 99 },
]

export type ResetAction = {
  type: 'reset'
}

export type TimerTickAction = {
  type: 'timer_tick'
}

export type ClickAction = {
  type: 'click'
  rowNum: number
  colNum: number
}

export type RightClickAction = {
  type: 'right_click'
  rowNum: number
  colNum: number
}

export type DoubleClickAction = {
  type: 'double_click'
  rowNum: number
  colNum: number
}

export type SetLevelAction = {
  type: 'set_level'
  level: BoardLevel
}

export type Action = ResetAction | TimerTickAction | ClickAction | RightClickAction | DoubleClickAction | SetLevelAction

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function runOnValidCell(board: Board, row: number, col: number, cb: (cell: Cell) => void) {
  if (row >= 0 && row < board.rowCount && col >= 0 && col < board.colCount)
      cb(board.rows[row].cells[col])
}

function runOnNeighbors(row: number, col: number, board: Board, cb: (cell: Cell) => void) {
  runOnValidCell(board, row - 1, col - 1, cb)
  runOnValidCell(board, row    , col - 1, cb)
  runOnValidCell(board, row + 1, col - 1, cb)
  runOnValidCell(board, row + 1, col    , cb)
  runOnValidCell(board, row + 1, col + 1, cb)
  runOnValidCell(board, row    , col + 1, cb)
  runOnValidCell(board, row - 1, col + 1, cb)
  runOnValidCell(board, row - 1, col    , cb)
}

function placeBombs(board: Board) {
  let bombLeft = board.bombCount
  while (bombLeft > 0) {
    const y = getRandomInt(board.rowCount)
    const x = getRandomInt(board.colCount)
    const cell = board.rows[y].cells[x]
    if (!(cell.isOpen || cell.isBomb)) {
      board.rows[y].cells[x].isBomb = true
      runOnNeighbors(y, x, board, (cell) => { cell.value++ })
      bombLeft--
    }
  }
}

function revealBombs(board: Board) {
  for (const row of board.rows) {
    for (const cell of row.cells) {
      if (!cell.isOpen && cell.isBomb) {
        cell.isOpen = true
        cell.value = CellValue.BOMB
      }
    }
  }
}

function openNeighbors(row: number, col: number, board: Board, visited: Record<string, boolean>) {
  if (board.isDead)
    return

  const cell = board.rows[row].cells[col]
  if (`${cell.rowNum}-${cell.colNum}` in visited)
    return

  visited[`${cell.rowNum}-${cell.colNum}`] = true

  if (cell.isFlag)
    return

  if (!cell.isOpen) {
    cell.isOpen = true
    board.openCount++
  }

  if (cell.isBomb) {
    board.isDead = true
    revealBombs(board)
    return
  }

  if (cell.value === 0)
    runOnNeighbors(row, col, board, (cell) => openNeighbors(cell.rowNum, cell.colNum, board, visited))
}

export function initBoard(): Board {
  const board: Board = {
    boardLevel: BoardLevel.BEGINNER,
    rows: [],
    rowCount: 0,
    colCount: 0,
    bombCount: 0,
    flagCount: 0,
    openCount: 0,
    isStarted: false,
    isDead: false,
    isWon: false,
    timer: 0,
  }
  resetBoard(board)
  return board
}

function resetBoard(board: Board) {
  const config = boardConfigs[board.boardLevel]

  board.rowCount = config.row
  board.colCount = config.col
  board.bombCount = config.bombs

  board.rows = []
  board.flagCount = 0
  board.openCount = 0,
  board.isStarted = false
  board.isDead = false
  board.isWon = false
  board.timer = 0

  for (let y = 0; y < board.rowCount; y++) {
    const row: Row = { rowNum: y, cells: [] }

    for (let x = 0; x < board.colCount; x++)
      row.cells.push({ rowNum: y, colNum: x, isBomb: false, isFlag: false, isOpen: false, value: CellValue.NONE })

    board.rows.push(row)
  }
}

export function boardReducer(draft: Draft<Board>, action: Action) {
  switch (action.type) {
    case 'reset':
    case 'set_level':
      if (action.type === 'set_level')
        draft.boardLevel = action.level
      resetBoard(draft)
      break

    case 'timer_tick':
      if (!draft.isStarted || draft.isWon || draft.isDead)
        break

      draft.timer++
      break

    case 'click':
    case 'double_click': {
      if (draft.isWon || draft.isDead)
        break

      let cell = draft.rows[action.rowNum].cells[action.colNum]
      if (!cell.isOpen) {
        cell.isOpen = true
        draft.openCount++
      }

      if (!draft.isStarted) {
        placeBombs(draft)

        draft.isStarted = true
        draft.isDead = false

        cell = draft.rows[action.rowNum].cells[action.colNum]
      } else {
        if (cell.isBomb) {
          cell.value = CellValue.BOMB
          draft.isDead = true
          revealBombs(draft)
          break
        }
      }

      if (cell.value === 0)
        action.type = 'double_click'

      if (action.type === 'double_click') {
        let flags = 0
        runOnNeighbors(cell.rowNum, cell.colNum, draft, (cell) => {
          if (cell.isFlag)
            flags++
        })
        if (flags !== cell.value)
          return

        const visited: Record<string, boolean> = {}
        visited[`${cell.rowNum}-${cell.colNum}`] = true
        runOnNeighbors(cell.rowNum, cell.colNum, draft, (nb) => openNeighbors(nb.rowNum, nb.colNum, draft, visited))
      }

      if (!draft.isDead && (draft.rowCount * draft.colCount) - draft.bombCount === draft.openCount) {
        draft.isWon = true
      }
      break
    }

    case 'right_click': {
      if (!draft.isStarted || draft.isWon || draft.isDead)
        break

      const cell = draft.rows[action.rowNum].cells[action.colNum]
      if (cell.isFlag)
        draft.flagCount--
      else
        draft.flagCount++

      cell.isFlag = !cell.isFlag
      break
    }
  }
}
