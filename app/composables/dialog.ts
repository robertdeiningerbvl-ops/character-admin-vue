import { DialogModel } from '#components'

export const useDialog = () => {
  const overlay = useOverlay()
  const modal = overlay.create(DialogModel)
  const open = (options: any) => modal.open({ modal, ...options })

  return { open }
}
