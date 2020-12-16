export const UI_ACTYPE = {
  BLOCKUI: 'UI_BLOCKUI',
}
export const blockUi = (block: boolean = true) => {
  return (dispatch: any, getState: any) => {
    dispatch({type: UI_ACTYPE.BLOCKUI, payload: block})
  }
}
