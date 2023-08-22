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

import { Dispatch, createContext } from 'react';

import { Board } from '../models';
import { Action } from '../reducers';

export interface BoardApi {
  board: Board
  dispatch: Dispatch<Action>
}

export const BoardApiContext = createContext<BoardApi | undefined>(undefined)

export function BoardApiProvider({ children, value }: { children: React.ReactNode, value: BoardApi }) {
  return (
    <BoardApiContext.Provider value={value}>
      {children}
    </BoardApiContext.Provider>
  )
}
