interface DebounceFunctionParams {
    fn: Function,
    delay: number,
}
/**
 * Creates a debounced version of a function.
 * @param {DebounceFunctionParams} params - The parameters object.
 * @param {Function} params.fn - The function to be debounced.
 * @param {number} params.delay - The delay in milliseconds.
 * @returns {Function} - The debounced function.
 */

export const debounceFn = ({ fn, delay }: DebounceFunctionParams) => {
    let timer: any = null;
    return function (this: any) {
        if (timer) clearTimeout(timer);
        let context = this;
        timer = setTimeout(() => {
            fn.call(context, arguments[0]);
        }, delay);
    }
};