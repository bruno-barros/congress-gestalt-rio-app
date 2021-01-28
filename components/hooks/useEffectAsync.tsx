import {useEffect} from 'react';

/**
 * Usage:
 *  const [state, setState] = useState('Hello');
    useEffectAsync(async () => {
      const newState = await asyncFunction();
      setState(newState);
    }, []);
 * @param effect
 * @param inputs
 */
export default function useEffectAsync(effect, inputs) {
  useEffect(() => {
    effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, inputs);
}
