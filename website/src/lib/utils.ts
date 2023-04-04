
const handle = async (func: (() => {}), fail: (message: string) => {}, after: () => {}) => {
    try {
        await func();
    } catch (error: any) {
        fail(error.message);
    } finally {
        after();
    }
 }

export default { handle };