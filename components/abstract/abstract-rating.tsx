import Rating from "react-rating";
import isFinite from 'lodash/isFinite'
import Icon from "../ui/ionicon";
interface AbstractRatingProps {
  value: number|undefined|null
  onChange?: (value: number) => void
  disabled?: boolean
}

export default function AbstractRating(props: AbstractRatingProps) {

  const {value, onChange, disabled} = props

  return (<div style={{fontSize: 20}}>
    <Rating start={-1} stop={3} step={1}
            readonly={!!disabled}
            emptySymbol={<Icon name={`star-outline`}/>}
            fullSymbol={<Icon name={`star`}/>}
            initialRating={isFinite(Number(value)) ? value : -1}
            onChange={onChange}
    />
  </div>)
}
