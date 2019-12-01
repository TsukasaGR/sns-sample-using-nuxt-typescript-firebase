import loadImage from 'blueimp-load-image'

/**
 * 画像ファイルのDataURL(base64)を返す
 * @param file
 * @returns Promise<string>
 */
export function toDataUrlOfImage(file: File): Promise<string> {
  return canvasOfImageWithformatOrientation(file)
    .then(canvas => {
      return canvas.toDataURL('image/jpeg')
    })
    .catch(error => {
      return Promise.reject(new Error(error))
    })
}

/**
 * Fileの画像の向きを正しくしてCanvasにして返す
 * @param File file
 * @returns Promise<canvas>
 */
function canvasOfImageWithformatOrientation(file: File): Promise<any> {
  // TODO: async/awaitにしたいがうまくいかないのでPromiseにしている
  return new Promise(resolve => {
    loadImage.parseMetaData(file, data => {
      const options = {
        maxHeight: 1024,
        maxWidth: 1024,
        orientation: 0,
        canvas: true,
      }
      if (data.exif) {
        options.orientation = data.exif.get('Orientation')
      }
      loadImage(
        file,
        canvas => {
          resolve(canvas)
        },
        options
      )
    })
  })
}

export function toBlobFromBase64(base64: string, file: any): Blob | null {
  const bin = atob(base64.replace(/^.*,/, ''))
  const buffer = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) {
    buffer[i] = bin.charCodeAt(i)
  }
  // Blobを作成
  let blob
  try {
    blob = new Blob([buffer.buffer], { type: file.type })
  } catch (e) {
    throw new Error(e)
  }
  return blob
}
