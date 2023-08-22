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

import { ChangeEvent, useCallback } from 'react'

import { useBoardApi } from './hooks'
import { BoardLevel } from './models'
import { Board, BombCounter, ResetButton, TimeCounter } from './components'

import './App.css'

function App() {
  const { board, dispatch } = useBoardApi()

  const onLevelChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'set_level', level: Number.parseInt(e.target.value) })
  }, [dispatch])

  return (
    <div className='game-container'>
      <div className='score-container'>
        <span>Minesweeper</span>
        <select onChange={onLevelChange} value={board.boardLevel}>
          <option value={BoardLevel.BEGINNER}>Beginner</option>
          <option value={BoardLevel.INTERMEDIATE}>Intermediate</option>
          <option value={BoardLevel.EXPERT}>Expert</option>
        </select>
      </div>
      <div className='score-container'>
        <BombCounter />
        <ResetButton />
        <TimeCounter />
      </div>
      <Board />
      <span style={{ fontSize: 'x-small' }}>© 2023 Pathompong Puengrostham</span>
    </div>
  )
}

export default App
