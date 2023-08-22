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

export const enum CellValue {
  NONE = 0,
  ONE = 1,
  TWO = 2,
  THREE = 3,
  FOUR = 4,
  FIVE = 5,
  SIX = 6,
  SEVEN = 7,
  EIGHT = 8,
  BOMB = -1,
}

export enum BoardLevel {
  BEGINNER,
  INTERMEDIATE,
  EXPERT,
}

export interface Cell {
  rowNum: number
  colNum: number
  isBomb: boolean
  isOpen: boolean
  isFlag: boolean
  value: CellValue
}

export interface Row {
  rowNum: number
  cells: Cell[]
}

export interface Board {
  boardLevel: BoardLevel
  rows: Row[]
  rowCount: number
  colCount: number
  bombCount: number
  flagCount: number
  openCount: number
  isStarted: boolean
  isDead: boolean
  isWon: boolean
  timer: number
}
