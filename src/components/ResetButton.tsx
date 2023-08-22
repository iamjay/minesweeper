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

export function ResetButton() {
  const { board, dispatch } = useBoardApi()

  const onClick = useCallback(() => {
    dispatch({ type: 'reset' })
  }, [dispatch])

  let button = '🙂'
  if (board.isDead)
    button = '😵'
  else if (board.isWon)
    button = '😎'

  return (
    <button className='button' onClick={onClick}>{button}</button>
  )
}
