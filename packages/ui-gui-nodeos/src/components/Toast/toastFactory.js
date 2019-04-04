let id = 0;

const defaultOptions = {
    color: "#000000"
};

export default function createToast (options) {
    return {
        ...defaultOptions,
        ...options,
        id: id++
    }
};