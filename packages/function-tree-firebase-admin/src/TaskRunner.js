import Queue from 'firebase-queue'

function authenticate({firebase, props, path}) {
  return firebase.verifyIdToken(props.data._token)
    .then((decodedToken) => path.success({uid: decodedToken.uid}))
    .catch((error) => path.error({error}));
}

function createRunTask(task, run) {
  return (data, progress, resolve, reject) => {
    const _execution = data._execution

    delete data._execution

    run(task.specId, [
      authenticate, {
        success: task.tree,
        error: rejectTask(errors.AUTHENTICATE)
      }
    ], {
      _execution,
      data,
      task: {
        type: task.specId,
        resolve,
        reject
      }
    });
  };
}

export class TaskRunner {
  constructor (options = {}) {
    Object.assign(this, options)

    this.registerQueues()
  }
  registerQueues () {
    const queueRef = firebase.database().ref(this.queueRef || 'queue')

    return this.tasks.map((task) => {
      return new Queue(queueRef, {
        specId: this.taskPrefix ? `${this.taskPrefix}_${task.specId}` : task.specId,
        numWorkers: task.numWorkers
      }, createRunTask(task, this.run));
    })
  }
}
