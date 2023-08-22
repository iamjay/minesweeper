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

import { useEffect, useState } from 'react';

import { useBoardApi } from '../hooks';

export function TimeCounter() {
  const { board, dispatch } = useBoardApi()
  const [ timer, setTimer ] = useState<number | undefined>()

  useEffect(() => {
    const gameInProgress = board.isStarted && !board.isWon && !board.isDead
    if (gameInProgress) {
      if (!timer) {
        const id = setInterval(() => {
          dispatch({ type: 'timer_tick' })
        }, 1000)
        setTimer(id)
      }
    } else {
      if (timer) {
        clearInterval(timer)
        setTimer(undefined)
      }
    }
  }, [board.isDead, board.isStarted, board.isWon, dispatch, timer])

  return (
    <div className='dseg score'>
      <span>{board.timer}</span>
    </div>
  )
}
