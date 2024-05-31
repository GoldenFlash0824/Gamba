import { useEffect, DependencyList } from 'react'

export function useDebounceEffect(
  fn,
  waitTime,
  deps,
) {
  useEffect(() => {
    const t = setTimeout(() => {
      if (deps) {
        fn.apply(undefined)
      }
    }, waitTime)

    return () => {
      clearTimeout(t)
    }
  }, deps)
}
