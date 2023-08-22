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

import { useEffect, useState } from 'react'
import { useImmerReducer } from 'use-immer'

import { boardReducer, initBoard } from '../reducers'
import { Controller } from '../service'
import { ControllerProvider } from './ControllerProvider'
import { BoardApiProvider } from './BoardApiProvider'

let controller: Controller

export function Providers({ children }: { children: React.ReactNode }) {
  const [ ready, setReady ] = useState(false)
  const [ board , dispatch ] = useImmerReducer(boardReducer, undefined, initBoard)

  useEffect(() => {
    if (!controller)
      controller = new Controller()

    dispatch({ type: 'reset' })
    setReady(true)
  }, [dispatch])

  if (!ready || !controller)
    return (<></>)

  return (
    <ControllerProvider value={controller}>
      <BoardApiProvider value={{ board, dispatch }}>
        {children}
      </BoardApiProvider>
    </ControllerProvider>
  )
}
