class Logger {
    silent: boolean = true;
    maxLengthInfo: number = 100;

    info(message: any, ...args: any[]): void {
        this.log(message, console.info, args);
    }

    warn(message: any, ...args: any[]): void {
        this.log(message, console.warn, args);
    }

    error(message: any, ...args: any[]): void {
        console.error(this.loggable(message), ...args);
    }

    private log(message: any, method: (value: any, ...args: any[]) => void, args: any[]): void {
        if(!this.silent) {
            method(this.loggable(message), ...args.map((a: any) => this.loggable(a)));
        }
    }

    private loggable(message: any, allowNonString: boolean=false): string {
        if(Array.isArray(message)) {
            return this.stringify(message);
        }
        if(typeof message === 'object') {
            return this.stringify(Object.keys(message).reduce((result: any, key: any) => {
                    result[key] = this.loggable(message[key], true);
                    return result;
                }, {}));
        }
        const result = allowNonString ? message : `${message}`;
        return result.toString().length > this.maxLengthInfo
            ? result.toString().substring(0, this.maxLengthInfo) + '...'
            : result;
    }

    private stringify(obj: object) {
        return JSON.stringify(obj, null, '  ');
    }
}

export const logger: Logger = new Logger();
