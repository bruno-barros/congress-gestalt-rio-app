import {useEffect, useMemo} from "react";

export function useUppy(factory: any) {
  const uppy = useMemo<any>(factory, [])
  useEffect(() => {
    return () => uppy.close()
  }, [])
  return uppy
}
