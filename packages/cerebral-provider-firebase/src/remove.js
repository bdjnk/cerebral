import {
  createRef
} from './helpers'

export default function remove (path) {
  const ref = createRef(path)
  return new Promise((resolve, reject) => {
    ref.remove().then(
      () => resolve({}),
      (error) => reject({error: error.message})
    )
  })
}
