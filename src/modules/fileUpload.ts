import { toBlobFromBase64 } from '~/modules/imageOperation'
import { uploadStorage } from '~/modules/firebase/storage'
import rollbar from '~/modules/rollbar'

export async function uploadImage<T>(
  type: 'goal' | 'record' | 'retrospective',
  object: T,
  uploadFiles: File[]
): Promise<T> {
  const column = type === 'goal' ? 'icon' : 'image'
  if (!object || !uploadFiles.length) return object
  try {
    const blob = toBlobFromBase64(object[column], uploadFiles[0])
    const url = await uploadStorage(blob)
    object[column] = url
  } catch (error) {
    rollbar.error(error)
    throw new Error(error)
  }
  return object
}
