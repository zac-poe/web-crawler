class Logger {
    silent: boolean = true;
    maxLengthInfo: number = 500;

    info(message: any): void {
        this.log(message, console.info);
    }

    warn(message: any): void {
        this.log(message, console.warn);
    }

    error(message: any): void {
        console.error(this.loggable(message));
    }

    private log(message: any, method: (value: any) => void): void {
        if(!this.silent) {
            method(this.loggable(message));
        }
    }

    private loggable(message: any): string {
        const result = `${message}`;
        return result.length > this.maxLengthInfo
            ? result.substring(0, this.maxLengthInfo) + '...'
            : result;
    }
}

export const logger: Logger = new Logger();
