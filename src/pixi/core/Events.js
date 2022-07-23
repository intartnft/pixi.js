const events = {}

class Events {
    addListener(event, listener, block) {
        if (events[event]) {
            events[event].push({block, listener})
        }else{
            events[event] = [{block, listener}]
        }
    }

    removeListener(listener) {
        events = events.filter(event => {
            return event.listener != listener
        })
    }

    fire(event, data) {
        if (events[event]) {
            events[event].forEach(event => {
                event.block(data)
            });
        }
    }
}

export default Events