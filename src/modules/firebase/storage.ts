import firebase from '~/plugins/firebase'
const storage = firebase.storage()

export function uploadStorage(blob): Promise<any> {
  const metadata = {
    contentType: blob.type,
  }

  const storageRef = storage.ref(new Date().getTime().toString())

  // Upload file and metadata to the object 'images/mountains.jpg'
  const uploadTask = storageRef.put(blob, metadata)

  // Listen for state changes, errors, and completion of the upload.
  return new Promise((resolve, reject) => {
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      (snapshot: any) => {
        // TODO: プログレスバー作るときに使えそう、作らないならいらない
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log('Upload is ' + progress + '% done')
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused')
            break
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running')
            break
        }
        // this.commit('storage/setProgress', progress)
      },
      (error: any) => {
        console.log(error)
        reject(error)
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
      },
      async () => {
        const url = await uploadTask.snapshot.ref.getDownloadURL()
        resolve(url)
      }
    )
  })
}

export async function downloadStorage(path: string): Promise<void> {
  const storageRef = storage.ref()

  // Create a reference to the file we want to download
  const starsRef = storageRef.child(path)

  // Get the download URL
  try {
    // Insert url into an <img> tag to "download"
    const url = await starsRef.getDownloadURL()
    console.log('getDownloadURL', url)
    // this.commit('storage/setDownloadUrl', url)
  } catch (error) {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    // this.commit('storage/setDownloadError', error)
  }
}

export async function deleteStorage(path): Promise<void> {
  const storageRef = storage.ref()
  const desertRef = storageRef.child(path)
  try {
    await desertRef.delete()
    // this.commit('storage/setDeleteResult', 'ok')
    console.log('delete ok')
  } catch (error) {
    console.log(error)
    // this.commit('storage/setDeleteError', error)
  }
}
