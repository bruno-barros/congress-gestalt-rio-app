import Rating from "react-rating";
import {Icon} from "@brunobarros/react-components";
import isFinite from 'lodash/isFinite'
interface AbstractRatingProps {
  value: number|undefined|null
  onChange?: (value: number) => void
  disabled?: boolean
}

export default function AbstractRating(props: AbstractRatingProps) {

  const {value, onChange, disabled} = props

  return (<div style={{fontSize: 20}}>
    <Rating start={-2} stop={4} step={2}
            readonly={!!disabled}
            emptySymbol={<Icon name={`star-outline`}/>}
            fullSymbol={<Icon name={`star`}/>}
            initialRating={isFinite(Number(value)) ? value : -2}
            onChange={onChange}
    />
  </div>)
}
