export function websocket(url, onMessage) {
  let ws
  let rejectFn

  const promise = new Promise((resolve, reject) => {
    ws = new WebSocket(url)
    rejectFn = reject

    ws.onopen = () => {
      console.debug('WebSocket connected:', url)
    }

    ws.onmessage = event => {
      onMessage(
        event,
        value => {
          ws.close()
          resolve(value)
        },
        error => {
          ws.close()
          reject(error)
        }
      )
    }

    ws.onerror = error => {
      console.debug('WebSocket error:', error)
      reject(new Error('WebSocket error'))
    }

    ws.onclose = () => {
      console.debug('WebSocket closed')
    }
  })

  const close = () => {
    console.debug('WebSocket closed manually')
    ws.close()
    rejectFn(new Error('WebSocket closed'))
  }

  return { promise, close }
}
