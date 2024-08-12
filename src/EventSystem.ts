type Listener<T> = (data: T) => void;

class EventSystem {
    private events: { [key: string]: Listener<any>[] } = {};

    public on<T>(event: string, listener: Listener<T>): void {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    public emit<T>(event: string, data: T): void {
        if (this.events[event]) {
            this.events[event].forEach(listener => listener(data));
        }
    }
}

export const eventSystem = new EventSystem();
