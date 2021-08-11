class Logger {
    silent: boolean = true;

    info(message: any): void {
        this.log(message, console.info);
    }

    warn(message: any): void {
        this.log(message, console.warn);
    }

    error(message: any): void {
        this.log(message, console.error);
    }

    private log(message: any, method: (value: any) => void): void {
        if(!this.silent) {
            method(`${message}`);
        }
    }
}

export const logger: Logger = new Logger();
